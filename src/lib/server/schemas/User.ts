import { z } from "zod";

export type User = z.infer<typeof userSchema>;

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
});
