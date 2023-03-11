"use client";
import { Post } from "@/lib/server/schemas/Post";
import { Tag } from "@/lib/server/schemas/Tag";
import { EllipsisVerticalIcon, InboxIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import Chip, { ChipProps } from "./Chip";
import { Menu, MenuItem } from "./Menu";
import TimeAgo from "./TimeAgo";

export interface PostListProps {
  posts: Post[];
}

export default function PostList({ posts }: PostListProps) {
  return (
    <>
      {posts.length === 0 && (
        <div className="my-4 flex flex-col items-center justify-center gap-2 p-4 opacity-30">
          <InboxIcon className="h-12 w-12" />
          <span className="text-2xl">No posts were found</span>
        </div>
      )}

      {posts.map((post) => {
        return <PostListItem post={post} key={post.id} />;
      })}
    </>
  );
}

interface PostListItemProps {
  post: Post;
}

function PostListItem({ post }: PostListItemProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const anchorEl = useRef<HTMLButtonElement | null>(null);
  const queryClient = useQueryClient();
  const deletePost = useMutation(async () => {
    handleClose();

    // TODO: Add a custom dialog instead
    const canDelete = confirm("Delete this post?");
    if (canDelete != true) {
      return;
    }

    const res = await fetch(`/api/posts/${post.id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      await queryClient.invalidateQueries({
        queryKey: ["posts"],
        exact: false,
      });
      router.refresh();
      return;
    }
  });

  const handleClose = () => {
    if (open) {
      setOpen(false);
    }
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();
    setOpen(true);
  };

  return (
    <>
      <Link href={`/posts/${post.slug}`}>
        <div
          className="my-3 rounded-xl bg-base-600 px-6 py-4 
      shadow-md shadow-black/50 ring-2 ring-base-300/40 transition duration-300
      hover:bg-base-700"
        >
          <div className="flex flex-row items-center justify-between">
            <div className="flex w-full flex-col overflow-hidden">
              <TimeAgo date={new Date(post.updatedAt ?? post.createdAt)} />

              <div className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                {post.title}
              </div>

              {post.tags && (
                <div className="mt-2">
                  <PostChipList tags={post.tags} />
                </div>
              )}
            </div>

            <button onClick={handleOpenMenu} ref={anchorEl}>
              <EllipsisVerticalIcon className="h-8 w-8 p-1 text-white hover:rounded-full hover:bg-base-400/30" />
            </button>
          </div>
        </div>
      </Link>

      <Menu open={open} anchor={anchorEl} onClose={handleClose}>
        <MenuItem onClick={() => router.push(`/posts/edit/${post.slug}`)}>
          Edit
        </MenuItem>
        <MenuItem onClick={() => deletePost.mutate()}>Delete</MenuItem>
      </Menu>
    </>
  );
}

interface PostChipListProps {
  tags: Tag[];
}

function PostChipList(props: PostChipListProps) {
  const MAX_CHIPS = 8;
  let { tags } = props;
  const hasOverflow = tags.length > MAX_CHIPS;
  tags = tags.slice(0, MAX_CHIPS);

  return (
    <div className="flex flex-row flex-wrap gap-1">
      {tags.map((tag) => (
        <PostChip key={tag.id} value={tag.name} />
      ))}

      {hasOverflow && <PostChip value="..." className="px-5" />}
    </div>
  );
}

const PostChip: React.FC<ChipProps> = (props) => {
  return <Chip {...props} className="bg-black text-[#f8f8f2]" />;
};
