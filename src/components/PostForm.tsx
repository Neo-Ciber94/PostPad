"use client";
import {
  CreatePost,
  createPostSchema,
  PostWithUser,
  UpdatePost,
  updatePostSchema,
} from "@/lib/server/schemas/Post";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
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
import { throwOnResponseError } from "@/lib/utils/throwOnResponseError";
import { chatCompletionPromptSchema } from "@/lib/server/schemas/Prompt";
import SharePostButton from "./SharePostButton";
import SharePostDialog from "./SharePostDialog";
import { toast } from "react-hot-toast";
import { getPostDate } from "@/lib/utils/getPostDate";

const PostEditor = dynamic(() => import("./editor/PostEditor"), {
  ssr: false,
  loading: () => <EditorLoading />,
});

type BaseProps = {
  isSubmitting: boolean;
  error?: unknown;
  submitButtonText?: string;
  cancelButtonText?: string;
};

interface CreatePostFormProps extends BaseProps {
  onSubmit: (post: CreatePost) => Promise<void>;
  post?: undefined;
  isEditing?: false;
}

interface UpdatePostFormProps extends BaseProps {
  onSubmit: (post: UpdatePost) => Promise<void>;
  post: PostWithUser;
  isEditing: true;
}

export type PostFormProps = CreatePostFormProps | UpdatePostFormProps;

export default function PostForm({
  post,
  error,
  onSubmit,
  isSubmitting,
  isEditing,
  submitButtonText,
  cancelButtonText,
}: PostFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [shareOpen, setShareOpen] = useState(false);
  const { isDarkMode } = useDarkMode();
  const [showTags, setShowTags] = useState(() => post && post.tags && post.tags.length > 0);

  const schema = useMemo(
    () => (isEditing === true ? updatePostSchema : createPostSchema),
    [isEditing]
  );

  const {
    control,
    register,
    getValues,
    setValue,
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

  const editorContent = useStateWithChange(editorController.field.value || "", (content) => {
    editorController.field.onChange(content);
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const promptDialog = usePromptDialog();

  const generatePost = useCallback(
    async (prompt: string) => {
      console.log({ prompt });
      editorContent.set("");

      if (isGenerating && !abortController.isAborted) {
        abortController.abort();
      }

      setIsGenerating(true);

      try {
        const completionStream = fetchPostCompletionStream(prompt, abortController.signal);

        let generated = "";

        for await (const chunk of completionStream) {
          const nextChunk = generated + chunk;
          generated = nextChunk;
          editorContent.set(generated);
        }

        // Update the is AI generated flag
        setValue("isAIGenerated", true);

        // If had a title, continue, otherwise set the generated title
        const currentTitle = getValues("title");
        if (currentTitle != null && currentTitle.trim().length > 0) {
          return;
        }

        // The generated title will be within a <h1> tag
        const titleMatches = /^<h1>(.+)<\/h1>/g.exec(generated);

        if (titleMatches) {
          const generatedTitle = titleMatches[1];
          if (generatedTitle) {
            setValue("title", generatedTitle);
          }
        }
      } finally {
        setIsGenerating(false);
      }
    },
    [abortController, editorContent, getValues, isGenerating, setValue]
  );

  const generatePostMutation = useMutation(generatePost, {
    onError(error) {
      void toast.error(getErrorMessage(error) ?? "Something went wrong");
    },
  });

  const handleOpenPromptDialog = () => {
    if (isGenerating) {
      abortController.abort();
      return;
    }

    promptDialog.open({
      title: "Generate AI Post",
      placeholder: "What would you like your post to be about?",
      onConfirm: (prompt) => generatePostMutation.mutate(prompt),
      schema: chatCompletionPromptSchema,
    });
  };

  return (
    <>
      {/* Only when creating we can generate using AI  */}
      <promptDialog.DialogComponent />

      {shareOpen && post != null && (
        <SharePostDialog onClose={() => setShareOpen(false)} post={post} />
      )}

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
          <div className={`flex w-full flex-row ${post ? "justify-between" : "justify-end"}`}>
            {post != null && <SharePostButton onClick={() => setShareOpen(true)} />}

            <div className="flex flex-row items-center gap-4">
              {post == null && (
                <GenerateAIPostButton
                  onClick={handleOpenPromptDialog}
                  isLoading={generatePostMutation.isLoading}
                />
              )}

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
            disabled={isGenerating}
            placeholder="Title"
            className={`focus:shadow-outline w-full appearance-none rounded border border-gray-600
                 px-3 py-2 leading-tight shadow transition-colors duration-500 focus:outline-none ${
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
          <p className="text-xs italic text-red-500">{errors.content?.message}</p>
        </div>

        <Controller
          control={control}
          defaultValue={false}
          name="isAIGenerated"
          render={({ field }) => (
            <input
              type="hidden"
              value={String(field.value)}
              onChange={(e) => {
                const value: boolean = e.target.value === "true";
                field.onChange(value);
              }}
            />
          )}
        />

        <>
          {error && (
            <div className="py-4 text-red-500">
              <Alert color="#e00">{getErrorMessage(error) || "Something went wrong"}</Alert>
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
            <span>
              {submitButtonText ? submitButtonText : isEditing === true ? "Update" : "Create"}
            </span>
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
              {cancelButtonText ?? "Cancel"}
            </Button>
          </Link>
        </div>

        {post != null && (
          <div className="flex w-full flex-row justify-end px-4">
            <span className="text-xs italic text-slate-300 opacity-70">{`Last update: ${getPostDate(
              post
            )}`}</span>
          </div>
        )}
      </form>
    </>
  );
}

async function* fetchPostCompletionStream(prompt: string, signal: AbortSignal) {
  const res = await fetch("/api/generate/post", {
    headers: { "content-type": "application/json" },
    method: "POST",
    body: JSON.stringify({ prompt }),
    signal,
  });

  if (!res.ok) {
    await throwOnResponseError(res);
  }

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
