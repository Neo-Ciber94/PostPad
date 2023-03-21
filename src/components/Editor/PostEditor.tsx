import "react-quill/dist/quill.snow.css";
import { useState, useMemo } from "react";
import React from "react";
import Toolbar from "./Toolbar";
import ReactQuill from "react-quill";
import { useDarkMode } from "@/lib/client/contexts/DarkModeContext";

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

  const editorModules = useMemo(
    () => ({
      toolbar: {
        container: "#toolbar",
      },
    }),
    []
  );

  return (
    <div
      className={`text-editor ${isDarkMode ? "dark" : ""} ${
        isFullScreen ? "fullscreen" : ""
      } scrollbar
    scrollbar-track-base-300/25
    scrollbar-thumb-base-900 
    `}
    >
      <Toolbar
        isFullScreen={isFullScreen}
        onToggleFullScreen={() => setIsFullScreen((fullScreen) => !fullScreen)}
      />

      <ReactQuill
        theme="snow"
        value={value}
        modules={editorModules}
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
