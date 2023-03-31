import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from "eventsource-parser";
import { CreateChatCompletionRequest } from "openai";
import { environment } from "../../shared/env";
import { getErrorFromResponse } from "../getErrorFromResponse";

export interface ChatCompletionPayload extends CreateChatCompletionRequest {
  signal: AbortSignal;
}

export interface ChatCompletion {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Choice[];
}

export interface Choice {
  index: number;
  finish_reason?: string | null;
  delta: { content?: string };
}

/**
 * Creates a stream that resolves with the chat completions of the given request.
 * @param payload The request to generate the completion.
 */
export async function createChatCompletion(
  payload: ChatCompletionPayload
): Promise<ReadableStream> {
  const { signal, ...request } = payload;
  const completion = await fetch("https://api.openai.com/v1/chat/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${environment.OPENAI_API_KEY}`,
      "OpenAI-Organization": environment.OPENAI_ORGANIZATION_ID,
    },
    method: "POST",
    signal,
    body: JSON.stringify(request),
  });

  if (!completion.ok) {
    const error = await getErrorFromResponse(completion);
    console.error(error);
    throw new Error("Failed to generate completion");
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream({
    async start(controller) {
      function onParse(event: ParsedEvent | ReconnectInterval) {
        if (event.type === "event") {
          const data = event.data;
          // https://beta.openai.com/docs/api-reference/completions/create#completions/create-stream
          if (data === "[DONE]") {
            controller.close();
            return;
          }

          try {
            const json = JSON.parse(data) as ChatCompletion;
            const content = json.choices[0].delta?.content || "";
            const chunk = encoder.encode(content);
            controller.enqueue(chunk);
          } catch (err) {
            console.error(err);
            controller.error(err);
          }
        }
      }

      if (completion.body == null) {
        throw new Error("stream is null");
      }

      // The body of a readable stream is a valid async iterator
      // https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream#async_iteration_of_a_stream_using_for_await...of
      // This allow us to correctly parse the server sent events
      const parser = createParser(onParse);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for await (const chunk of completion.body as any) {
        parser.feed(decoder.decode(chunk));
      }
    },
  });

  return stream;
}


