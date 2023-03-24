import { PostService } from "@/lib/server/services/post.service";
import { SearchParams } from "@/lib/server/types/RequestContext";
import { getArray } from "@/lib/utils/getArray";
import { notFound, redirect } from "next/navigation";
import { SharedPostService } from "../services/sharedPost.service";
import { getCurrentUserId } from "../utils/getCurrentUserId";

const postsLoader = {
  /**
   * Gets the post with the given slug.
   */
  async getPostBySlug(slug: string) {
    const postService = new PostService();
    const result = await postService.getPostBySlug(slug);

    if (result == null) {
      return notFound();
    }

    return result;
  },

  /**
   * Get all the posts.
   */
  async getPosts(searchParams: SearchParams = {}) {
    const postService = new PostService();
    const search = getArray(searchParams["search"] || [])[0];
    const posts = await postService.getAllPosts({ search });
    return posts;
  },

  async getSharedPost(sharedPostId: string) {
    const sharedPostService = new SharedPostService();
    const post = await sharedPostService.findPost(sharedPostId);

    if (post == null) {
      return notFound();
    }

    // If the current user is which created the post, redirect to it
    const userId = await getCurrentUserId();

    if (userId != null && userId == post.createdByUser.id) {
      return redirect(`posts/${post.slug}`);
    }

    return post;
  },
};

export default postsLoader;
