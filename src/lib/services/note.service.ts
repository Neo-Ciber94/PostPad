import { NoteRepository } from "../repositories/note.repository";
import { CreateNote, Note, UpdateNote } from "../schemas/Note";

export class NoteService {
  private readonly repository = new NoteRepository();

  getAllNotes(): Promise<Note[]> {
    return this.repository.getAll();
  }

  getNoteById(id: string): Promise<Note | null> {
    return this.repository.getById(id);
  }

  getNoteBySlug(slug: string): Promise<Note | null> {
    return this.repository.getBySlug(slug);
  }

  createNote(note: CreateNote): Promise<Note> {
    return this.repository.create(note);
  }

  updateNote(note: UpdateNote): Promise<Note | null> {
    return this.repository.update(note);
  }

  deleteNote(id: string): Promise<Note | null> {
    return this.repository.delete(id);
  }
}
