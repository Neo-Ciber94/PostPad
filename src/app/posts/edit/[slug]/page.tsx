import { HightLight } from "@/components/Editor/HighLight";
import BaseEditPostPage from "@/components/pages/posts/BaseEditPostPage";
import postsLoader from "@/lib/server/loaders/postsLoader";
import { RequestContext } from "@/lib/server/types/RequestContext";

export const metadata = {
  title: "PostPad | Edit",
  description: "Edit a post",
};

type Params = { slug: string };

export default async function EditPostPage(ctx: RequestContext<Params>) {
  const { slug } = ctx.params;
  const post = await postsLoader.getPostBySlug(slug);
  return (
    <>
      <BaseEditPostPage post={post} />
      <HightLight />
    </>
  );
}
