import { prisma } from "../database/prisma";
import { tagSchema } from "../schemas/Tag";

export class TagRepository {
  async getAll() {
    const tags = await prisma.tag.findMany({
      distinct: "name",
    });

    return tags.map((tag) => tagSchema.parse(tag));
  }
}
