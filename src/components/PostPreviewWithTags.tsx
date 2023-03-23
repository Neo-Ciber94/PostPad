import { Post } from "@/lib/server/schemas/Post";
import { Tag } from "@/lib/server/schemas/Tag";
import { TagIcon } from "@heroicons/react/24/solid";
import dynamic from "next/dynamic";
import Chip from "./Chip";
import { PostPreviewLoading } from "./loading/PostViewSkeleton";

const PostPreview = dynamic(() => import("@/components/PostPreview"), {
  ssr: false,
  loading: () => <PostPreviewLoading />,
});

export interface PostPreviewWithTagsProps {
  post: Post;
}

export default function PostPreviewWithTags({
  post,
}: PostPreviewWithTagsProps) {
  return (
    <>
      <div>
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
      </div>
      <h1 className="mt-4 mb-2 py-2 text-4xl text-white">{post.title}</h1>
      <hr className="mb-4 border-b-gray-500 opacity-20" />
      <PostPreview post={post} />
    </>
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
