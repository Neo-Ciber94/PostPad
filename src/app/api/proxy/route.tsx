import satori from "satori";
import sharp from "sharp";
import nodeFetch from "node-fetch";
import fs from "fs/promises";
import path from "path";

// /proxy?type=image&&url={url}
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const encodedUrl = searchParams.get("url");

  if (encodedUrl == null) {
    return new Response("No url provided", {
      status: 400,
    });
  }

  const decodedUrl = decodeURIComponent(encodedUrl);
  const response = await nodeFetch(decodedUrl);

  if (response.ok) {
    // FIXME: We could add caching headers here
    return response;
  }

  if (type == "image") {
    try {
      // return 404 image
      const webp = await renderNotFoundComponentToWebP();

      return new Response(webp, {
        status: 404,
        headers: {
          // TODO: Control this with a e-tag
          "cache-control": "max-age=3600",
          "content-type": "image/webp",
        },
      });
    } catch (err) {
      console.error(err);
      return response;
    }
  }

  return response;
}

async function renderNotFoundComponentToWebP() {
  const fontPath = path.join(process.cwd(), "public/assets/fonts/Quicksand-SemiBold.ttf");
  const Quicksand = await fs.readFile(fontPath);

  const svg = await satori(<NotFoundImage />, {
    height: 1024,
    width: 1024,
    // We need to include at least 1 font
    fonts: [
      {
        data: Quicksand,
        name: "Quicksand",
        style: "normal",
      },
    ],
  });

  const webp = await sharp(Buffer.from(svg)).webp().toBuffer();
  return webp;
}

function NotFoundImage() {
  return (
    <div
      style={{
        backgroundColor: "#d4d4d4",
        color: "#454545",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: 100,
        fontWeight: "bold",
        padding: 10,
        fontFamily: "monospace",
        width: "100%",
        height: "100%",
      }}
    >
      Not Found
    </div>
  );
}
