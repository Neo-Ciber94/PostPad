import { z } from "zod";

export const tagRules = Object.freeze({
  TAG_MAX_NAME_LENGTH: 25,
});

export const tagSchema = z.object({
  id: z.string(),
  name: z.string(),
  postId: z.string(),
});

export type Tag = z.infer<typeof tagSchema>;

export const createTagSchema = z.object({
  name: z.string().min(1).max(tagRules.TAG_MAX_NAME_LENGTH),
});

export const updateTagSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1).max(tagRules.TAG_MAX_NAME_LENGTH),
});
