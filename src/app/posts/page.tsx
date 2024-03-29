import BasePostsListPage from "@/components/base/posts/BasePostListPage";
import postsLoader from "@/lib/server/loaders/postsLoader";
import { RequestContext } from "@/lib/server/types/RequestContext";

export default async function PostsListPage({ searchParams }: RequestContext) {
  const posts = await postsLoader.getPosts(searchParams);
  return <BasePostsListPage initialPosts={posts} />;
}
