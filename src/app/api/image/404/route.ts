import { imageNotFoundResponse } from "@/lib/utils/imageNotFoundResponse";

// We send the custom 404 image for these cases
export function GET() {
  return imageNotFoundResponse();
}
