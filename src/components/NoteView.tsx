"use client";
import "@uiw/react-markdown-preview/markdown.css";
import { Note } from "@/lib/schemas/Note";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { useRouter } from "next/navigation";
import Button from "./Button";

export interface NoteViewProps {
  note: Note;
}

export default function NoteView({ note }: NoteViewProps) {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/notes/edit/${note.slug}`);
  };

  const handleDelete = async () => {
    const res = await fetch(`/notes/delete/${note.id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.push("/notes");
      return;
    }

    console.error("Failed to delete", res.status, res.statusText);
  };

  return (
    <div className="container mx-auto px-10 md:px-20">
      <div className="flex flex-row justify-end p-2">
        <div className="flex flex-row gap-2">
          <Button className="w-[100px]" onClick={handleEdit}>
            Edit
          </Button>
          <Button
            className="w-[100px] bg-red-700 hover:bg-red-800"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </div>
      <h1 className="py-2 text-4xl dark:text-white">{note.title}</h1>
      <hr className="border-b-gray-500 opacity-50" />
      <div className="py-4">
        <MarkdownPreview source={note.content} className="p-10" />
      </div>
    </div>
  );
}
