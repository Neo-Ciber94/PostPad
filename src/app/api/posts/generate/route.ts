import { createChatCompletion } from "@/lib/utils/ai/createChatCompletion";
import { noEmptyPrompt } from "@/lib/utils/schemas/noempty";
import { ChatCompletionRequestMessage } from "openai/dist/api";
import { json } from "@/lib/utils/responseUtils";
import { z } from "zod";
//import { contentModeration } from "@/lib/utils/ai/contentModeration";

export const config = {
  runtime: "edge",
};

const generatePostSchema = z.object({
  prompt: z.string().pipe(noEmptyPrompt),
});

export async function POST(request: Request) {
  const input = await request.json();
  const result = generatePostSchema.safeParse(input);

  if (result.success === false) {
    return json(
      { message: result.error },
      {
        status: 400,
      }
    );
  }

  const { prompt } = result.data;
  // const moderationResult = await contentModeration(prompt, request.signal);
  // const anyFlagged = moderationResult.results.some((x) => x.flagged === true);

  // if (anyFlagged) {
  //   return json(
  //     {
  //       message:
  //         "We're unable to process your prompt at this time, as it has been flagged for moderation",
  //     },
  //     { status: 400 }
  //   );
  // }

  const messages: ChatCompletionRequestMessage[] = [
    {
      role: "system",
      content:
        "Generate posts in HTML, include a title with <h1> and at leasts 2 paragraphs <p> separated by <br>",
    },
    {
      role: "user",
      content: `Write a post about: ${prompt}`,
    },
  ];

  try {
    const stream = await createChatCompletion({
      model: "gpt-3.5-turbo",
      messages,
      max_tokens: 1024,
      temperature: 0,
      top_p: 1,
      n: 1,
      stream: true,
      signal: request.signal,
    });

    return new Response(stream);
  } catch (err) {
    console.error(err);

    return json(err, {
      status: 500,
    });
  }
}
