import "react-quill/dist/quill.snow.css";
import { useState } from "react";
import React from "react";
import ReactQuill from "react-quill";
import { useDarkMode } from "@/lib/client/contexts/DarkModeContext";
import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
} from "@heroicons/react/24/solid";
import { DarkModeToggle } from "../DarkModeToggle";
import BlotFormatter from "quill-blot-formatter";
import CustomImage from "./CustomImage";
import CustomVideo from "./CustomVideo";

ReactQuill.Quill.register("modules/blotFormatter", BlotFormatter, true);
ReactQuill.Quill.register("formats/image", CustomImage, true);
ReactQuill.Quill.register("formats/video", CustomVideo, true);

const Font = ReactQuill.Quill.import("formats/font");

Font.whitelist = [
  "arial",
  "courier-new",
  "georgia",
  "helvetica",
  "lucida",
  "roboto",
  "quicksand",
];

ReactQuill.Quill.register(Font, true);

const modules = {
  syntax: true,
  blotFormatter: {},
  toolbar: [
    [{ font: Font.whitelist }],
    ["bold", "italic", "underline", "strike"],
    [{ header: 1 }, { header: 2 }, { header: 3 }, { header: 4 }],
    [{ list: "ordered" }, { list: "bullet" }, { align: [] }],
    ["blockquote", "code-block"],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ script: "sub" }, { script: "super" }],
    [{ color: ["red", "blue"] }, { background: [] }],
    ["link", "image", "video"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "size",
  "font",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "code-block",
  "color",
  "background",
  "code",
  "script",
  "list",
  "bullet",
  "indent",
  "link",
  "align",
  "image",
  "video",
  "height",
  "width",
  "class",
  "style",
];

export interface PostEditorProps {
  value: string | undefined;
  readOnly?: boolean;
  onChange: (value: string) => void;
}

export default function PostEditor({
  value,
  onChange,
  readOnly,
}: PostEditorProps) {
  const { isDarkMode } = useDarkMode();
  const [isFullScreen, setIsFullScreen] = useState(false);

  return (
    <div
      className={`text-editor ${isDarkMode ? "dark" : ""} ${
        isFullScreen ? "fullscreen" : ""
      } scrollbar
    scrollbar-track-base-300/25
    scrollbar-thumb-base-900 
    `}
    >
      {/* <Toolbar
        isFullScreen={isFullScreen}
        onToggleFullScreen={() => setIsFullScreen((fullScreen) => !fullScreen)}
      /> */}

      <div className="flex flex-row justify-end gap-2 p-2">
        <DarkModeToggle size={24} />
        <button
          type="button"
          className="h-6 w-6"
          onClick={() => setIsFullScreen((fullScreen) => !fullScreen)}
        >
          {isFullScreen ? <ArrowsPointingInIcon /> : <ArrowsPointingOutIcon />}
        </button>
      </div>

      <ReactQuill
        theme="snow"
        value={value}
        modules={modules}
        formats={formats}
        readOnly={readOnly}
        onChange={onChange}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.preventDefault();
            setIsFullScreen(false);
          }
        }}
      />
    </div>
  );
}
