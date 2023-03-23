import { SharedPostService } from "@/lib/server/services/sharedPost.service";
import { createJsonResponseFromError } from "@/lib/server/utils/createJsonResponseFromError";
import { z } from "zod";

const shareInputSchema = z.object({
  postId: z.string(),
});

export async function POST(req: Request) {
  try {
    const service = new SharedPostService();
    const input = await req.json().then(shareInputSchema.parse);
    const sharedPost = await service.createSharedPost(input.postId);
    const { origin } = new URL(req.url);

    const data = JSON.stringify({
      shareUrl: `${origin}/api/posts/shared/${sharedPost.id}`,
    });

    return new Response(data, {
      headers: { "content-type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return createJsonResponseFromError(err);
  }
}

const deleteSharedPostSchema = z.object({
  sharedPostId: z.string(),
});

export async function DELETE(req: Request) {
  try {
    const service = new SharedPostService();
    const input = await req.json().then(deleteSharedPostSchema.parse);
    await service.deleteSharedPost(input.sharedPostId);

    // OK 200
    return new Response();
  } catch (err) {
    console.error(err);
    return createJsonResponseFromError(err);
  }
}
