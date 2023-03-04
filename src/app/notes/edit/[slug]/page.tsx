import UpdateNoteForm from "@/components/UpdateNoteForm";
import { getNoteBySlug } from "@/lib/server/notes";
import { RequestContext } from "@/lib/types/RequestContext";

export const metadata = {
  title: "NoteVine | Edit",
  description: "Edit a note",
};

type Params = { slug: string };

export default async function EditNotePage(ctx: RequestContext<Params>) {
  const { slug } = ctx.params;
  const note = await getNoteBySlug(slug);
  return <UpdateNoteForm note={note} />;
}
