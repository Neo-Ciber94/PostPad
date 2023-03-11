"use client";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import {
  CreatePost,
  createPostSchema,
  Post,
  UpdatePost,
  updatePostSchema,
} from "@/lib/server/schemas/Post";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Button from "./Button";
import LoadingSpinner from "./LoadingSpinner";
import Alert from "./Alert";
import { useRouter } from "next/navigation";
import MarkdownEditor from "@uiw/react-md-editor";
import TagList from "./TagsListInput";
import { CONSTANTS } from "@/lib/shared/constants";
import { TagIcon } from "@heroicons/react/24/outline";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";

interface CreatePostFormProps {
  onSubmit: (post: CreatePost) => Promise<void>;
  isSubmitting: boolean;
  error?: unknown;
  post?: undefined;
  isEditing?: false;
}

interface UpdatePostFormProps {
  onSubmit: (post: UpdatePost) => Promise<void>;
  isSubmitting: boolean;
  error?: unknown;
  post: Post;
  isEditing: true;
}

export type PostFormProps = CreatePostFormProps | UpdatePostFormProps;

export default function PostForm({
  post,
  error,
  onSubmit,
  isSubmitting,
  isEditing,
}: PostFormProps) {
  const router = useRouter();
  const [showTags, setShowTags] = useState(
    () => post && post.tags && post.tags.length > 0
  );
  const schema = useMemo(
    () => (isEditing === true ? updatePostSchema : createPostSchema),
    [isEditing]
  );

  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: post,
  });

  return (
    <form
      className="flex w-full flex-col lg:px-[5%]"
      onSubmit={handleSubmit(async (post) => {
        await onSubmit(post as any);
        router.refresh();
      })}
    >
      <div className="mb-2 flex flex-row justify-end">
        <div className="flex flex-row gap-2">
          <button
            type="button"
            className="rounded-full bg-slate-600 p-3 shadow-lg 
        transition-colors duration-200 hover:bg-slate-900"
            onClick={(e) => {
              e.stopPropagation();
              setShowTags((show) => !show);
            }}
          >
            <TagIcon className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>

      {showTags && (
        <div className="mb-2">
          <label className="mb-2 block font-bold text-white">Tags</label>
          <Controller
            control={control}
            name="tags"
            render={({ field }) => {
              const currentTags = (field.value || []).map((x) => ({
                id: x.id,
                key: x.id,
                name: x.name,
              }));

              return (
                <TagList
                  maxLength={CONSTANTS.MAX_TAG_LENGTH}
                  chipColor="#0D1117"
                  tags={currentTags}
                  onChange={field.onChange}
                />
              );
            }}
          />
        </div>
      )}

      <div className="mb-2">
        <label className="mb-2 block font-bold text-white">Title</label>
        <input
          placeholder="Title"
          className={`focus:shadow-outline w-full appearance-none rounded border
                border-gray-600 py-2 px-3 leading-tight text-white shadow focus:outline-none ${
                  errors.title?.message ? "border-red-500" : ""
                }`}
          style={{
            backgroundColor: "#0D1117",
          }}
          {...register("title")}
        />
        <p className="text-xs italic text-red-500">{errors.title?.message}</p>
      </div>

      <div className="mb-2">
        <label className="mb-2 block font-bold text-white">Content</label>
        <Controller
          control={control}
          name="content"
          render={({ field }) => {
            return (
              <MarkdownEditor
                value={field.value}
                onChange={field.onChange}
                height={400}
              />
            );
          }}
        />
        <p className="text-xs italic text-red-500">{errors.content?.message}</p>
      </div>

      <>
        {error && (
          <div className="py-2">
            <Alert color="#ff0000">
              {getErrorMessage(error) || "Something went wrong"}
            </Alert>
          </div>
        )}
      </>

      <div className="mb-2 flex flex-row gap-2">
        <Button
          type="submit"
          variant="primary"
          className="flex flex-row gap-3"
          disabled={isSubmitting}
        >
          {isSubmitting && <LoadingSpinner size={20} />}
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
          <Button type="button" variant="error" disabled={isSubmitting}>
            Cancel
          </Button>
        </Link>
      </div>
    </form>
  );
}
