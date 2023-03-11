import * as z from "zod";
import { createTagSchema, tagSchema, updateTagSchema } from "./Tag";

export type Post = z.infer<typeof postSchema>;

export const postSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  content: z.string().optional(),
  tags: z.array(tagSchema).optional(),
  createdAt: z
    .string()
    .or(z.date())
    .pipe(z.coerce.date())
    .transform((d) => d.toUTCString()),
  updatedAt: z
    .string()
    .or(z.date())
    .pipe(z.coerce.date())
    .nullable()
    .transform((d) => (d == null ? null : d.toUTCString())),
});

export type CreatePost = z.infer<typeof createPostSchema>;

export const createPostSchema = z.object({
  title: z
    .string()
    .min(1)
    .transform((s) => s.trim()),
  content: z
    .string()
    .optional()
    .transform((s) => (s != null ? s.trim() : s)),
  tags: z.array(createTagSchema).optional(),
});

export type UpdatePost = z.infer<typeof updatePostSchema>;

export const updatePostSchema = z.object({
  id: z.string(),
  title: z
    .string()
    .min(1)
    .transform((s) => s.trim()),
  content: z
    .string()
    .optional()
    .transform((s) => (s != null ? s.trim() : s)),

  tags: z.array(updateTagSchema).optional(),
});
