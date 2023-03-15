import { prisma } from "../database/prisma";
import { tagSchema } from "../schemas/Tag";

export class TagRepository {
  async getAll(userId: string) {
    const tags = await prisma.tag.findMany({
      distinct: "name",
      where: {
        createdByUserId: userId,
      },
    });

    return tags.map((tag) => tagSchema.parse(tag));
  }
}
