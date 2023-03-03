"use client";
import NoteForm from "@/components/NoteForm";
import { CreateNote } from "@/lib/schemas/Note";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateNoteForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<unknown>();

  const handleSubmitNote = async (note: CreateNote) => {
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
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
        <NoteForm onSubmit={handleSubmitNote} />
        {isSubmitting && <p>Submitting...</p>}
        {error && <p className="text-red">{JSON.stringify(error)}</p>}
      </>
    </div>
  );
}
