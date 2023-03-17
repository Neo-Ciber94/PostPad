import "react-quill/dist/quill.snow.css";
import { useState, useMemo, Suspense } from "react";
import { useMatchMedia } from "@/lib/client/hooks/useMatchMedia";
import React from "react";
import EditorLoading from "../loading/EditorLoading";
import dynamic from "next/dynamic";

// const ReactQuill = React.lazy(() => import("react-quill"));
// const Toolbar = React.lazy(() => import("./Toolbar"));

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});
const Toolbar = dynamic(() => import("./Toolbar"), {
  ssr: false,
});

interface PostEditorProps {
  value: string | undefined;
  onChange: (value: string) => void;
}

export function PostEditor({ value, onChange }: PostEditorProps) {
  const prefersDarkMode = useMatchMedia("(prefers-color-scheme: dark)");
  const [isDark, setIsDark] = useState(prefersDarkMode);
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
    <Suspense fallback={<EditorLoading />}>
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
          onToggleDarkMode={() => setIsDark((dark) => !dark)}
          isFullScreen={isFullScreen}
          onToggleFullScreen={() =>
            setIsFullScreen((fullScreen) => !fullScreen)
          }
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
    </Suspense>
  );
}
