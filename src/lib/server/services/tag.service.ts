import { TagRepository } from "../repositories/tag.repository";
import { tagSchema } from "../schemas/Tag";

export class TagService {
  protected readonly repository = new TagRepository();

  async getAllTags() {
    const result = await this.repository.getAll();
    return result;
  }
}
