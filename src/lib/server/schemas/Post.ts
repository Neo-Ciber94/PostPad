import * as z from "zod";
import { createTagSchema, tagSchema, updateTagSchema } from "./Tag";

export const postRules = Object.freeze({
  POST_TITLE_MAX_LENGTH: 100,
  POST_CONTENT_MAX_LENGTH: 16_777_200,
});

export type Post = z.infer<typeof postSchema>;

export type SharedPost = z.infer<typeof sharedPostSchema>;

export const sharedPostSchema = z.object({
  id: z.string(),
  postId: z.string(),
  createdAt: z.date(),
});

export const postSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  content: z.string().nullish(),
  tags: z.array(tagSchema).optional(),
  isAIGenerated: z.boolean(),

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

  sharedPost: z.array(sharedPostSchema).optional(),
});

export type CreatePost = z.infer<typeof createPostSchema>;

export const createPostSchema = z.object({
  title: z
    .string()
    .min(1)
    .max(postRules.POST_TITLE_MAX_LENGTH, { message: "content is too long" })
    .transform((s) => s.trim()),
  content: z
    .string()
    .max(postRules.POST_CONTENT_MAX_LENGTH)
    .optional()
    .transform((s) => (s != null ? s.trim() : s)),
  tags: z.array(createTagSchema).optional(),
  isAIGenerated: z.boolean().default(false).optional(),
});

export type UpdatePost = z.infer<typeof updatePostSchema>;

export const updatePostSchema = z.object({
  id: z.string(),
  title: z
    .string()
    .min(1)
    .max(postRules.POST_TITLE_MAX_LENGTH)
    .transform((s) => s.trim()),
  content: z
    .string()
    .max(postRules.POST_CONTENT_MAX_LENGTH, { message: "content is too long" })
    .optional()
    .transform((s) => (s != null ? s.trim() : s)),

  tags: z.array(updateTagSchema).optional(),
});
