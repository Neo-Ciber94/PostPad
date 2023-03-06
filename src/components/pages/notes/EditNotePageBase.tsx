"use client";
import NoteForm from "@/components/NoteForm";
import { Note, UpdateNote } from "@/lib/server/schemas/Note";
import { useRouter } from "next/navigation";
import { useMutation } from "react-query";

interface EditNotePageBase {
  note: Note;
}

export default function EditNotePageBase({ note }: EditNotePageBase) {
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
