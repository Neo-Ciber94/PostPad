import { GetAllPostsOptions } from "@/lib/server/repositories/post.repository";
import { PostService } from "@/lib/server/services/post.service";
import { createResponseFromError } from "@/lib/server/utils/createResponseFromError";
import { limitUserRequest } from "@/lib/server/utils/rateLimiter";
import { json } from "@/lib/utils/responseUtils";
import { cookies as getCookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(request: Request) {
  const postService = new PostService();
  const options = getGetAllPostsOptionsFromRequest(request);
  const result = await postService.getAllPosts(options);
  return json(result);
}

export async function POST(request: Request) {
  const postService = new PostService();

  const cookies = getCookies();

  try {
    const input = await request.json();
    const result = await postService.createPost(input);
    await limitUserRequest(cookies);
    return json(result);
  } catch (error) {
    console.error({ error });
    return createResponseFromError(error);
  }
}

export async function PUT(request: NextRequest) {
  const postService = new PostService();

  try {
    const input = await request.json();
    const result = await postService.updatePost(input);
    const cookies = getCookies();

    if (result == null) {
      return json(
        { message: "Post not found" },
        {
          status: 404,
        }
      );
    }

    await limitUserRequest(cookies);
    return json(result);
  } catch (error) {
    console.error({ error });
    return createResponseFromError(error);
  }
}

function getGetAllPostsOptionsFromRequest(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? undefined;
  const cursor = searchParams.get("cursor") ?? undefined;
  const tags = searchParams.getAll("tags");
  const options: GetAllPostsOptions = { tags };

  if (search) {
    options.search = search;
  }

  if (cursor) {
    options.pagination = { cursor };
  }

  return options;
}
