import { z } from "zod";

export const generatedImageSchema = z.object({
  id: z.string(),
  url: z.string(),
  createdByPrompt: z.string(),
  createdAt: z
    .string()
    .or(z.date())
    .pipe(z.coerce.date())
    .transform((d) => d.toUTCString()),
});

export type GeneratedImage = z.infer<typeof generatedImageSchema>;

export const createGeneratedImageSchema = z.object({
  imageUrls: z.array(z.string()).min(1),
  createdByPrompt: z.string(),
});

export type CreateGeneratedImage = z.infer<typeof createGeneratedImageSchema>;
