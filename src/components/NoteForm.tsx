import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import {
  CreateNote,
  createNoteSchema,
  Note,
  UpdateNote,
  updateNoteSchema,
} from "@/lib/schemas/Note";
import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import Button from "./Button";
import ColorPicker from "./ColorPicker";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

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
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: note,
  });

  if (errors) {
    console.error(errors);
  }

  return (
    <form
      className="flex w-full flex-col lg:px-[10%]"
      onSubmit={handleSubmit((note) => onSubmit(note as any))}
    >
      <div className="mb-2 flex flex-row justify-end">
        <Controller
          control={control}
          name="color"
          render={({ field }) => {
            return (
              <ColorPicker
                color={field.value ?? undefined}
                onChange={(color) => {
                  field.onChange(color);
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
        <Controller
          control={control}
          name="content"
          render={({ field }) => {
            return (
              <div data-color-mode="light">
                <MDEditor
                  value={field.value}
                  onChange={field.onChange}
                  height={400}
                />
              </div>
            );
          }}
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
