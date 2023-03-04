import { notFound } from "next/navigation";
import { NoteService } from "../services/note.service";
import { SearchParams } from "../types/RequestContext";
import { getArray } from "../utils/getArray";

export async function getNoteBySlug(slug: string) {
  const noteService = new NoteService();
  const result = await noteService.getNoteBySlug(slug);

  if (result == null) {
    return notFound();
  }

  return result;
}

export async function getNotes(searchParams: SearchParams = {}) {
  const noteService = new NoteService();
  const search = getArray(searchParams["search"] || [])[0];
  const notes = await noteService.getAllNotes({ search });
  return notes;
}
