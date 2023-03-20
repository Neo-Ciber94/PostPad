import { createChatCompletion } from "@/lib/utils/createChatCompletion";
import { NextResponse } from "next/server";
import { ChatCompletionRequestMessage } from "openai/dist/api";
import { z } from "zod";

const nonempty = z
  .string()
  .transform((t) => t?.trim())
  .pipe(
    z.string().min(6, {
      message: "The prompt should be more detailed",
    })
  );

const generatePostSchema = z.object({
  prompt: z.string().pipe(nonempty),
});

export async function POST(req: Request) {
  const result = generatePostSchema.safeParse(req.body);
  console.log({result});

  if (result.success === false) {
    return NextResponse.json(
      { message: result.error },
      {
        status: 400,
      }
    );
  }

  const { prompt } = result.data;
  console.log(prompt);
  const messages: ChatCompletionRequestMessage[] = [
    {
      role: "system",
      content:
        "You are an assistant generate written posts in HTML about a topic",
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
      max_tokens: 2048,
      temperature: 0,
      top_p: 1,
      n: 1,
      signal: req.signal,
    });

    return new Response(stream);
  } catch (err) {
    console.error(err);

    return NextResponse.json(err, {
      status: 500,
    });
  }
}
