"use client";
import NoteForm from "@/components/NoteForm";
import { UpdateNote } from "@/lib/schemas/Note";
import { NoteService } from "@/lib/services/note.service";
import { notFound, useRouter } from "next/navigation";
import { useState } from "react";

async function getNoteBySlug(slug: string) {
  const noteService = new NoteService();
  const result = await noteService.getNoteBySlug(slug);

  if (result == null) {
    return notFound();
  }

  return result;
}

type EditNoteContext = {
  params: {
    slug: string;
  };
};

export default async function EditNotePage(ctx: EditNoteContext) {
  const { slug } = ctx.params;
  const note = await getNoteBySlug(slug);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<unknown>();

  const handleSubmitNote = async (note: UpdateNote) => {
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/notes", {
        method: "PUT",
        body: JSON.stringify(note),
        headers: {
          "content-type": "application/json",
        },
      });

      if (res.ok) {
        router.push("/");
        return;
      }

      if (res.headers.get("content-type") === "application/json") {
        const error = await res.json();
        setError(error);
      } else {
        setError({ error: res.statusText });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      <>
        <NoteForm onSubmit={handleSubmitNote} note={note} isEditing />
        {isSubmitting && <p>Submitting...</p>}
        {error && <p className="text-red">{JSON.stringify(error)}</p>}
      </>
    </div>
  );
}
