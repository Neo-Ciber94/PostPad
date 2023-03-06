import EditNotePageBase from "@/components/pages/notes/EditNotePageBase";
import notesLoader from "@/lib/server/loaders/notesLoader";
import { RequestContext } from "@/lib/server/types/RequestContext";
import { wait } from "@/lib/utils/wait";

export const metadata = {
  title: "NoteVine | Edit",
  description: "Edit a note",
};

type Params = { slug: string };

export default async function EditNotePage(ctx: RequestContext<Params>) {
  const { slug } = ctx.params;
  const note = await notesLoader.getNoteBySlug(slug);
  return <EditNotePageBase note={note} />;
}
