import {
  GetAllPostsOptions,
  PostRepository,
} from "../repositories/post.repository";
import { CreatePost, Post, UpdatePost } from "../schemas/Post";

export class PostService {
  private readonly repository = new PostRepository();

  getAllPosts(options: GetAllPostsOptions = {}): Promise<Post[]> {
    return this.repository.getAll(options);
  }

  getPostById(id: string): Promise<Post | null> {
    return this.repository.getById(id);
  }

  getPostBySlug(slug: string): Promise<Post | null> {
    return this.repository.getBySlug(slug);
  }

  createPost(post: CreatePost): Promise<Post> {
    return this.repository.create(post);
  }

  updatePost(post: UpdatePost): Promise<Post | null> {
    return this.repository.update(post);
  }

  deletePost(id: string): Promise<Post | null> {
    return this.repository.delete(id);
  }
}
