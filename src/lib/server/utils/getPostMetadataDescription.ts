import { truncateString } from "@/lib/utils/truncateString";
import { Post } from "../schemas/Post";

export function getPostMetadataDescription(post: Post): string | undefined {
  let description = post.content;

  if (description == null) {
    return undefined;
  }

  description = truncateString(description, 255);

  // Remove the HTML tags
  description = description.replace(/<[^>]*>(.*)<[^>]*>/g, (s) => `${s}. `).replace(/<[^>]*>/g, "");
  return description;
}
