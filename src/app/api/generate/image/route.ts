import { imageGenerationPromptSchema } from "@/lib/server/schemas/Prompt";
import { ImageService } from "@/lib/server/services/image.service";
import { createResponseFromError } from "@/lib/server/utils/createResponseFromError";
import { getCurrentUserId } from "@/lib/server/utils/getCurrentUserId";
import { limitUserRequest } from "@/lib/server/utils/rateLimiter";
import { contentModeration } from "@/lib/utils/ai/contentModeration";
import { generateImage } from "@/lib/utils/ai/generateImage";
import { json } from "@/lib/utils/responseUtils";
import { NextRequest } from "next/server";
import { PutObjectCommand, PutObjectCommandOutput, S3Client } from "@aws-sdk/client-s3";
import { cookies as getCookies } from "next/headers";
import { environment } from "@/lib/shared/env";
import { throwOnResponseError } from "@/lib/utils/throwOnResponseError";

// FIXME: This may timeout the serverless function:
// move to edge?
// https://vercel.com/docs/concepts/limits/overview#general-limits

export async function POST(request: NextRequest) {
  try {
    const cookies = getCookies();
    await limitUserRequest(cookies);

    const input = await request.json();
    const { prompt } = imageGenerationPromptSchema.parse(input);
    const moderationResult = await contentModeration(prompt, request.signal);
    const anyFlagged = moderationResult.results.some((x) => x.flagged === true);

    if (anyFlagged) {
      return json(
        {
          message:
            "We're unable to process your prompt at this time, as it has been flagged for moderation",
        },
        { status: 400 }
      );
    }

    const userId = await getCurrentUserId();
    const imageResponse = await generateImage({
      prompt,
      n: 1,
      signal: request.signal,
      response_format: "url",
      size: "1024x1024",
      user: userId,
    });

    const service = new ImageService();
    const generatedImages = imageResponse.data.map((data) => data.url);

    // Save images to external storage
    const imageUrls = await uploadImages(generatedImages, /* metadata */ { prompt });

    const result = await service.createImages({
      createdByPrompt: prompt,
      imageUrls,
    });

    return json(result);
  } catch (err) {
    console.error(err);
    return createResponseFromError(err);
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const searchString = searchParams.get("search");

  const service = new ImageService();
  const search =
    searchString == null || searchString.trim().length === 0 ? undefined : searchString;

  const result = await service.getAllImages({ search });
  return json(result);
}

interface UploadImageMetadata {
  prompt: string;
  [key: string]: string;
}

async function uploadImages(generatedImagesUrls: string[], metadata: UploadImageMetadata) {
  const imageUrls: string[] = [];

  const client = new S3Client({
    region: "auto",
    credentials: {
      accessKeyId: environment.R2_ACCESS_KEY,
      secretAccessKey: environment.R2_SECRET_KEY,
    },
    endpoint: environment.R2_BUCKET_ENDPOINT,
  });

  const uploadImagePromises: Promise<[PutObjectCommandOutput, string]>[] = [];

  for (const generatedImageUrl of generatedImagesUrls) {
    const promise = uploadImage(client, generatedImageUrl, metadata);
    uploadImagePromises.push(promise);
  }

  const responses = await Promise.all(uploadImagePromises);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const [_, fileName] of responses) {
    const bucket = environment.R2_BUCKET_NAME;
    const url = `${environment.R2_PUBLIC_URL}/${bucket}/${fileName}`;
    imageUrls.push(url);
  }

  console.log({ imageUrls, uploads: responses });
  return imageUrls;
}

async function uploadImage(
  client: S3Client,
  sourceUrl: string,
  metadata: UploadImageMetadata
): Promise<[PutObjectCommandOutput, string]> {
  const res = await fetch(sourceUrl, {
    cache: "no-store",
  });
  await throwOnResponseError(res);

  const buffer = await res.arrayBuffer();
  const arr = new Uint8Array(buffer);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const contentType = res.headers.get("content-type")!;
  const { pathname } = new URL(sourceUrl);
  const parts = pathname.split("/");
  const fileName = parts[parts.length - 1];

  const command = new PutObjectCommand({
    ContentType: contentType,
    Bucket: environment.R2_BUCKET_NAME,
    Key: fileName,
    Body: arr,
    ACL: "public-read",
    Metadata: {
      sourceUrl,
      ...metadata,
    },
  });

  const result = await client.send(command);
  return [result, fileName];
}
