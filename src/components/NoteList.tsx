"use client";
import { Note } from "@/lib/schemas/Note";
import {
  DocumentIcon,
  EllipsisVerticalIcon,
  InboxIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Menu, MenuItem } from "./Menu";

export interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  return (
    <>
      {notes.length === 0 && (
        <div className="my-4 flex flex-col items-center justify-center gap-2 p-4 opacity-30">
          <InboxIcon className="h-12 w-12" />
          <span className="text-2xl">No notes were found</span>
        </div>
      )}

      {notes.map((note) => {
        return (
          <div key={note.id}>
            <NoteListItem note={note} />
            <hr className="border-gray-500 opacity-60" />
          </div>
        );
      })}
    </>
  );
}

interface NoteListItemProps {
  note: Note;
}

function NoteListItem({ note }: NoteListItemProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const anchorEl = useRef<HTMLButtonElement | null>(null);

  const handleClose = () => {
    if (open) {
      setOpen(false);
    }
  };

  const handleDelete = async (note: Note) => {
    const res = await fetch(`/api/notes/${note.id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.refresh();
      return;
    }

    console.error("Error deleting", res.status, res.statusText);
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();
    setOpen(true);
  };

  return (
    <>
      <Link href={`/notes/${note.slug}`}>
        <div className="flex cursor-pointer flex-row items-center justify-between p-3 hover:bg-slate-600">
          <div className="flex flex-row items-center gap-2">
            <DocumentIcon
              className="h-8 w-8"
              style={{ color: note.color ?? undefined }}
            />
            <div className="w-[60vw] overflow-hidden text-ellipsis whitespace-nowrap md:w-[40vw]">
              {note.title}
            </div>
          </div>
          <button onClick={handleOpenMenu} ref={anchorEl}>
            <EllipsisVerticalIcon className="h-8 w-8 p-1 text-white hover:rounded-full hover:bg-slate-500" />
          </button>
        </div>
      </Link>

      <Menu open={open} anchor={anchorEl} onClose={handleClose}>
        <MenuItem onClick={() => console.log("Edit")}>Edit</MenuItem>
        <MenuItem onClick={() => console.log("Delete")}>Delete</MenuItem>
      </Menu>
    </>
  );
}
