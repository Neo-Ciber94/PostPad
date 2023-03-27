// `s` stands for shared
import BaseSharedPostPage from "@/components/base/p/BaseSharePostPage";
import postsLoader from "@/lib/server/loaders/postsLoader";
import { RequestContext } from "@/lib/server/types/RequestContext";
import { getPostMetadataDescription } from "@/lib/server/utils/getPostMetadataDescription";
import { Metadata } from "next";

export async function generateMetadata(ctx: RequestContext<Params>): Promise<Metadata> {
  const sharedPostId = ctx.params.sharedPostId;
  const post = await postsLoader.getSharedPost(sharedPostId);
  const description = getPostMetadataDescription(post);

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
