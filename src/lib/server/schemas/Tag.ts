import { z } from "zod";
import { CONSTANTS } from "../../shared/constants";

export const tagSchema = z.object({
  id: z.string(),
  name: z.string(),
  noteId: z.string(),
});

export type Tag = z.infer<typeof tagSchema>;

export const createTagSchema = z.object({
  name: z.string().min(1).max(CONSTANTS.MAX_TAG_LENGTH),
});

export const updateTagSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1).max(CONSTANTS.MAX_TAG_LENGTH),
});
