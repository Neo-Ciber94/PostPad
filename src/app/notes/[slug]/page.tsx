import NotePageBase from "@/components/pages/notes/NotePageBase";
import notesLoader from "@/lib/server/loaders/notesLoader";
import { RequestContext } from "@/lib/server/types/RequestContext";
import { truncateString } from "@/lib/utils/truncateString";
import { Metadata } from "next";

export async function generateMetadata(
  ctx: RequestContext<{ slug: string }>
): Promise<Metadata> {
  const slug = ctx.params.slug;
  const note = await notesLoader.getNoteBySlug(slug);

  let description = note.content;

  if (description) {
    description = truncateString(description, 50);
  }

  return {
    title: `NoteVine | ${note.title}`,
    description,
  };
}

type Params = { slug: string };

export default async function NotePage(ctx: RequestContext<Params>) {
  const slug = ctx.params.slug;
  const note = await notesLoader.getNoteBySlug(slug);
  return <NotePageBase note={note} />;
}
