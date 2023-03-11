"use client";
import PostForm from "@/components/PostForm";
import { Post, UpdatePost } from "@/lib/server/schemas/Post";
import { throwOnResponseError } from "@/lib/utils/throwOnResponseError";
import { useRouter } from "next/navigation";
import { useMutation } from "react-query";

interface BaseEditPostPage {
  post: Post;
}

export default function BaseEditPostPage({ post }: BaseEditPostPage) {
  const router = useRouter();
  const mutation = useMutation(async (post: UpdatePost) => {
    const json = JSON.stringify(post);
    const result = await fetch("/api/posts", {
      body: json,
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    });
    
    await throwOnResponseError(result);

    // Redirect
    router.push("/posts");
  });

  return (
    <div className="p-4">
      <PostForm
        onSubmit={(post) => mutation.mutateAsync(post)}
        isSubmitting={mutation.isLoading}
        error={mutation.error}
        post={post}
        isEditing
      />
    </div>
  );
}
