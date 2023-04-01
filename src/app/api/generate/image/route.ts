import { imageGenerationPromptSchema } from "@/lib/server/schemas/Prompt";
import { ImageService } from "@/lib/server/services/image.service";
import { createResponseFromError } from "@/lib/server/utils/createResponseFromError";
import { getCurrentUserId } from "@/lib/server/utils/getCurrentUserId";
import { limitUserRequest } from "@/lib/server/utils/rateLimiter";
import { contentModeration } from "@/lib/utils/ai/contentModeration";
import { generateImage } from "@/lib/utils/ai/generateImage";
import { json } from "@/lib/utils/responseUtils";
import { NextRequest } from "next/server";
import { cookies as getCookies } from "next/headers";

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
    const imageUrls = imageResponse.data.map((data) => data.url);
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
