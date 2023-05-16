import satori from "satori";
import sharp from "sharp";
import fs from "fs/promises";
import path from "path";

const DEFAULT_SIZE: ImageSize = {
  height: 1024,
  width: 1024,
  fontSize: 100,
};

type ImageSize = {
  width: number;
  height: number;
  fontSize: number;
};

export async function imageNotFoundResponse(size: ImageSize = DEFAULT_SIZE) {
  // return 404 image
  const webp = await renderNotFoundComponentToWebP(size);

  return new Response(webp, {
    status: 404,
    headers: {
      // TODO: Control this with a e-tag
      "cache-control": "max-age=3600",
      "content-type": "image/webp",
    },
  });
}

async function renderNotFoundComponentToWebP(size: ImageSize) {
  const fontPath = path.join(process.cwd(), "public/assets/fonts/Quicksand-SemiBold.ttf");
  const Quicksand = await fs.readFile(fontPath);

  const svg = await satori(<NotFoundImage fontSize={size.fontSize} />, {
    height: size.height,
    width: size.width,
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

function NotFoundImage({ fontSize }: { fontSize: number }) {
  return (
    <div
      style={{
        backgroundColor: "#d4d4d4",
        color: "#454545",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: fontSize,
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
