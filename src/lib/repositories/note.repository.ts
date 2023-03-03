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

export class NoteRepository {
  async getAll(): Promise<Note[]> {
    const result = await prisma.note.findMany();
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
        title: data.title,
        content: data.content,
        color: data.color,
        slug,
      },
    });

    return noteSchema.parse(result);
  }

  async update(note: UpdateNote): Promise<Note | null> {
    const data = updateNoteSchema.parse(note);
    const noteToUpdate = await this.getById(note.id);

    if (noteToUpdate == null) {
      return null;
    }

    const slug =
      noteToUpdate.title === data.title
        ? noteToUpdate.slug
        : generateSlug(note.title.toLowerCase());

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
