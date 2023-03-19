import { PostService } from "@/lib/server/services/post.service";
import { RequestContext } from "@/lib/server/types/RequestContext";
import { NextResponse } from "next/server";

export async function DELETE(_: Request, ctx: RequestContext<{ id: string }>) {
  const postService = new PostService();

  try {
    const result = await postService.deletePost(ctx.params.id);

    if (result == null) {
      return NextResponse.json(
        { message: "Post not found" },
        {
          status: 404,
        }
      );
    }

    console.log({ deleted: result });
    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Something went wrong" },
      {
        status: 500,
      }
    );
  }
}
