import { createChatCompletion } from "@/lib/utils/createChatCompletion";
import { noEmptyPrompt } from "@/lib/utils/schemas/noempty";
import { ChatCompletionRequestMessage } from "openai/dist/api";
import { json } from "@/lib/utils/responseUtils";
import { z } from "zod";

const generatePostSchema = z.object({
  prompt: z.string().pipe(noEmptyPrompt),
});

export async function POST(request: Request) {
  const json = await request.json();
  const result = generatePostSchema.safeParse(json);

  if (result.success === false) {
    return json(
      { message: result.error },
      {
        status: 400,
      }
    );
  }

  const { prompt } = result.data;
  const messages: ChatCompletionRequestMessage[] = [
    {
      role: "system",
      content: "You are a bott that generates posts in HTML about a topic",
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
