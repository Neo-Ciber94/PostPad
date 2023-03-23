import { z } from "zod";

const MAX_PROMPT_LENGTH = 200;

const noEmptyPrompt = z
  .string()
  .transform((t) => t?.trim())
  .pipe(
    z
      .string()
      .min(6, {
        message: "The prompt should be more detailed",
      })
      .max(MAX_PROMPT_LENGTH)
  );

export const promptSchema = z.object({
  prompt: z.string().pipe(noEmptyPrompt),
});
