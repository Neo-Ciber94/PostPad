"use client";
import { Note, noteSchema } from "@/lib/schemas/Note";
import { Tag } from "@/lib/schemas/Tag";
import {
  EllipsisVerticalIcon,
  InboxIcon,
  CalendarIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useMutation } from "react-query";
import Chip from "./Chip";
import { Menu, MenuItem } from "./Menu";
import TimeAgo from "./TimeAgo";

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
        return <NoteListItem note={note} key={note.id} />;
      })}
    </>
  );
}

interface NoteListItemProps {
  note: Note;
}

function NoteListItem({ note }: NoteListItemProps) {
  // We should parse the note to ensure the date value is correct,
  // we could use superjson also
  note = noteSchema.parse(note);

  const router = useRouter();
  const [open, setOpen] = useState(false);
  const anchorEl = useRef<HTMLButtonElement | null>(null);
  const mutation = useMutation(async () => {
    const res = await fetch(`/api/notes/${note.id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.refresh();
      return;
    }
  });

  const handleClose = () => {
    if (open) {
      setOpen(false);
    }
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();
    setOpen(true);
  };

  return (
    <>
      <Link href={`/notes/${note.slug}`}>
        <div
          className="my-3 rounded-xl bg-slate-600 px-6 py-4 
      shadow-sm shadow-[rgba(0,0,0,0.6)] transition duration-300
      hover:bg-gray-800"
        >
          <div className="flex flex-row items-center justify-between">
            <div className="flex w-full flex-col overflow-hidden">
              <TimeAgo date={note.createdAt} />

              <div className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                {note.title}
              </div>

              {note.tags && (
                <div className="mt-2">
                  <NoteChipList tags={note.tags} />
                </div>
              )}
            </div>

            <button onClick={handleOpenMenu} ref={anchorEl}>
              <EllipsisVerticalIcon className="h-8 w-8 p-1 text-white hover:rounded-full hover:bg-slate-500" />
            </button>
          </div>
        </div>
      </Link>

      <Menu open={open} anchor={anchorEl} onClose={handleClose}>
        <MenuItem onClick={() => router.push(`/notes/edit/${note.slug}`)}>
          Edit
        </MenuItem>
        <MenuItem onClick={() => mutation.mutate()}>Delete</MenuItem>
      </Menu>
    </>
  );
}

interface NoteChipListProps {
  tags: Tag[];
}

function NoteChipList(props: NoteChipListProps) {
  const MAX_CHIPS = 8;
  let { tags } = props;
  const hasOverflow = tags.length > MAX_CHIPS;
  tags = tags.slice(0, MAX_CHIPS);

  return (
    <div className="flex flex-row flex-wrap gap-1">
      {tags.map((tag) => (
        <Chip key={tag.id} value={tag.name} />
      ))}

      {hasOverflow && <Chip value="..." className="px-5" />}
    </div>
  );
}
