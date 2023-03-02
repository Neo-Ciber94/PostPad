import Button from '@/components/Button';
import { Note } from '@/lib/schemas/Note';
import { NoteService } from '@/lib/services/note.service';
import { DocumentIcon, InboxIcon } from '@heroicons/react/24/solid'
import Link from 'next/link';

async function getNotes() {
    const noteService = new NoteService();
    const notes = await noteService.getAllNotes();
    return notes;
}

export default async function NoteListPage() {
    const notes = await getNotes();

    return <div className="dark:text-white p-2">
        <div className="flex flex-row p-2 px-10">
            <Link href="/notes/new" className="w-full">
                <Button className="w-full">New Note</Button>
            </Link>
        </div>
        {notes.length === 0 && <div className="flex flex-col gap-2 justify-center items-center p-4 my-4 opacity-30">
            <InboxIcon className="h-12 w-12" />
            <span className="text-2xl">No notes were found</span>
        </div>}

        {notes.map(note => {
            return <div key={note.id}>
                <NoteListItem note={note} />
                <hr className='border-gray-500 opacity-60' />
            </div>
        })}
    </div>
}

interface NoteListItemProps {
    note: Note
}

function NoteListItem({ note }: NoteListItemProps) {
    return <div className='flex flex-row gap-4 p-3 items-center hover:bg-slate-600 cursor-pointer'>
        <DocumentIcon className='h-8 w-8' style={{ color: note.color }} />
        <div>{note.title}</div>
    </div>
}