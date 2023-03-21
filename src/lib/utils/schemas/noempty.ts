import { z } from "zod";

export const noEmptyPrompt = z
  .string()
  .transform((t) => t?.trim())
  .pipe(
    z.string().min(6, {
      message: "The prompt should be more detailed",
    })
  );
