import { SharedPostRepository } from "../repositories/sharedPost.repository";
import { Post, SharedPost } from "../schemas/Post";
import { getUserIdFromSession } from "../utils/getUserIdFromSession";

export class SharedPostService {
  private readonly sharedPostRepository = new SharedPostRepository();

  async findPost(sharedPostId: string): Promise<Post> {
    const post = await this.sharedPostRepository.findPost(sharedPostId);
    return post;
  }

  async createSharedPost(postId: string): Promise<SharedPost> {
    const userId = await getUserIdFromSession();
    const sharedPost = await this.sharedPostRepository.create(postId, userId);
    return sharedPost;
  }

  async deleteSharedPost(sharedPostId: string): Promise<void> {
    const userId = await getUserIdFromSession();
    await this.sharedPostRepository.delete(sharedPostId, userId);
  }
}
