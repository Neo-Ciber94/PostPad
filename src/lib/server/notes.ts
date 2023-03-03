import { notFound } from "next/navigation";
import { NoteService } from "../services/note.service";

export async function getNoteBySlug(slug: string) {
  const noteService = new NoteService();
  const result = await noteService.getNoteBySlug(slug);

  if (result == null) {
    return notFound();
  }

  return result;
}

export async function getNotes() {
  const noteService = new NoteService();
  const notes = await noteService.getAllNotes();
  return notes;
}
