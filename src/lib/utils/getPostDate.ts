import dayjs from "dayjs";
import { Post } from "../server/schemas/Post";
import localizedFormat from "dayjs/plugin/localizedFormat";
dayjs.extend(localizedFormat);

export function getPostDate(post: Post) {
  return dayjs(post.updatedAt ?? post.createdAt).format("lll");
}
