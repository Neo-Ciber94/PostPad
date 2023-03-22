import { PostService } from "@/lib/server/services/post.service";
import { RequestContext } from "@/lib/server/types/RequestContext";
import { json } from "@/lib/utils/responseUtils";

export async function DELETE(_: Request, ctx: RequestContext<{ id: string }>) {
  const postService = new PostService();

  try {
    const result = await postService.deletePost(ctx.params.id);

    if (result == null) {
      return json(
        { message: "Post not found" },
        {
          status: 404,
        }
      );
    }

    console.log({ deleted: result });
    return json(result);
  } catch (error) {
    console.error({ error });
    return json(
      { message: "Something went wrong" },
      {
        status: 500,
      }
    );
  }
}
