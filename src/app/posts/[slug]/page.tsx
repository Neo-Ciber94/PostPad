import PostPageBase from "@/components/pages/posts/PostPageBase";
import postsLoader from "@/lib/server/loaders/postsLoader";
import { RequestContext } from "@/lib/server/types/RequestContext";
import { truncateString } from "@/lib/utils/truncateString";
import { Metadata } from "next";

export async function generateMetadata(
  ctx: RequestContext<{ slug: string }>
): Promise<Metadata> {
  const slug = ctx.params.slug;
  const post = await postsLoader.getPostBySlug(slug);

  let description = post.content;

  if (description) {
    description = truncateString(description, 50);
  }

  return {
    title: `PostPad | ${post.title}`,
    description,
  };
}

type Params = { slug: string };

export default async function PostPage(ctx: RequestContext<Params>) {
  const slug = ctx.params.slug;
  const post = await postsLoader.getPostBySlug(slug);
  return <PostPageBase post={post} />;
}
