import BasePostsListPage from "@/components/pages/posts/BasePostListPage";
import postsLoader from "@/lib/server/loaders/postsLoader";
import { RequestContext } from "@/lib/server/types/RequestContext";
import { wait } from "@/lib/utils/wait";

export const metadata = {
  title: "PostPad",
  description: "An application to create posts",
};

export default async function PostsListPage({ searchParams }: RequestContext) {
  await wait(3000);
  const posts = await postsLoader.getPosts(searchParams);
  return <BasePostsListPage initialPosts={posts} />;
}
