import { HightLight } from "@/components/Editor/HighLight";
import BaseCreatePostPage from "@/components/pages/posts/BaseCreatePostPage";

export const metadata = {
  title: "PostPad | Create",
  description: "Create a new post",
};

export default function NewPostPage() {
  return (
    <>
      <BaseCreatePostPage />
      <HightLight />
    </>
  );
}
