import dynamic from "next/dynamic";
import EditorLoading from "../loading/EditorLoading";
import type { PostEditorProps } from "./PostEditor.lazy";

const Editor = dynamic(() => import("./PostEditor.lazy"), {
  ssr: false,
  loading: () => <EditorLoading />,
});

export function PostEditor(props: PostEditorProps) {
  return <Editor {...props} />;
}
