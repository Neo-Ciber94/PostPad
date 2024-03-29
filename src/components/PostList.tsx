"use client";
import { Post } from "@/lib/server/schemas/Post";
import { Tag } from "@/lib/server/schemas/Tag";
import { throwOnResponseError } from "@/lib/utils/throwOnResponseError";
import { EllipsisVerticalIcon, InboxIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import Chip, { ChipProps } from "./Chip";
import LoadingSpinner from "./loading/LoadingSpinner";
import Menu from "./Menu";
import TimeAgo from "./TimeAgo";
import { MdEdit, MdDelete } from "react-icons/md";
import { toast } from "react-hot-toast";
import { Relative } from "./Relative";

export interface PostListProps {
  posts: Post[];
}

export default function PostList({ posts }: PostListProps) {
  const queryClient = useQueryClient();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDeletePost = async (post: Post) => {
    void toast.success(`Post was deleted`);
    void queryClient.invalidateQueries(["posts"]);
  };

  return (
    <>
      {posts.length === 0 && (
        <div className="my-4 flex flex-col items-center justify-center gap-2 p-4 opacity-30">
          <InboxIcon className="h-12 w-12" />
          <span className="text-2xl">No posts were found</span>
        </div>
      )}

      {
        <>
          {posts.map((post, idx) => {
            return (
              <PostListItem
                post={post}
                key={post.id}
                index={idx}
                onDelete={() => handleDeletePost(post)}
              />
            );
          })}

          <div className="h-8"></div>
        </>
      }
    </>
  );
}

interface PostListItemProps {
  post: Post;
  index: number;
  onDelete: () => void;
}

function PostListItem({ index, post, onDelete }: PostListItemProps) {
  const router = useRouter();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
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

    await throwOnResponseError(res);
    await queryClient.invalidateQueries({ queryKey: ["posts"] });
    router.refresh();
    onDelete();
  });

  const handleClose = () => {
    setOpen(false);
    setAnchor(null);
  };

  const handleOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setOpen(true);
    setAnchor(e.target as HTMLElement);
  };

  const d = index % 10;
  const animation =
    d % 2 === 0
      ? `animate-post-item-left-${d * 100}`
      : `animate-post-item-right-${d * 100}`;

  return (
    <>
      <Link href={`/posts/${post.slug}`}>
        <div
          className={`my-3 rounded-xl bg-base-600 px-6 py-4 opacity-0 shadow-md 
          shadow-black/50 ring-2 ring-base-300/40 transition hover:bg-base-700 ${animation}
          duration-300 ${deletePost.isLoading ? "animate-pulse" : ""}`}
        >
          <div className="flex flex-row items-center justify-between">
            <div className="flex w-full flex-col overflow-hidden">
              <TimeAgo date={new Date(post.updatedAt ?? post.createdAt)} />

              <div className="flex max-w-full flex-row items-center gap-4">
                {deletePost.isLoading && (
                  <LoadingSpinner size={20} color="rgba(255, 255, 255, 0.2)" />
                )}
                <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                  {post.title}
                </span>
              </div>
              {post.tags && (
                <div className="mt-2">
                  <PostChipList tags={post.tags} />
                </div>
              )}
            </div>

            <button onClick={handleOpen}>
              <EllipsisVerticalIcon className="h-8 w-8 p-1 text-white hover:rounded-full hover:bg-base-400/30" />
            </button>
          </div>
        </div>
      </Link>

      <Relative
        anchor={anchor}
        visible={open}
        className="z-50"
        offsetY={32}
        offsetX={16}
      >
        <MenuItems
          open={open}
          post={post}
          onOpen={handleOpen}
          onClose={handleClose}
          onDelete={() => deletePost.mutate()}
        />
      </Relative>
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

interface PostListButtonMenuProps {
  post: Post;
  open: boolean;
  onDelete: () => void;
  onOpen: (event: React.MouseEvent) => void;
  onClose: () => void;
}

function MenuItems({
  open,
  onOpen,
  onClose,
  post,
  onDelete,
}: PostListButtonMenuProps) {
  const router = useRouter();

  return (
    <Menu onClose={onClose} onClick={onOpen} open={open}>
      <Menu.List className="z-50 min-w-[150px] rounded-md bg-white p-1 shadow-lg">
        <Menu.Item
          className="flex cursor-pointer flex-row items-center gap-2 px-4 py-2 text-black hover:rounded-lg hover:bg-base-100"
          onClick={() => router.push(`/posts/edit/${post.slug}`)}
        >
          <MdEdit size={28} className="text-base-400" />
          Edit
        </Menu.Item>
        <Menu.Item
          className="flex cursor-pointer flex-row items-center gap-2 px-4 py-2 text-black hover:rounded-lg hover:bg-base-100"
          onClick={onDelete}
        >
          <MdDelete size={28} className="text-base-400" />
          Delete
        </Menu.Item>
      </Menu.List>
    </Menu>
  );
}
