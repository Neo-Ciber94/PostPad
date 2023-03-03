"use client";
import { Note, UpdateNote } from "@/lib/schemas/Note";
import { useRouter } from "next/navigation";
import { useState } from "react";
import NoteForm from "./NoteForm";

interface UpdateNoteFormProps {
  note: Note;
}

export default function UpdateNoteForm({ note }: UpdateNoteFormProps) {
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
