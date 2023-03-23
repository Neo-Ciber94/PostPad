import {
  GetAllPostsOptions,
  PostRepository,
} from "../repositories/post.repository";
import { CreatePost, Post, UpdatePost } from "../schemas/Post";
import { getCurrentUserId } from "@/lib/server/utils/getUserIdFromSession";

export class PostService {
  private readonly postRepository = new PostRepository();

  async getAllPosts(options: GetAllPostsOptions = {}): Promise<Post[]> {
    const userId = await getCurrentUserId();
    return this.postRepository.getAll(userId, options);
  }

  async getPostById(id: string): Promise<Post | null> {
    const userId = await getCurrentUserId();
    return this.postRepository.getById(userId, id);
  }

  async getPostBySlug(slug: string): Promise<Post | null> {
    const userId = await getCurrentUserId();
    return this.postRepository.getBySlug(userId, slug);
  }

  async createPost(post: CreatePost): Promise<Post> {
    const userId = await getCurrentUserId();
    return this.postRepository.create(userId, post);
  }

  async updatePost(post: UpdatePost): Promise<Post | null> {
    const userId = await getCurrentUserId();
    return this.postRepository.update(userId, post);
  }

  async deletePost(id: string): Promise<Post | null> {
    const userId = await getCurrentUserId();
    return this.postRepository.delete(userId, id);
  }
}
