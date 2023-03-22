import { environment } from "@/lib/shared/env";
import { OpenAIApi, Configuration, CreateModerationRequest } from "openai";

export async function contentModeration(prompt: string, signal?: AbortSignal) {
  const config = new Configuration({
    apiKey: environment.OPENAI_API_KEY,
    organization: environment.OPENAI_ORGANIZATION_ID,
  });

  const openAI = new OpenAIApi(config);
  const request: CreateModerationRequest = {
    input: prompt,
  };

  const result = await openAI.createModeration(request, { signal });
  return result.data;
}
