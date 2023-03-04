import NotesListPageBase from "@/components/pages/notes/NotesListPageBase";
import { getNotes } from "@/lib/server/notes";

export const metadata = {
  title: "NoteVine",
  description: "An application to create notes",
};

export default async function NotesListPage() {
  const notes = await getNotes();
  return <NotesListPageBase initialNotes={notes} />;
}
