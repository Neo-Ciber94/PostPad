import { GetAllPostsOptions } from "@/lib/server/repositories/post.repository";
import { PostService } from "@/lib/server/services/post.service";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function GET(request: Request) {
  const postService = new PostService();
  const options = getGetAllPostsOptionsFromRequest(request);
  const result = await postService.getAllPosts(options);
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const postService = new PostService();

  try {
    const input = await request.json();
    const result = await postService.createPost(input);
    console.log({ created: input });
    return NextResponse.json(result);
  } catch (err) {
    console.error(err);

    if (err instanceof ZodError) {
      const zodError = err as ZodError;
      return NextResponse.json(zodError.message, {
        status: 400,
      });
    }

    return NextResponse.json(
      { message: "Something went wrong" },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(request: Request) {
  const postService = new PostService();

  try {
    const input = await request.json();
    const result = await postService.updatePost(input);

    if (result == null) {
      return NextResponse.json(
        { message: "Post not found" },
        {
          status: 404,
        }
      );
    }

    console.log({ updated: input });
    return NextResponse.json(result);
  } catch (err) {
    console.error(err);

    if (err instanceof ZodError) {
      const zodError = err as ZodError;
      return NextResponse.json(zodError.message, {
        status: 400,
      });
    }

    return NextResponse.json(
      { message: "Something went wrong" },
      {
        status: 500,
      }
    );
  }
}

function getGetAllPostsOptionsFromRequest(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? undefined;
  const page = searchParams.get("page") ?? undefined;
  const limit = searchParams.get("limit") ?? undefined;
  const tags = searchParams.getAll("tags");
  const options: GetAllPostsOptions = { tags };

  if (search) {
    options.search = search;
  }

  if (page && !Number.isNaN(page)) {
    options.pagination = { ...options.pagination, page: Number(page) };
  }

  if (limit && !Number.isNaN(page)) {
    options.pagination = { ...options.pagination, limit: Number(limit) };
  }

  return options;
}
