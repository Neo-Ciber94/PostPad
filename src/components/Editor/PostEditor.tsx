import "react-quill/dist/quill.snow.css";
import { useState, useMemo } from "react";
import React from "react";
import Toolbar from "./Toolbar";
import ReactQuill from "react-quill";

export interface PostEditorProps {
  value: string | undefined;
  onChange: (value: string) => void;
  isDark: boolean;
  onToggleDarkMode: () => void;
}

export default function PostEditor({
  value,
  onChange,
  isDark,
  onToggleDarkMode,
}: PostEditorProps) {
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
      className={`text-editor ${isDark ? "dark" : ""} ${
        isFullScreen ? "fullscreen" : ""
      } scrollbar
    scrollbar-track-base-300/25
    scrollbar-thumb-base-900 
    `}
    >
      <Toolbar
        isDarkMode={isDark}
        onToggleDarkMode={onToggleDarkMode}
        isFullScreen={isFullScreen}
        onToggleFullScreen={() => setIsFullScreen((fullScreen) => !fullScreen)}
      />

      <ReactQuill
        theme="snow"
        value={value}
        modules={editorModules}
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
