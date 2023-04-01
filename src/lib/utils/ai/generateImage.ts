import { environment } from "@/lib/shared/env";
import type { CreateImageRequest } from "openai";
import { getErrorFromResponse } from "../getErrorFromResponse";

export type ImageRequest = CreateImageRequest & {
  signal?: AbortSignal;
};

export type CreateImageResponseData = { url: string };

export type CreateImageResponse = {
  created: number;
  data: CreateImageResponseData[];
};

export async function generateImage({ signal, ...payload }: ImageRequest) {
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${environment.OPENAI_API_KEY}`,
      "OpenAI-Organization": environment.OPENAI_ORGANIZATION_ID,
    },
    signal,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await getErrorFromResponse(res);
    console.error(error);
    throw new Error("Failed to generate image");
  }

  const json: CreateImageResponse = await res.json();
  console.log({ generateImageResponse: json });
  return json;
}
