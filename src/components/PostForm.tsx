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
import { Controller, useController, useForm } from "react-hook-form";
import Button from "./Button";
import LoadingSpinner from "./loading/LoadingSpinner";
import Alert from "./Alert";
import { useRouter } from "next/navigation";
import TagList from "./TagsListInput";
import { TagIcon } from "@heroicons/react/24/outline";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";
import { useMutation, useQueryClient } from "react-query";
import { tagRules } from "@/lib/server/schemas/Tag";
import dynamic from "next/dynamic";
import EditorLoading from "./loading/EditorLoading";
import { useDarkMode } from "@/lib/client/contexts/DarkModeContext";
import { GenerateAIPostButton } from "./GenerateAIPostButton";
import { usePromptDialog } from "@/lib/client/hooks/usePromptDialog";
import { useAbortController } from "@/lib/client/hooks/useAbortController";
import { useStateWithChange } from "@/lib/client/hooks/useStateWithChange";

const PostEditor = dynamic(() => import("./Editor/PostEditor"), {
  ssr: false,
  loading: () => <EditorLoading />,
});

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
  const queryClient = useQueryClient();
  const { isDarkMode } = useDarkMode();
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

  const editorController = useController({
    name: "content",
    defaultValue: "",
    control,
  });

  const abortController = useAbortController({
    onAbort() {
      console.log("[ABORTED]");
    },
  });

  const editorContent = useStateWithChange(
    editorController.field.value || "",
    (content) => {
      editorController.field.onChange(content);
    }
  );

  const [isGenerating, setIsGenerating] = useState(false);
  const promptDialog = usePromptDialog();

  const generatePost = useMutation(async (prompt: string) => {
    console.log({ prompt });
    editorContent.set("");

    if (isGenerating && !abortController.isAborted) {
      abortController.abort();
    }

    setIsGenerating(true);

    try {
      const completionStream = fetchPostCompletionStream(
        prompt,
        abortController.signal
      );

      let generated = "";
      for await (const chunk of completionStream) {
        const nextChunk = generated + chunk;
        generated = nextChunk;
        editorContent.set(generated);
      }
    } finally {
      setIsGenerating(false);
    }
  });

  const handleOpenPromptDialog = () => {
    if (isGenerating) {
      abortController.abort();
      return;
    }

    promptDialog.open({
      title: "Generate AI Post",
      placeholder: "What would you like your post to be about?",
      onConfirm: (prompt) => generatePost.mutate(prompt),
    });
  };

  return (
    <>
      <promptDialog.DialogComponent />

      <form
        className="flex w-full flex-col lg:px-[5%]"
        onSubmit={handleSubmit(async (post) => {
          // SAFETY: This can be either CreatePost or UpdatePost
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await onSubmit(post as any);
          await queryClient.invalidateQueries({
            queryKey: ["posts"],
          });

          router.refresh();
        })}
      >
        <div className="mb-2 flex flex-row justify-end">
          <div className="flex flex-row items-center gap-4">
            <GenerateAIPostButton
              onClick={handleOpenPromptDialog}
              isLoading={generatePost.isLoading}
            />
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
                    maxLength={tagRules.TAG_MAX_NAME_LENGTH}
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
            {...register("title")}
            placeholder="Title"
            className={`focus:shadow-outline w-full appearance-none rounded border border-gray-600
                 py-2 px-3 leading-tight shadow transition-colors duration-500 focus:outline-none ${
                   isDarkMode ? "bg-[#0D1117] text-white" : "bg-white"
                 } ${errors.title?.message ? "border-red-500" : ""}`}
          />
          <p className="text-xs italic text-red-500">{errors.title?.message}</p>
        </div>

        <div className="mb-2">
          <label className="mb-2 block font-bold text-white">Content</label>
          <PostEditor
            value={editorContent.value}
            readOnly={isGenerating}
            onChange={(value) => {
              if (isGenerating) {
                return;
              }

              editorContent.set(value);
            }}
          />
          <p className="text-xs italic text-red-500">
            {errors.content?.message}
          </p>
        </div>

        <>
          {error && (
            <div className="py-4 text-red-500">
              <Alert color="#e00">
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
    </>
  );
}

async function* fetchPostCompletionStream(prompt: string, signal: AbortSignal) {
  const res = await fetch("/api/posts/generate", {
    headers: { "content-type": "application/json" },
    method: "POST",
    body: JSON.stringify({ prompt }),
    signal,
  });

  const stream = res.body?.getReader();
  const decoder = new TextDecoder();

  if (stream == null) {
    throw new Error("response stream is null");
  }

  let done = false;

  while (!done) {
    const { done: doneReading, value: data } = await stream.read();
    done = doneReading;

    const chunk = decoder.decode(data);
    yield chunk;
  }
}
