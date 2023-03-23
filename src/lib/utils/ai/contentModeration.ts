import { environment } from "@/lib/shared/env";
import type { CreateModerationResponse, CreateModerationRequest } from "openai";
import { throwOnResponseError } from "../throwOnResponseError";

export async function contentModeration(prompt: string, signal?: AbortSignal) {
  const request: CreateModerationRequest = {
    input: prompt,
  };

  const res = await fetch("https://api.openai.com/v1/moderations", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${environment.OPENAI_API_KEY}`,
      "OpenAI-Organization": environment.OPENAI_ORGANIZATION_ID,
    },
    method: "POST",
    signal,
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    await throwOnResponseError(res);
  }

  const data: CreateModerationResponse = await res.json();
  return data;
}
