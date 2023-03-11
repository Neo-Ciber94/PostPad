import { PostService } from "@/lib/server/services/post.service";
import { RequestContext } from "@/lib/server/types/RequestContext";
import { json } from "@/lib/utils/responseUtils";

export async function DELETE(_: Request, ctx: RequestContext<{ id: string }>) {
  const postService = new PostService();

  try {
    const result = await postService.deletePost(ctx.params.id);

    if (result == null) {
      return json(404, { message: "Post not found" });
    }

    console.log({ deleted: result });
    return json(result);
  } catch (err) {
    console.error(err);
    return json(500, { message: "Something went wrong" });
  }
}
