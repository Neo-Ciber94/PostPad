import EditNotePageBase from "@/components/pages/notes/EditNotePageBase";
import { getNoteBySlug } from "@/lib/server/notes";
import { RequestContext } from "@/lib/types/RequestContext";
import { wait } from "@/lib/utils/wait";

export const metadata = {
  title: "NoteVine | Edit",
  description: "Edit a note",
};

type Params = { slug: string };

export default async function EditNotePage(ctx: RequestContext<Params>) {
  await wait(3000);
  const { slug } = ctx.params;
  const note = await getNoteBySlug(slug);
  return <EditNotePageBase note={note} />;
}
