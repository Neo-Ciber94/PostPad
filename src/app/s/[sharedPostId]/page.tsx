// `s` stands for shared
import BaseSharedPostPage from "@/components/base/p/BaseSharePostPage";
import postsLoader from "@/lib/server/loaders/postsLoader";
import { RequestContext } from "@/lib/server/types/RequestContext";
import { truncateString } from "@/lib/utils/truncateString";
import { Metadata } from "next";

export async function generateMetadata(
  ctx: RequestContext<Params>
): Promise<Metadata> {
  const sharedPostId = ctx.params.sharedPostId;
  const post = await postsLoader.getSharedPost(sharedPostId);

  let description = post.content;

  if (description) {
    description = truncateString(description, 50);
  }

  return {
    title: `PostPad | ${post.title}`,
    description,
  };
}

type Params = {
  sharedPostId: string;
};

export default async function SharedPostPage(ctx: RequestContext<Params>) {
  const sharedPostId = ctx.params.sharedPostId;
  const post = await postsLoader.getSharedPost(sharedPostId);

  return <BaseSharedPostPage post={post} />;
}
