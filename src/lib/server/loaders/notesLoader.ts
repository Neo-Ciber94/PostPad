import { NoteService } from "@/lib/server/services/note.service";
import { SearchParams } from "@/lib/server/types/RequestContext";
import { getArray } from "@/lib/utils/getArray";
import { notFound } from "next/navigation";

const notesLoader = {
  /**
   * Gets the note with the given slug.
   */
  async getNoteBySlug(slug: string) {
    const noteService = new NoteService();
    const result = await noteService.getNoteBySlug(slug);

    if (result == null) {
      return notFound();
    }

    return result;
  },

  /**
   * Get all the notes.
   */
  async getNotes(searchParams: SearchParams = {}) {
    const noteService = new NoteService();
    const search = getArray(searchParams["search"] || [])[0];
    const notes = await noteService.getAllNotes({ search });
    return notes;
  },
};

export default notesLoader;
