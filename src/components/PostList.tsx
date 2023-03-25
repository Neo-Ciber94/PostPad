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
          {posts.map((post) => {
            return (
              <PostListItem
                post={post}
                key={post.id}
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
  onDelete: () => void;
}

function PostListItem({ post, onDelete }: PostListItemProps) {
  const router = useRouter();
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
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <>
      <Link href={`/posts/${post.slug}`}>
        <div
          className={`bg-base-600 ring-base-300/40 hover:bg-base-700 my-3 rounded-xl 
          px-6 py-4 shadow-md shadow-black/50 ring-2 transition
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

            <PostListButtonMenu
              open={open}
              post={post}
              onOpen={handleOpen}
              onClose={handleClose}
              onDelete={() => deletePost.mutate()}
            />
          </div>
        </div>
      </Link>
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
  onOpen: () => void;
  onClose: () => void;
}

function PostListButtonMenu({
  open,
  onOpen,
  onClose,
  post,
  onDelete,
}: PostListButtonMenuProps) {
  const router = useRouter();

  return (
    <Menu onClose={onClose} onClick={onOpen} open={open}>
      <EllipsisVerticalIcon className="hover:bg-base-400/30 h-8 w-8 p-1 text-white hover:rounded-full" />

      <Menu.List className="absolute z-40 min-w-[150px] rounded-md bg-white p-1 shadow-lg">
        <Menu.Item
          className="hover:bg-base-100 flex cursor-pointer flex-row items-center gap-2 px-4 py-2 text-black hover:rounded-lg"
          onClick={() => router.push(`/posts/edit/${post.slug}`)}
        >
          <MdEdit size={28} className="text-base-400" />
          Edit
        </Menu.Item>
        <Menu.Item
          className="hover:bg-base-100 flex cursor-pointer flex-row items-center gap-2 px-4 py-2 text-black hover:rounded-lg"
          onClick={onDelete}
        >
          <MdDelete size={28} className="text-base-400" />
          Delete
        </Menu.Item>
      </Menu.List>
    </Menu>
  );
}
