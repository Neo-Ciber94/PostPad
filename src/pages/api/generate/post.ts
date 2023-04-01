import { createChatCompletion } from "@/lib/utils/ai/createChatCompletion";
import { ChatCompletionRequestMessage } from "openai/dist/api";
import { json } from "@/lib/utils/responseUtils";
import { contentModeration } from "@/lib/utils/ai/contentModeration";
import { chatCompletionPromptSchema } from "@/lib/server/schemas/Prompt";
import { limitUserRequest } from "@/lib/server/utils/rateLimiter";
import { NextRequest } from "next/server";

// TODO: When edge api handlers in app directory are stable move this to there

// We use the edge runtime to allow streaming responses:
// https://nextjs.org/docs/api-reference/edge-runtime

export const config = {
  runtime: "edge",
};

export default async function handler(request: NextRequest) {
  try {
    await limitUserRequest(request.cookies);

    const input = await request.json();
    const result = chatCompletionPromptSchema.safeParse(input);

    if (result.success === false) {
      return json({ message: result.error }, { status: 400 });
    }

    const { prompt } = result.data;
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

    const messages: ChatCompletionRequestMessage[] = [
      {
        role: "system",
        content:
          "Generate an HTML post with a title in <h1>, at leasts 2 paragraphs <p>, add <br> after headers, paragraphs, lists, and blocks",
      },
      {
        role: "user",
        content: `Write a post about: ${prompt}`,
      },
    ];

    const stream = await createChatCompletion({
      model: "gpt-3.5-turbo",
      messages,
      max_tokens: 1024,
      temperature: 0.5,
      top_p: 1,
      n: 1,
      stream: true,
      signal: request.signal,
    });

    return new Response(stream);
  } catch (err) {
    console.error(err);
    return json(err, { status: 500 });
  }
}
