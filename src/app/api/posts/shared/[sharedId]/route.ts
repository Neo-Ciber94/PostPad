import { SharedPostService } from "@/lib/server/services/sharedPost.service";
import { RequestContext } from "@/lib/server/types/RequestContext";
import { createJsonResponseFromError } from "@/lib/server/utils/createJsonResponseFromError";
import { json } from "@/lib/utils/responseUtils";

export async function GET(
  _: Request,
  ctx: RequestContext<{ sharedId: string }>
) {
  try {
    const { sharedId } = ctx.params;
    const service = new SharedPostService();
    const result = await service.findPost(sharedId);
    return json(result);
  } catch (err) {
    console.error(err);
    return createJsonResponseFromError(err);
  }
}
