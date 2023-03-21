interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export async function POST(request: Request) {
  const { signal } = request;
  const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
    signal,
  });

  const json = (await res.json()) as Post[];
  const post = json[Math.floor(Math.random() * json.length)];
  const lines = post.body.split("\n");

  console.log({ post });

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      async function sendChunks() {
        for (const line of lines) {
          for (const text of line.split(/(\s)/g)) {
            if (signal.aborted) {
              return;
            }

            await delay(100);
            const chunk = encoder.encode(text);
            controller.enqueue(chunk);
          }
        }
      }

      await sendChunks();
      controller.close();
    },
  });

  return new Response(stream);
}

function delay(ms: number): Promise<void> {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}
