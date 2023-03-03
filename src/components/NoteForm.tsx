import {
  CreateNote,
  createNoteSchema,
  Note,
  UpdateNote,
  updateNoteSchema,
} from "@/lib/schemas/Note";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import Button from "./Button";
import ColorPicker from "./ColorPicker";

interface CreateNoteFormProps {
  onSubmit: (note: CreateNote) => Promise<void>;
  note?: undefined;
  isEditing?: false;
}

interface UpdateNoteFormProps {
  onSubmit: (note: UpdateNote) => Promise<void>;
  note: Note;
  isEditing: true;
}

export type NoteFormProps = CreateNoteFormProps | UpdateNoteFormProps;

export default function NoteForm({ note, onSubmit, isEditing }: NoteFormProps) {
  const schema = useMemo(
    () => (isEditing === true ? updateNoteSchema : createNoteSchema),
    [isEditing]
  );

  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<CreateNote>({
    resolver: zodResolver(schema),
    defaultValues: note,
  });

  return (
    <form
      className="flex w-full flex-col lg:px-[20%]"
      onSubmit={handleSubmit((note) => onSubmit(note as any))}
    >
      <div className="mb-2 flex flex-row justify-end">
        <Controller
          control={control}
          name="color"
          render={({ field }) => {
            return (
              <ColorPicker
                color={field.value}
                onChange={(color) => {
                  field.onChange(color);
                  console.log({ color });
                }}
              />
            );
          }}
        />
      </div>

      <div className="mb-2">
        <label className="mb-2 block font-bold dark:text-white">Title</label>
        <input
          placeholder="Title"
          className={`focus:shadow-outline w-full appearance-none rounded 
                border py-2 px-3 leading-tight shadow focus:outline-none ${
                  errors.title?.message ? "border-red-500" : ""
                }`}
          {...register("title")}
        />
        <p className="text-xs italic text-red-500">{errors.title?.message}</p>
      </div>

      <div className="mb-2">
        <label className="mb-2 block font-bold dark:text-white">Content</label>
        <textarea
          className={`focus:shadow-outline w-full appearance-none rounded 
                border py-2 px-3 leading-tight shadow focus:outline-none ${
                  errors.content?.message ? "border-red-500" : ""
                }`}
          rows={8}
          {...register("content")}
        />
        <p className="text-xs italic text-red-500">{errors.content?.message}</p>
      </div>

      <div className="mb-2 flex flex-row gap-2">
        <Button type="submit">
          <span>{isEditing === true ? "Update" : "Create"}</span>
        </Button>
        <Link href="/">
          <Button type="button" className="bg-red-800 hover:bg-red-900">
            Cancel
          </Button>
        </Link>
      </div>
    </form>
  );
}
