import BasePostPage from "@/components/base/posts/BasePostPage";
import postsLoader from "@/lib/server/loaders/postsLoader";
import { RequestContext } from "@/lib/server/types/RequestContext";
import { getPostMetadataDescription } from "@/lib/server/utils/getPostMetadataDescription";
import { Metadata } from "next";

export async function generateMetadata(ctx: RequestContext<{ slug: string }>): Promise<Metadata> {
  const slug = ctx.params.slug;
  const post = await postsLoader.getPostBySlug(slug);
  const description = getPostMetadataDescription(post);

  return {
    title: `PostPad | ${post.title}`,
    description,
  };
}

type Params = { slug: string };

export default async function PostPage(ctx: RequestContext<Params>) {
  const slug = ctx.params.slug;
  const post = await postsLoader.getPostBySlug(slug);
  return <BasePostPage post={post} />;
}
