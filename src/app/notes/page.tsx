import NotesListPageBase from "@/components/pages/notes/NotesListPageBase";
import { getNotes } from "@/lib/server/notes";
import { RequestContext } from "@/lib/types/RequestContext";

export const metadata = {
  title: "NoteVine",
  description: "An application to create notes",
};

export default async function NotesListPage({ searchParams }: RequestContext) {
  const notes = await getNotes(searchParams);
  return <NotesListPageBase initialNotes={notes} />;
}
