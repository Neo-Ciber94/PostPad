import { getUserIdFromSession } from "@/lib/utils/getUserIdFromSession";
import { TagRepository } from "../repositories/tag.repository";

export class TagService {
  protected readonly repository = new TagRepository();

  async getAllTags() {
    const userId = await getUserIdFromSession();
    const result = await this.repository.getAll(userId);
    return result;
  }
}
