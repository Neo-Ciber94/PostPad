import NotePageBase from "@/components/pages/notes/NotePageBase";
import notesLoader from "@/lib/server/loaders/notesLoader";

import { RequestContext } from "@/lib/server/types/RequestContext";
import { Metadata } from "next";

export async function generateMetadata(
  ctx: RequestContext<{ slug: string }>
): Promise<Metadata> {
  const slug = ctx.params.slug;
  const note = await notesLoader.getNoteBySlug(slug);

  return {
    title: `NoteVine | ${note.title}`,
    description: note.content == null ? undefined : note.content,
  };
}

type Params = { slug: string };

export default async function NotePage(ctx: RequestContext<Params>) {
  const slug = ctx.params.slug;
  const note = await notesLoader.getNoteBySlug(slug);
  return <NotePageBase note={note} />;
}
