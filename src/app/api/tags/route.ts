import { TagService } from "@/lib/server/services/tag.service";
import { json } from "@/lib/utils/responseUtils";

export async function GET() {
  const service = new TagService();
  const tags = await service.getAllTags();
  return json(tags);
}
