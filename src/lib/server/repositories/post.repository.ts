import { z } from "zod";
import { prisma } from "../database/prisma";
import {
  CreatePost,
  createPostSchema,
  Post,
  postSchema,
  PostWithUser,
  postWithUserSchema,
  UpdatePost,
  updatePostSchema,
} from "../schemas/Post";
import { arrayPartition } from "../../utils/arrayUtils";
import { generateSlug } from "../../utils/generateSlug";

const getAllPostsOptionsSchema = z.object({
  search: z.string().optional(),
  tags: z.array(z.string()).optional(),
  pagination: z
    .object({
      page: z.number().min(1).nullish(),
      limit: z.number().min(1).max(100).nullish(),
    })
    .optional(),
});

export type GetAllPostsOptions = z.infer<typeof getAllPostsOptionsSchema>;

export class PostRepository {
  async getAll(
    userId: string,
    options: GetAllPostsOptions = {}
  ): Promise<Post[]> {
    const {
      search,
      skip,
      take,
      tags = [],
    } = getQueryCriteriaFromOptions(options);

    console.log({ skip, take });

    const result = await prisma.post.findMany({
      where: {
        content: { search },
        title: { search },
        createdByUserId: userId,
        tags: tags.length === 0 ? undefined : { some: { name: { in: tags } } },
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 100,
      //skip,
      include: {
        tags: true,
        sharedPosts: true,
      },
    });

    return result.map((x) => postSchema.parse(x));
  }

  async getById(userId: string, id: string): Promise<PostWithUser | null> {
    const result = await prisma.post.findFirst({
      where: { id, createdByUserId: userId },
      include: { tags: true, sharedPosts: true, createdByUser: true },
    });

    if (result == null) {
      return null;
    }

    return postWithUserSchema.parse(result);
  }

  async getBySlug(userId: string, slug: string): Promise<PostWithUser | null> {
    const result = await prisma.post.findFirst({
      where: { slug, createdByUserId: userId },
      include: { tags: true, sharedPosts: true, createdByUser: true },
    });

    if (result == null) {
      return null;
    }

    return postWithUserSchema.parse(result);
  }

  async create(userId: string, post: CreatePost): Promise<Post> {
    const data = createPostSchema.parse(post);
    const slug = generateSlug(post.title.toLowerCase());
    const tags = post.tags || [];

    // Set the user
    const tagsWithUser = tags.map((t) => ({ ...t, createdByUserId: userId }));

    const result = await prisma.post.create({
      data: {
        slug,
        title: data.title.trim(),
        content: data.content?.trim(),
        isAIGenerated: data.isAIGenerated,
        createdByUserId: userId,
        tags: {
          create: tagsWithUser,
        },
      },
    });

    return postSchema.parse(result);
  }

  async update(userId: string, post: UpdatePost): Promise<Post | null> {
    const data = updatePostSchema.parse(trimStrings(post));
    const postToUpdate = await prisma.post.findFirst({
      where: { id: post.id, createdByUserId: userId },
      select: {
        id: true,
        content: true,
        title: true,
        slug: true,
      },
    });

    if (postToUpdate == null) {
      return null;
    }

    // Only generate a new slug if the title changed
    const slug =
      data.title === postToUpdate.title
        ? postToUpdate.slug
        : generateSlug(post.title.toLowerCase());

    // The split the new and current tags
    const [newTags, tags] = arrayPartition(
      post.tags || [],
      (x) => x.id == null
    );

    const newTagsWithUser = newTags.map((t) => ({
      ...t,
      createdByUserId: userId,
    }));

    const result = await prisma.post.update({
      where: { id: post.id },
      data: {
        ...postToUpdate,
        ...data,
        slug,
        tags: {
          // TODO: Not sure if this code will work anywhere,
          // we must be sure the tags are deleted first
          // and then we add the new tags, in that order.

          // Delete the relations not included in the current tags
          deleteMany: {
            id: {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              notIn: tags.map((x) => x.id!),
            },
          },

          // Insert the new tags
          create: newTagsWithUser,
        },
      },
    });

    return postSchema.parse(result);
  }

  async delete(userId: string, id: string): Promise<Post | null> {
    const postToDelete = await this.getById(userId, id);

    if (postToDelete == null) {
      return null;
    }

    const result = await prisma.post.delete({
      where: { id },
    });

    return postSchema.parse(result);
  }
}

function trimStrings<T extends Record<string, unknown>>(obj: T): T {
  for (const key in obj) {
    const value = obj[key];

    if (typeof value === "string") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      obj[key] = value.trim() as any;
    }
  }
  return obj;
}

function getQueryCriteriaFromOptions(options: GetAllPostsOptions) {
  const DEFAULT_LIMIT = 100;

  // On invalid parse we just ignore the result
  const optionsResult = getAllPostsOptionsSchema.safeParse(options);
  const { pagination, search, tags } = optionsResult.success
    ? options
    : ({} as GetAllPostsOptions);

  let take = DEFAULT_LIMIT;
  let skip: number | undefined;

  if (pagination) {
    const page = pagination.page ?? 1;
    take = pagination.limit ?? DEFAULT_LIMIT;
    skip = (page - 1) * (pagination.limit || DEFAULT_LIMIT);
  }

  return { search, take, skip, tags };
}
