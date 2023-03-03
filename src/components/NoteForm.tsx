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
import LoadingSpinner from "./LoadingSpinner";
import Alert from "./Alert";
import { useRouter } from "next/navigation";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface CreateNoteFormProps {
  onSubmit: (note: CreateNote) => Promise<void>;
  isSubmitting: boolean;
  error?: unknown;
  note?: undefined;
  isEditing?: false;
}

interface UpdateNoteFormProps {
  onSubmit: (note: UpdateNote) => Promise<void>;
  isSubmitting: boolean;
  error?: unknown;
  note: Note;
  isEditing: true;
}

export type NoteFormProps = CreateNoteFormProps | UpdateNoteFormProps;

export default function NoteForm({
  note,
  error,
  onSubmit,
  isSubmitting,
  isEditing,
}: NoteFormProps) {
  const schema = useMemo(
    () => (isEditing === true ? updateNoteSchema : createNoteSchema),
    [isEditing]
  );

  const router = useRouter();

  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: note,
  });

  return (
    <form
      className="flex w-full flex-col lg:px-[10%]"
      onSubmit={handleSubmit(async (note) => {
        await onSubmit(note as any);
        router.refresh();
      })}
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
          className={`focus:shadow-outline w-full appearance-none rounded border
                py-2 px-3 leading-tight shadow focus:outline-none dark:border-stone-900 dark:bg-gray-900 dark:text-white ${
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
              <div>
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

      <>
        {error && (
          <div className="py-2">
            <Alert color="#ff0000">{getErrorMessage(error)}</Alert>
          </div>
        )}
      </>

      <div className="mb-2 flex flex-row gap-2">
        <Button
          type="submit"
          className="flex flex-row items-center gap-2"
          disabled={isSubmitting}
        >
          {isSubmitting && <LoadingSpinner />}
          <span>{isEditing === true ? "Update" : "Create"}</span>
        </Button>
        <Link
          href="/"
          onClick={(e) => {
            if (isSubmitting) {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
        >
          <Button
            type="button"
            className="bg-red-800 hover:bg-red-900"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </Link>
      </div>
    </form>
  );
}

function getErrorMessage(err: any): string {
  if (err == null) {
    throw new Error("no error");
  }

  if (typeof err === "string") {
    return err;
  }

  if (Array.isArray(err)) {
    return getErrorMessage(err[0]);
  }

  if (err.message) {
    return getErrorMessage(err.message);
  }

  if (err.error) {
    return getErrorMessage(err.error);
  }

  if (err.errors) {
    return getErrorMessage(err.errors);
  }

  if (err.messages) {
    return getErrorMessage(err.messages);
  }

  return JSON.stringify(err);
}
