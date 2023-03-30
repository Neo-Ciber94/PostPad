import { createResponseFromError } from "@/lib/server/utils/createResponseFromError";
import { delay } from "@/lib/utils/delay";
import { json } from "@/lib/utils/responseUtils";
import { NextRequest } from "next/server";

export default async function handler(req: NextRequest) {
  await delay(3000);

  try {
    const { prompt } = await req.json();

    return json({
      prompt,
      url: "shorturl.at/afpCM",
    });
  } catch (err) {
    console.error(err);
    return createResponseFromError(err);
  }
}
