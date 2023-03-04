import { z } from "zod";
import { prisma } from "../database/prisma";
import {
  CreateNote,
  createNoteSchema,
  Note,
  noteSchema,
  UpdateNote,
  updateNoteSchema,
} from "../schemas/Note";
import { generateSlug } from "../utils/generateSlug";

const getAllNotesOptionsSchema = z.object({
  search: z.string().optional(),
  pagination: z
    .object({
      page: z.number().min(1),
      limit: z.number().min(1).default(100),
    })
    .optional(),
});

export type GetAllNotesOptions = z.infer<typeof getAllNotesOptionsSchema>;

export class NoteRepository {
  async getAll(options: GetAllNotesOptions = {}): Promise<Note[]> {
    // On invalid parse we just ignore the result
    const optionsResult = getAllNotesOptionsSchema.safeParse(options);
    const { pagination, search } = optionsResult.success
      ? options
      : ({} as GetAllNotesOptions);

    // We use unknown just to ignore prisma return type
    let result: unknown[] = [];

    // Pagination
    const take = pagination?.limit;
    const skip =
      pagination == null ? undefined : (pagination.page - 1) * pagination.limit;

    if (!!search && search.trim().length === 0) {
      result = await prisma.note.findMany({
        where: {
          OR: [
            { title: { contains: search } },
            { content: { contains: search } },
          ],
        },
        take,
        skip,
      });
    } else {
      result = await prisma.note.findMany({
        take,
        skip,
      });
    }

    return result.map((x) => noteSchema.parse(x));
  }

  async getById(id: string): Promise<Note | null> {
    const result = await prisma.note.findFirst({ where: { id } });

    if (result == null) {
      return null;
    }

    return noteSchema.parse(result);
  }

  async getBySlug(slug: string): Promise<Note | null> {
    const result = await prisma.note.findFirst({ where: { slug } });

    if (result == null) {
      return null;
    }

    return noteSchema.parse(result);
  }

  async create(note: CreateNote): Promise<Note> {
    const data = createNoteSchema.parse(note);
    const slug = generateSlug(note.title.toLowerCase());
    const result = await prisma.note.create({
      data: {
        title: data.title.trim(),
        content: data.content?.trim(),
        color: data.color?.trim(),
        slug,
      },
    });

    return noteSchema.parse(result);
  }

  async update(note: UpdateNote): Promise<Note | null> {
    const data = updateNoteSchema.parse(trimStrings(note));
    const noteToUpdate = await this.getById(note.id);

    if (noteToUpdate == null) {
      return null;
    }

    const slug = generateSlug(note.title.toLowerCase());

    const result = await prisma.note.update({
      where: { id: note.id },
      data: {
        ...noteToUpdate,
        ...data,
        slug,
      },
    });

    return noteSchema.parse(result);
  }

  async delete(id: string): Promise<Note | null> {
    const noteToDelete = await this.getById(id);

    if (noteToDelete == null) {
      return null;
    }

    const result = await prisma.note.delete({
      where: { id },
    });

    return noteSchema.parse(result);
  }
}

function trimStrings<T extends Record<string, unknown>>(obj: T): T {
  for (const key in obj) {
    const value = obj[key];

    if (typeof value === "string") {
      obj[key] = value.trim() as any;
    }
  }
  return obj;
}
