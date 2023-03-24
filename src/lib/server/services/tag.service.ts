import { getCurrentUserId } from "@/lib/server/utils/getCurrentUserId";
import { TagRepository } from "../repositories/tag.repository";

export class TagService {
  protected readonly repository = new TagRepository();

  async getAllTags() {
    const userId = await getCurrentUserId();

    if (userId == null) {
      throw new Error("user not found");
    }

    const result = await this.repository.getAll(userId);
    return result;
  }
}
