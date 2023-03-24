import { useDarkMode } from "@/lib/client/contexts/DarkModeContext";
import { PostWithUser } from "@/lib/server/schemas/Post";
import ReactQuill from "react-quill";
import AIGeneratedTag from "./AIGeneratedTag";
import { DarkModeToggle } from "./DarkModeToggle";
import CustomImage from "./Editor/CustomImage";
import CustomVideo from "./Editor/CustomVideo";

ReactQuill.Quill.register("formats/image", CustomImage, true);
ReactQuill.Quill.register("formats/video", CustomVideo, true);

export interface PostPreviewProps {
  post: PostWithUser;
}

export default function PostPreview({ post }: PostPreviewProps) {
  const { isDarkMode } = useDarkMode();

  return (
    <>
      <div className="mb-10">
        {post != null && <PostCreationInfo post={post} />}

        <div
          className={`overflow-hidden rounded-lg py-4 transition-colors duration-500 ${
            isDarkMode ? "bg-[#0d1117] text-white" : "text-dark bg-white"
          }`}
        >
          <div className="px-4">
            <div className="mb-4 flex flex-row justify-end">
              <DarkModeToggle />
            </div>
            <hr className="border-neutral-400 opacity-30" />
          </div>

          <ReactQuill
            value={post.content || ""}
            readOnly
            theme="bubble"
            modules={{
              syntax: true,
            }}
          />
        </div>

        {post.isAIGenerated && (
          <div className="mt-2 mb-14 flex flex-row justify-start">
            <AIGeneratedTag />
          </div>
        )}
      </div>
    </>
  );
}

interface PostCreationInfoProps {
  post: PostWithUser;
}
function PostCreationInfo({ post }: PostCreationInfoProps) {
  return (
    <div className="mb-2 flex w-full flex-row justify-between px-2">
      <span></span>
      <span className="text-xs italic text-slate-300 opacity-70">{`Created by ${
        post.createdByUser.name
      } on: ${new Date(
        post.createdAt ?? post.updatedAt
      ).toLocaleString()}`}</span>
    </div>
  );
}
