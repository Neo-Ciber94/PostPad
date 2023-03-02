import { CreateNote, createNoteSchema } from "@/lib/schemas/Note";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";
import Button from "./Button";

interface CreateNoteFormProps {
    onSubmit: (note: CreateNote) => Promise<void>
}

export default function CreateNoteForm({ onSubmit }: CreateNoteFormProps) {
    const { register, formState: { errors }, handleSubmit } = useForm<CreateNote>({
        resolver: zodResolver(createNoteSchema)
    });

    return <form className="flex flex-col w-full lg:px-[20%]" onSubmit={handleSubmit((note) => onSubmit(note))}>
        <div className="mb-2">
            <label className="block mb-2 font-bold dark:text-white">Title</label>
            <input placeholder="Title" className={`leading-tight focus:outline-none focus:shadow-outline shadow 
                appearance-none border rounded py-2 px-3 w-full ${errors.title?.message ? 'border-red-500' : ''}`}
                {...register('title')} />
            <p className="text-red-500 text-xs italic">{errors.title?.message}</p>
        </div>

        <div className="mb-2">
            <label className="block mb-2 font-bold dark:text-white">Content</label>
            <textarea className={`leading-tight focus:outline-none focus:shadow-outline shadow 
                appearance-none border rounded py-2 px-3 w-full ${errors.content?.message ? 'border-red-500' : ''}`}
                rows={8}
                {...register('content')} />
            <p className="text-red-500 text-xs italic">{errors.content?.message}</p>
        </div>

        <div className="mb-2 flex flex-row">
            <Button type="submit">Create</Button>
        </div>
    </form>
}