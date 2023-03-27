import { createObjectFromSearchParams } from "@/lib/utils/createObjectFromSearchParams";
import { ImageResponse } from "@vercel/og";
import { z } from "zod";

export const config = {
  runtime: "edge",
};

const font = fetch(
  new URL("../../../../public/assets/fonts/Quicksand-SemiBold.ttf", import.meta.url)
).then((res) => res.arrayBuffer());

const DEFAULT_WIDTH = 1200;
const DEFAULT_HEIGHT = 600;

const imageSchema = z.object({
  width: z
    .number()
    .positive()
    .pipe(z.coerce.number())
    .optional()
    .default(DEFAULT_WIDTH)
    .catch(DEFAULT_WIDTH),
  height: z
    .number()
    .positive()
    .pipe(z.coerce.number())
    .optional()
    .default(DEFAULT_HEIGHT)
    .catch(DEFAULT_HEIGHT),
});

export default async function handler(req: Request) {
  const fontData = await font;

  const searchParams = createObjectFromSearchParams(new URL(req.url).searchParams);
  const { width, height } = imageSchema.parse(searchParams);

  return new ImageResponse(<Logo />, {
    width,
    height,
    fonts: [
      {
        name: "Quicksand",
        data: fontData,
        style: "normal",
      },
    ],
  });
}

function Logo() {
  return (
    <div
      style={{
        display: "flex",

        backgroundColor: "rgba(56, 58, 89)",
        color: "white",
        width: "100%",
        height: "100%",
        textAlign: "center",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
      }}
    >
      <span style={{ fontSize: 150 }}>📝</span>
      <span style={{ fontSize: 120 }}>PostPad</span>
    </div>
  );
}
