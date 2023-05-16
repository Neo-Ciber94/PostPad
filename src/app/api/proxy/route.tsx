import { imageNotFoundResponse } from "@/lib/utils/imageNotFoundResponse";
import nodeFetch from "node-fetch";

// /proxy?type=image&url={url}
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
  const response = await nodeFetch(decodedUrl); // fetch is being modified by `next`

  console.log(response);

  if (response.ok) {
    // FIXME: We could add caching headers here
    return response;
  }

  if (type == "image") {
    try {
      return imageNotFoundResponse();
    } catch (err) {
      console.error(err);
      return response;
    }
  }

  return response;
}
