"use client";
import "@uiw/react-markdown-preview/markdown.css";
import { Post } from "@/lib/server/schemas/Post";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { useRouter } from "next/navigation";
import Button from "../../Button";
import { Tag } from "@/lib/server/schemas/Tag";
import Chip from "@/components/Chip";
import { TagIcon } from "@heroicons/react/24/outline";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});

export interface BasePostPageProps {
  post: Post;
}

export default function BasePostPage({ post }: BasePostPageProps) {
  const router = useRouter();

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
    <div className="container mx-auto px-10 md:px-20">
      <div className="flex flex-row justify-end p-2">
        <div className="flex flex-row gap-2">
          <Button variant="primary" onClick={handleEdit}>
            Edit
          </Button>
          <Button variant="error" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>

      <>
        {post.tags && post.tags.length > 0 && (
          <>
            <div className="my-4 flex flex-row items-center gap-1">
              <div className="mb-2 mr-4 flex flex-row items-center gap-1 text-white">
                <TagIcon className="h-7 w-7 " />
                <span className="text-lg">Tags</span>
              </div>
              <ChipList tags={post.tags || []} />
            </div>
            <hr className="mt-4 border-b-gray-500 opacity-20" />
          </>
        )}
      </>

      <h1 className="mt-4 mb-2 py-2 text-4xl text-white">{post.title}</h1>

      <hr className="border-b-gray-500 opacity-20" />
      <div className="py-4">
        {/* <MarkdownPreview source={post.content} className="p-10" /> */}

        <ReactQuill value={post.content} readOnly theme="snow" modules={[]} />
      </div>
    </div>
  );
}

interface ChipListProps {
  tags: Tag[];
}

function ChipList(props: ChipListProps) {
  const { tags } = props;

  return (
    <div className="flex flex-row flex-wrap gap-2">
      {tags.map((tag) => (
        <Chip key={tag.id} value={tag.name} />
      ))}
    </div>
  );
}
