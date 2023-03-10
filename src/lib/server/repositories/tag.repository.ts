import { prisma } from "../database/prisma";

export class TagRepository {
  async getAll() {
    const tags = await prisma.tag.findMany({
      distinct: "name",
    });

    return tags;
  }
}
