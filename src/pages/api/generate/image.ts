import { imageGenerationPromptSchema } from "@/lib/server/schemas/Prompt";
import { createResponseFromError } from "@/lib/server/utils/createResponseFromError";
import { limitUserRequest } from "@/lib/server/utils/rateLimiter";
import { contentModeration } from "@/lib/utils/ai/contentModeration";
import { ImageRequest } from "@/lib/utils/ai/generateImage";
import { json } from "@/lib/utils/responseUtils";
import { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

export default async function handler(request: NextRequest) {
  try {
    await limitUserRequest(request.cookies);

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



    return json({
      prompt,
      url: "https://i.imgur.com/VeJ3BNH.png",
    });
  } catch (err) {
    console.error(err);
    return createResponseFromError(err);
  }
}
