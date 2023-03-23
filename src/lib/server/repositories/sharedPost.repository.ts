import { ApplicationError, ErrorCode } from "@/lib/shared/error";
import { prisma } from "../database/prisma";
import {
  Post,
  postSchema,
  SharedPost,
  sharedPostSchema,
} from "../schemas/Post";

export class SharedPostRepository {
  async findPost(sharedPostId: string): Promise<Post> {
    const sharedPost = await prisma.sharedPost.findFirst({
      where: {
        id: sharedPostId,
      },
      include: {
        post: {
          include: {
            tags: true
          },
        },
      },
    });

    if (sharedPost == null) {
      throw new ApplicationError("shared post not found", ErrorCode.NOT_FOUND);
    }

    return postSchema.parse(sharedPost.post);
  }

  async create(postId: string, userId: string): Promise<SharedPost> {
    const post = await prisma.post.findFirst({
      where: {
        id: postId,
        createdByUserId: userId,
      },
      include: {
        sharedPosts: true,
      },
    });

    if (post == null) {
      throw new ApplicationError("post not found", ErrorCode.NOT_FOUND);
    }

    if (post.sharedPosts.length > 0) {
      throw new ApplicationError(
        "post is already shared",
        ErrorCode.BAD_REQUEST
      );
    }

    const shared = await prisma.sharedPost.create({
      data: {
        postId: post.id,
      },
    });

    return sharedPostSchema.parse(shared);
  }

  async delete(sharedPostId: string, userId: string) {
    const toDelete = await prisma.sharedPost.findFirst({
      where: {
        id: sharedPostId,
        post: {
          createdByUserId: userId,
        },
      },
    });

    if (toDelete == null) {
      throw new ApplicationError("shared post not found", ErrorCode.NOT_FOUND);
    }

    await prisma.sharedPost.delete({ where: { id: toDelete.id } });
  }
}
