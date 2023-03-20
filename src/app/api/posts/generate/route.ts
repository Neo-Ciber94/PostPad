import { environment } from "@/lib/shared/env";
import { NextResponse } from "next/server";
//import { Configuration, OpenAIApi } from "openai";
import { CreateCompletionRequest } from "openai/dist/api";
import { z } from "zod";

const generatePostSchema = z.object({
  prompt: z.string(),
});

export async function POST(req: Request) {
  const result = generatePostSchema.safeParse(req.body);

  if (result.success === false) {
    return NextResponse.json(
      { message: result.error },
      {
        status: 400,
      }
    );
  }

  const { prompt } = result.data;
//   const configuration = new Configuration({
//     organization: environment.OPENAI_ORGANIZATION_ID,
//     apiKey: environment.OPENAI_API_KEY,
//   });

  //const openai = new OpenAIApi(configuration);
  const competitionRequest: CreateCompletionRequest = {
    model: "gpt-3.5-turbo",
    prompt,
    max_tokens: 2048,
    temperature: 0,
    top_p: 1,
    n: 1,
    stream: true,
  };

  const completion = await fetch("https://api.openai.com/v1/chat/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${environment.OPENAI_API_KEY}`,
      "OpenAI-Organization": environment.OPENAI_ORGANIZATION_ID,
    },
    method: "POST",
    body: JSON.stringify(competitionRequest),
    signal: req.signal,
  });

  if (!completion.ok) {
    const error = getErrorFromResponse(completion);
    return NextResponse.json({ error }, { status: 500 });
  }

  const reader = completion.body?.getReader();

  if (reader == null) {
    return NextResponse.json(
      {
        message: "Failed to generate completion",
      },
      { status: 500 }
    );
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  return new ReadableStream({
    async start(controller) {
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value: data } = await reader.read();

        const message = decoder.decode(data);

        if (message === "[DONE]" || done) {
          break;
        }

        const chunk = encoder.encode(message);
        controller.enqueue(chunk);
      }
    },
  });
}

async function getErrorFromResponse(
  response: Response
): Promise<unknown | null> {
  if (response.headers.get("Content-Type") === "application/json") {
    const json = await response.json();

    if (json == null) {
      return null;
    }

    try {
      return JSON.stringify(json);
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  const text = await response.text();
  return text;
}
