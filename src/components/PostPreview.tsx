import { useDarkMode } from "@/lib/client/contexts/DarkModeContext";
import { Post } from "@/lib/server/schemas/Post";
import ReactQuill from "react-quill";
import { DarkModeToggle } from "./DarkModeToggle";

export interface PostPreviewProps {
  post: Post;
}

export default function PostPreview({ post }: PostPreviewProps) {
  const { isDarkMode } = useDarkMode();

  return (
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
        modules={{}}
      />
    </div>
  );
}
