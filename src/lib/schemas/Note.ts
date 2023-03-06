import * as z from "zod";
import { createTagSchema, tagSchema, updateTagSchema } from "./Tag";

export type Note = z.infer<typeof noteSchema>;

export const noteSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  color: z.string().nullable(),
  content: z.string().optional(),
  tags: z.array(tagSchema).optional(),
  createdAt: z.string().or(z.date()).pipe(z.coerce.date()),
  updatedAt: z.string().or(z.date()).pipe(z.coerce.date()).nullable(),
});

export type CreateNote = z.infer<typeof createNoteSchema>;

export const createNoteSchema = z.object({
  title: z
    .string()
    .min(1)
    .transform((s) => s.trim()),
  color: z.string().optional(),
  content: z
    .string()
    .optional()
    .transform((s) => (s != null ? s.trim() : s)),
  tags: z.array(createTagSchema).optional(),
});

export type UpdateNote = z.infer<typeof updateNoteSchema>;

export const updateNoteSchema = z.object({
  id: z.string(),
  title: z
    .string()
    .min(1)
    .transform((s) => s.trim()),
  color: z
    .string()
    .nullish()
    .transform((s) => (s != null ? s.trim() : s)),
  content: z
    .string()
    .optional()
    .transform((s) => (s != null ? s.trim() : s)),

  tags: z.array(updateTagSchema).optional(),
});
