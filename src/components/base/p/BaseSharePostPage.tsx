"use client";
import "react-quill/dist/quill.bubble.css";
import PostPreviewWithTags from "@/components/PostPreviewWithTags";
import { PostWithUser } from "@/lib/server/schemas/Post";

interface BaseSharedPostPageProps {
  post: PostWithUser;
}

export default function BaseSharedPostPage({ post }: BaseSharedPostPageProps) {
  return (
    <div className="mx-auto mt-4 px-4 md:px-20">
      <PostPreviewWithTags post={post} />
    </div>
  );
}
