import NoteView from "@/components/NoteView";
import { getNoteBySlug } from "@/lib/server/notes";
import { RequestContext } from "@/lib/types/context";

type Params = { slug: string };

export default async function NotePage(ctx: RequestContext<Params>) {
  const slug = ctx.params.slug;
  const note = await getNoteBySlug(slug);

  return <NoteView note={note} />;
}
