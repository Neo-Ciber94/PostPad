import { z } from "zod";

const MAX_PROMPT_LENGTH = 200;

export const chatCompletionPromptSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(6, {
      message: "The prompt should be more detailed",
    })
    .max(MAX_PROMPT_LENGTH),
});

const MAX_IMAGE_PROMPT_LENGTH = 200;

export const imageGenerationPromptSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(1, { message: "prompt cannot be empty" })
    .max(MAX_IMAGE_PROMPT_LENGTH),
});
