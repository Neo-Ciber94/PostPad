import { delay } from "@/lib/utils/delay";

export async function POST(req: Request) {
  await delay(1000);

  const data = JSON.stringify({
    shareUrl: `https://postpad.vercel.app/post/${Date.now()}${Date.now()}${Date.now()}`,
  });

  return new Response(data, {
    headers: {
      "content-type": "application/json",
    },
  });
}

export async function DELETE(req: Request) {
  await delay(1000);

  const data = JSON.stringify({
    shareUrl: `https://postpad.vercel.app/post/${Date.now()}${Date.now()}${Date.now()}`,
  });

  return new Response(data, {
    headers: {
      "content-type": "application/json",
    },
  });
}
