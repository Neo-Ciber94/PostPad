"use client";
import NoteForm from "@/components/NoteForm";
import { UpdateNote } from "@/lib/schemas/Note";
import { getNoteBySlug } from "@/lib/server/notes";
import { RequestContext } from "@/lib/types/context";
import { useRouter } from "next/navigation";
import { useMutation } from "react-query";

type Params = {
  slug: string;
};

export default async function UpdateNoteForm(ctx: RequestContext<Params>) {
  const slug = ctx.params.slug;
  const note = await getNoteBySlug(slug);
  const router = useRouter();
  const mutation = useMutation(async (note: UpdateNote) => {
    const json = JSON.stringify(note);
    const result = await fetch("/api/notes", {
      body: json,
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    });

    console.log({ result });

    if (result.ok) {
      // Redirect
      router.push("/notes");
    }
  });

  return (
    <div className="p-4">
      <NoteForm
        onSubmit={(note) => mutation.mutateAsync(note)}
        isSubmitting={mutation.isLoading}
        error={mutation.error}
        note={note}
        isEditing
      />
    </div>
  );
}
