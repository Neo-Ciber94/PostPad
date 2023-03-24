import { SharedPostRepository } from "../repositories/sharedPost.repository";
import { PostWithUser, SharedPost } from "../schemas/Post";
import { getCurrentUserId } from "../utils/getCurrentUserId";

export class SharedPostService {
  private readonly sharedPostRepository = new SharedPostRepository();

  async findPost(sharedPostId: string): Promise<PostWithUser | null> {
    const post = await this.sharedPostRepository.findPost(sharedPostId);
    return post;
  }

  async createSharedPost(postId: string): Promise<SharedPost> {
    const userId = await getCurrentUserId();
    const sharedPost = await this.sharedPostRepository.create(postId, userId);
    return sharedPost;
  }

  async deleteSharedPost(postId: string): Promise<void> {
    const userId = await getCurrentUserId();
    await this.sharedPostRepository.delete(postId, userId);
  }
}
