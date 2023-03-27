"use client";
import PostForm from "@/components/PostForm";
import { CreatePost } from "@/lib/server/schemas/Post";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";
import { throwOnResponseError } from "@/lib/utils/throwOnResponseError";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useMutation } from "react-query";

export default function BaseCreatePostPage() {
  const router = useRouter();
  const mutation = useMutation(
    async (post: CreatePost) => {
      const json = JSON.stringify(post);
      const result = await fetch("/api/posts", {
        body: json,
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      await throwOnResponseError(result);

      // Redirect
      router.push("/posts");
    },
    {
      onError(error) {
        void toast.error(getErrorMessage(error) ?? "Failed to create post");
      },
    }
  );

  return (
    <div className="p-4">
      <PostForm
        onSubmit={(post) => mutation.mutateAsync(post)}
        isSubmitting={mutation.isLoading}
        error={mutation.error}
      />
    </div>
  );
}
