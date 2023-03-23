import { Post } from "@/lib/server/schemas/Post";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";
import { throwOnResponseError } from "@/lib/utils/throwOnResponseError";
import { ClipboardIcon, LinkIcon } from "@heroicons/react/24/solid";
import { PropsWithChildren, useState } from "react";
import { useMutation } from "react-query";
import { twMerge } from "tailwind-merge";
import Button from "./Button";
import Dialog from "./Dialog";
import LoadingSpinner from "./loading/LoadingSpinner";

interface SharePostDialogProps {
  post: Post;
  onClose: () => void;
}

export default function SharePostDialog(props: SharePostDialogProps) {
  const { onClose, post } = props;
  const [shareUrl, setShareUrl] = useState<string | null>(() => {
    if (post.sharedPost == null || post.sharedPost.length === 0) {
      return null;
    }

    const origin = window.location.origin;
    return `${origin}/api/shared/${post.sharedPost[0].id}`;
  });

  const deleteShareUrl = useMutation(async () => {
    const res = await fetch("/api/posts/shared", {
      method: "DELETE",
      body: JSON.stringify({ sharedPostId: post.id }),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      await throwOnResponseError(res);
    }

    setShareUrl(null);
  });

  const handleGenerateLink = (url: string) => {
    setShareUrl(url);
  };

  return (
    <Dialog className="top-[20vw] w-[90vw] bg-base-500 md:w-2/3">
      <div className="flex flex-1 flex-col">
        <header className="overflow-hidden rounded-t-lg">
          <nav
            className="flex cursor-pointer flex-row items-center justify-between 
       bg-alt-500 px-4 py-3 text-white shadow-md"
          >
            <div className="flex flex-row items-center">Share Post</div>

            <button className="text-2xl hover:opacity-40" onClick={onClose}>
              &times;
            </button>
          </nav>
        </header>

        {shareUrl == null && (
          <PostShareLinkGenerator post={post} onGenerate={handleGenerateLink} />
        )}
        {shareUrl && <PostShareLink shareUrl={shareUrl} />}

        {deleteShareUrl.isError && (
          <span className="my-1 px-2 text-xs italic text-red-600">
            {getErrorMessage(deleteShareUrl.error)}
          </span>
        )}

        <hr className="mx-2 mb-2 border-base-400" />

        <div className="mb-2 mt-auto flex flex-row justify-end gap-2 px-2">
          {shareUrl != null && (
            <Button
              type="button"
              variant="error"
              className="flex flex-row gap-4 px-4"
              onClick={() => deleteShareUrl.mutate()}
            >
              {deleteShareUrl.isLoading && <LoadingSpinner size={24} />}
              <span>Delete Link</span>
            </Button>
          )}

          <TextButton
            type="button"
            className="min-w-[120px] font-semibold text-error-500 hover:text-error-600"
            onClick={onClose}
          >
            Cancel
          </TextButton>
        </div>
      </div>
    </Dialog>
  );
}

interface PostShareLinkProps {
  shareUrl: string;
}

function PostShareLink({ shareUrl }: PostShareLinkProps) {
  const [isCopied, setIsCopied] = useState(false);
  const handleCopyToClipboard = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 700);
  };

  return (
    <div className="mb-2 mt-4 py-2 px-2">
      <SharePostContent>
        <div
          className={`group flex cursor-pointer flex-row gap-3  transition-colors duration-200  ${
            isCopied ? "text-blue-200" : "text-blue-200 hover:text-blue-500"
          }`}
          onClick={handleCopyToClipboard}
        >
          <ClipboardIcon className="h-6 w-6" />
          <span className="break-all">{shareUrl}</span>
        </div>
      </SharePostContent>

      <div className={`flex h-4 flex-row justify-end`}>
        <span
          className={`mt-2 cursor-pointer px-2 text-xs italic text-accent-400 transition hover:text-accent-700
        ${isCopied ? "opacity-100" : "duration-400 opacity-0"}`}
        >
          Copied!
        </span>
      </div>
    </div>
  );
}

interface PostShareLinkGeneratorProps {
  post: Post;
  onGenerate: (url: string) => void;
}
function PostShareLinkGenerator(props: PostShareLinkGeneratorProps) {
  const { onGenerate, post } = props;
  const sharePostMutation = useMutation(async () => {
    const res = await fetch("/api/posts/shared", {
      body: JSON.stringify({ postId: post.id }),
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
    });

    if (!res.ok) {
      await throwOnResponseError(res);
    }

    const json = (await res.json()) as { shareUrl: string };
    onGenerate(json.shareUrl);
  });

  return (
    <div className="mb-2 mt-4 py-2 px-2">
      <SharePostContent>
        <div className="flex w-full flex-row justify-between">
          <button
            onClick={() => sharePostMutation.mutate()}
            type="button"
            className="flex flex-row items-center gap-3 
            text-accent-500 hover:text-accent-600"
          >
            <LinkIcon className="h-6 w-6" />
            <span>Generate a Link</span>
          </button>

          {sharePostMutation.isLoading && (
            <LoadingSpinner size={24} className="border text-accent-500" />
          )}
        </div>
      </SharePostContent>
      {sharePostMutation.isError && (
        <span className="mt-2 text-xs italic text-red-600">
          {getErrorMessage(sharePostMutation.error)}
        </span>
      )}
    </div>
  );
}

const SharePostContent: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex flex-row flex-wrap items-center rounded-md bg-base-700 py-4 px-4 shadow-md">
      {children}
    </div>
  );
};

type TextButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

const TextButton: React.FC<PropsWithChildren<TextButtonProps>> = ({
  children,
  ...props
}) => {
  const { className, ...rest } = props;

  // @tw
  const buttonBaseClassName =
    "flex hover:bg-white/5 rounded min-w-[40px] flex-row items-center justify-center px-4 py-2";

  return (
    <button {...rest} className={twMerge(buttonBaseClassName, className)}>
      {children}
    </button>
  );
};
