"use client";
import PostForm from "@/components/PostForm";
import { PostWithUser, UpdatePost } from "@/lib/server/schemas/Post";
import { deferredPromise } from "@/lib/utils/promises/deferred";
import { throwOnResponseError } from "@/lib/utils/throwOnResponseError";
import { toast } from "react-hot-toast";
import { useMutation } from "react-query";

interface BaseEditPostPage {
  post: PostWithUser;
}

export default function BaseEditPostPage({ post }: BaseEditPostPage) {
  const mutation = useMutation(async (post: UpdatePost) => {
    const [deferred, promise] = deferredPromise<void>();

    void toast.promise(
      promise,
      {
        loading: "Saving...",
        success: "Post was updated",
        error: "Failed to update post",
      },
      {}
    );

    try {
      const json = JSON.stringify(post);
      const result = await fetch("/api/posts", {
        body: json,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      await throwOnResponseError(result);
      deferred.resolve();
    } catch (err) {
      deferred.reject(err);
      throw err;
    }
  });

  return (
    <div className="p-4">
      <PostForm
        onSubmit={(post) => mutation.mutateAsync(post)}
        cancelButtonText="Back"
        isSubmitting={mutation.isLoading}
        error={mutation.error}
        post={post}
        isEditing
      />
    </div>
  );
}
