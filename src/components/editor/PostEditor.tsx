import "react-quill/dist/quill.snow.css";
import hljs from "highlight.js";
import { useRef, useState } from "react";
import React from "react";
import ReactQuill, { Quill } from "react-quill";
import { useDarkMode } from "@/lib/client/contexts/DarkModeContext";
import { ArrowsPointingInIcon, ArrowsPointingOutIcon } from "@heroicons/react/24/solid";
import { DarkModeToggle } from "../DarkModeToggle";
import BlotFormatter from "quill-blot-formatter";
import CustomImage from "./CustomImage";
import CustomVideo from "./CustomVideo";
import QuillImageDropAndPaste from "quill-image-drop-and-paste";
import ImageInputDialog, { ImageSource } from "../ImageInputDialog";
import { fileToBase64Url } from "@/lib/client/utils/fileToBase64Url";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";
import toast from "react-hot-toast";

// Custom image input: https://github.com/quilljs/quill/issues/2044#issuecomment-1387091319

Quill.register("modules/blotFormatter", BlotFormatter, true);
Quill.register("formats/image", CustomImage, true);
Quill.register("formats/video", CustomVideo, true);
Quill.register("modules/imageDropAndPaste", QuillImageDropAndPaste, true);

const Font = ReactQuill.Quill.import("formats/font");

Font.whitelist = ["arial", "courier-new", "georgia", "helvetica", "lucida", "roboto", "quicksand"];

ReactQuill.Quill.register(Font, true);

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

export default function PostEditor({ value, onChange, readOnly }: PostEditorProps) {
  const [open, setOpen] = useState(false);
  const quillRef = useRef<ReactQuill | null>(null);
  const { isDarkMode } = useDarkMode();
  const [isFullScreen, setIsFullScreen] = useState(false);

  const imageHandler = () => {
    if (open) {
      return;
    }

    setOpen(true);
  };

  const { current: modules } = useRef({
    syntax: {
      highlight: (text: string) => hljs.highlightAuto(text).value,
    },
    blotFormatter: {},
    imageDropAndPaste: {},
    toolbar: {
      container: [
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
      handlers: {
        image: imageHandler,
      },
    },
  });

  const handleClose = () => {
    setOpen(false);
  };

  const handleImage = async (source: ImageSource) => {
    if (!quillRef.current) {
      return;
    }

    const editor = quillRef.current.getEditor();
    const range = editor.getSelection();

    let imageUrl: string = "";

    switch (source.type) {
      case "url": {
        imageUrl = source.url;
        break;
      }
      case "file": {
        try {
          const base64Url = await fileToBase64Url(source.file);
          imageUrl = base64Url;
        } catch (err) {
          console.error(err);
          toast.error(getErrorMessage(err) ?? "Failed to get image");
        }

        break;
      }
      default:
        throw new Error("Invalid image type");
    }

    // TODO: Check if this range do not overwrite existing content
    const index = range?.index ?? editor.getContents().length() + 1;
    editor.insertEmbed(index, "image", imageUrl, "user");
    setOpen(false);
  };

  return (
    <>
      {open && <ImageInputDialog onChange={handleImage} onClose={handleClose} />}

      <div
        className={`text-editor ${isDarkMode ? "dark" : ""} ${
          isFullScreen ? "fullscreen" : ""
        } scrollbar
    scrollbar-track-base-300/25
    scrollbar-thumb-base-900 
    `}
      >
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
          ref={quillRef}
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
    </>
  );
}
