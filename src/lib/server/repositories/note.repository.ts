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
import { arrayPartition } from "../../utils/arrayUtils";
import { generateSlug } from "../../utils/generateSlug";

const getAllNotesOptionsSchema = z.object({
  search: z.string().optional(),
  pagination: z
    .object({
      page: z.number().min(1).optional(),
      limit: z.number().min(1).optional(),
    })
    .optional(),
});

export type GetAllNotesOptions = z.infer<typeof getAllNotesOptionsSchema>;

export class NoteRepository {
  async getAll(options: GetAllNotesOptions = {}): Promise<Note[]> {
    const { search, skip, take } = getQueryCriteriaFromOptions(options);

    const result = await prisma.note.findMany({
      where:
        search == null
          ? undefined
          : {
              content: { search },
              title: { search },
            },
      take,
      skip,
      include: {
        tags: true,
      },
    });

    return result.map((x) => noteSchema.parse(x));
  }

  async getById(id: string): Promise<Note | null> {
    const result = await prisma.note.findFirst({
      where: { id },
      include: { tags: true },
    });

    if (result == null) {
      return null;
    }

    return noteSchema.parse(result);
  }

  async getBySlug(slug: string): Promise<Note | null> {
    const result = await prisma.note.findFirst({
      where: { slug },
      include: { tags: true },
    });

    if (result == null) {
      return null;
    }

    return noteSchema.parse(result);
  }

  async create(note: CreateNote): Promise<Note> {
    const data = createNoteSchema.parse(note);
    const slug = generateSlug(note.title.toLowerCase());
    const tags = note.tags || [];

    const result = await prisma.note.create({
      data: {
        title: data.title.trim(),
        content: data.content?.trim(),
        slug,
        tags: {
          create: tags,
        },
      },
    });

    return noteSchema.parse(result);
  }

  async update(note: UpdateNote): Promise<Note | null> {
    const data = updateNoteSchema.parse(trimStrings(note));
    const noteToUpdate = await prisma.note.findFirst({
      where: { id: note.id },
    });

    if (noteToUpdate == null) {
      return null;
    }

    // Only generate a new slug if the title changed
    const slug =
      data.title === noteToUpdate.title
        ? noteToUpdate.slug
        : generateSlug(note.title.toLowerCase());

    // The split the new and current tags
    const [newTags, tags] = arrayPartition(
      note.tags || [],
      (x) => x.id == null
    );

    console.log({ newTags, note });
    const result = await prisma.note.update({
      where: { id: note.id },
      data: {
        ...noteToUpdate,
        ...data,
        slug,
        tags: {
          // TODO: Not sure if this code will work anywhere,
          // we must be sure the tags are deleted first
          // and then we add the new tags, in that order.

          // Delete the relations not included in the current tags
          deleteMany: {
            id: {
              notIn: tags.map((x) => x.id!),
            },
          },

          // Insert the new tags
          create: newTags,
        },
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

function getQueryCriteriaFromOptions(options: GetAllNotesOptions) {
  const DEFAULT_LIMIT = 100;

  // On invalid parse we just ignore the result
  const optionsResult = getAllNotesOptionsSchema.safeParse(options);
  const { pagination, search } = optionsResult.success
    ? options
    : ({} as GetAllNotesOptions);

  let skip: number | undefined;
  let take: number | undefined;

  if (pagination) {
    const page = pagination.page || 1;
    take = pagination.limit;
    skip = (page - 1) * (pagination.limit || DEFAULT_LIMIT);
  }

  return { search, take, skip };
}
