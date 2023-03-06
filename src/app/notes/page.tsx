import NotesListPageBase from "@/components/pages/notes/NotesListPageBase";
import notesLoader from "@/lib/server/loaders/notesLoader";
import { RequestContext } from "@/lib/server/types/RequestContext";

export const metadata = {
  title: "NoteVine",
  description: "An application to create notes",
};

export default async function NotesListPage({ searchParams }: RequestContext) {
  const notes = await notesLoader.getNotes(searchParams);
  return <NotesListPageBase initialNotes={notes} />;
}
