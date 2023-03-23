"use client";
import "react-quill/dist/quill.bubble.css";
import { Post } from "@/lib/server/schemas/Post";
import { useRouter } from "next/navigation";
import Button from "../../Button";
import React, { useState } from "react";
import SharePostButton from "@/components/SharePostButton";
import SharePostDialog from "@/components/SharePostDialog";
import PostPreviewWithTags from "@/components/PostPreviewWithTags";

export interface BasePostPageProps {
  post: Post;
}

export default function BasePostPage({ post }: BasePostPageProps) {
  const router = useRouter();
  const [shareOpen, setShareOpen] = useState(false);

  const handleEdit = () => {
    router.push(`/posts/edit/${post.slug}`);
  };

  const handleDelete = async () => {
    const res = await fetch(`/posts/${post.id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.push("/posts");
      return;
    }

    console.error("Failed to delete", res.status, res.statusText);
  };

  return (
    <div className="mx-auto mt-4 px-4 md:px-20">
      <div className="flex flex-row justify-between p-2">
        <SharePostButton onClick={() => setShareOpen(true)} />

        <div className="flex flex-row gap-2">
          <Button variant="primary" onClick={handleEdit}>
            Edit
          </Button>
          <Button variant="error" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>

      <PostPreviewWithTags post={post} />

      {shareOpen && (
        <SharePostDialog onClose={() => setShareOpen(false)} post={post} />
      )}
    </div>
  );
}
