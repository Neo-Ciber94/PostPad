import { createResponseFromError } from "@/lib/server/utils/createResponseFromError";
import { delay } from "@/lib/utils/delay";
import { json } from "@/lib/utils/responseUtils";

export const config = {
  runtime: "edge",
};

export default async function handler(req: Request) {
  await delay(3000);

  try {
    const { prompt } = await req.json();

    return json({
      prompt,
      url: "https://i.imgur.com/VeJ3BNH.png",
    });
  } catch (err) {
    console.error(err);
    return createResponseFromError(err);
  }
}
