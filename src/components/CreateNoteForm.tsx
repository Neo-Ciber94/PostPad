"use client";
import NoteForm from "@/components/NoteForm";
import { CreateNote } from "@/lib/schemas/Note";
import { useRouter } from "next/navigation";
import { useMutation } from "react-query";

export default function CreateNoteForm() {
  const router = useRouter();
  const mutation = useMutation(async (note: CreateNote) => {
    const json = JSON.stringify(note);
    const result = await fetch("/api/notes", {
      body: json,
      method: "POST",
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
      />
    </div>
  );
}
