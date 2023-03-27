import { PostService } from "@/lib/server/services/post.service";
import { RequestContext } from "@/lib/server/types/RequestContext";
import { createResponseFromError } from "@/lib/server/utils/createResponseFromError";
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

    return json(result);
  } catch (error) {
    console.error({ error });
    return createResponseFromError(error);
  }
}
