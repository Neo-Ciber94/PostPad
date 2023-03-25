import {
  GetAllPostsOptions,
  PostRepository,
} from "../repositories/post.repository";
import { CreatePost, Post, PostWithUser, UpdatePost } from "../schemas/Post";
import { getCurrentUserId } from "@/lib/server/utils/getCurrentUserId";
import { PageResult } from "@/lib/utils/types";

export class PostService {
  private readonly postRepository = new PostRepository();

  async getAllPosts(
    options: GetAllPostsOptions = {}
  ): Promise<PageResult<Post>> {
    const userId = await getCurrentUserId();

    if (userId == null) {
      throw new Error("user not found");
    }

    return this.postRepository.getAll(userId, options);
  }

  async getPostById(id: string): Promise<PostWithUser | null> {
    const userId = await getCurrentUserId();

    if (userId == null) {
      throw new Error("user not found");
    }

    return this.postRepository.getById(userId, id);
  }

  async getPostBySlug(slug: string): Promise<PostWithUser | null> {
    const userId = await getCurrentUserId();

    if (userId == null) {
      throw new Error("user not found");
    }

    return this.postRepository.getBySlug(userId, slug);
  }

  async createPost(post: CreatePost): Promise<Post> {
    const userId = await getCurrentUserId();

    if (userId == null) {
      throw new Error("user not found");
    }

    return this.postRepository.create(userId, post);
  }

  async updatePost(post: UpdatePost): Promise<Post | null> {
    const userId = await getCurrentUserId();

    if (userId == null) {
      throw new Error("user not found");
    }

    return this.postRepository.update(userId, post);
  }

  async deletePost(id: string): Promise<Post | null> {
    const userId = await getCurrentUserId();

    if (userId == null) {
      throw new Error("user not found");
    }

    return this.postRepository.delete(userId, id);
  }
}
