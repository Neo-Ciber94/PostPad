"use client";
import { useOuterClick } from "@/hooks/useOuterClick";
import { Note } from "@/lib/schemas/Note";
import {
  DocumentIcon,
  EllipsisVerticalIcon,
  InboxIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { forwardRef, useState } from "react";

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
  const [open, setOpen] = useState(false);
  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();

    if (!open) {
      setOpen(true);
    }
  };

  const menuRef = useOuterClick<HTMLDivElement>({
    onClickOutside() {
      if (!open) {
        console.log("click");
        setOpen(true);
      }
    },
  });

  return (
    <Link href={`/notes/${note.slug}`}>
      <div className="flex cursor-pointer flex-row items-center justify-between p-3 hover:bg-slate-600">
        <div className="flex flex-row items-center gap-2">
          <DocumentIcon className="h-8 w-8" style={{ color: note.color }} />
          <div>{note.title}</div>
        </div>

        <div className="relative">
          <button onClick={handleOpenMenu}>
            <EllipsisVerticalIcon className="h-8 w-8 p-1 text-white hover:rounded-full hover:bg-slate-500" />
          </button>
          {open && <Menu note={note} ref={menuRef} />}
        </div>
      </div>
    </Link>
  );
}

interface MenuProps {
  note: Note;
}

const Menu = forwardRef<HTMLDivElement, MenuProps>(function Menu(
  { note },
  ref
) {
  const router = useRouter();

  return (
    <div
      className="absolute top-5 left-[-60px] z-40 w-[100px] bg-white py-1 shadow-sm"
      ref={ref}
    >
      <ul>
        <li className="px-2 py-1 hover:bg-slate-300">
          <button
            className="text-black"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              router.push(`/notes/edit/${note.slug}`);
            }}
          >
            Edit
          </button>
        </li>
      </ul>
    </div>
  );
});
