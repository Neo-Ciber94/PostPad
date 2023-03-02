'use client';
import CreateNoteForm from "@/components/CreateNoteForm";

export default function NewNotePage() {
    return <div className="p-4">
        <CreateNoteForm onSubmit={async (note) => console.log(note)} />
    </div>
}