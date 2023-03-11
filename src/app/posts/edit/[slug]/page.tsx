import EditPostPageBase from "@/components/pages/posts/EditPostPageBase";
import postsLoader from "@/lib/server/loaders/postsLoader";
import { RequestContext } from "@/lib/server/types/RequestContext";
import { wait } from "@/lib/utils/wait";

export const metadata = {
  title: "PostVine | Edit",
  description: "Edit a post",
};

type Params = { slug: string };

export default async function EditPostPage(ctx: RequestContext<Params>) {
  const { slug } = ctx.params;
  const post = await postsLoader.getPostBySlug(slug);
  return <EditPostPageBase post={post} />;
}
