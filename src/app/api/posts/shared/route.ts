import { SharedPostService } from "@/lib/server/services/sharedPost.service";
import { createJsonResponseFromError } from "@/lib/server/utils/createJsonResponseFromError";
import { getSharedPostUrl } from "@/lib/utils/getSharedPostUrl";
import { z } from "zod";

const shareInputSchema = z.object({
  postId: z.string(),
});

export async function POST(req: Request) {
  try {
    const service = new SharedPostService();
    const input = await req.json().then(shareInputSchema.parse);
    const sharedPost = await service.createSharedPost(input.postId);
    const shareUrl = getSharedPostUrl(new URL(req.url), sharedPost.id);
    const data = JSON.stringify({ shareUrl });
    
    return new Response(data, {
      headers: { "content-type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return createJsonResponseFromError(err);
  }
}

const deleteSharedPostSchema = z.object({
  postId: z.string(),
});

export async function DELETE(req: Request) {
  try {
    const service = new SharedPostService();
    const input = await req.json().then(deleteSharedPostSchema.parse);
    await service.deleteSharedPost(input.postId);

    // OK 200
    return new Response();
  } catch (err) {
    console.error(err);
    return createJsonResponseFromError(err);
  }
}
