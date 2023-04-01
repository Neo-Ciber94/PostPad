import { z } from "zod";
import { prisma } from "../database/prisma";
import {
  CreateGeneratedImage,
  createGeneratedImageSchema,
  generatedImageSchema,
} from "../schemas/GeneratedImage";

export const getAllGeneratedImageOptions = z.object({
  search: z.string().nullish(),
});

export type GetAllGeneratedImageOptions = z.infer<typeof getAllGeneratedImageOptions>;

export class ImageRepository {
  async getAll(userId: string, options: GetAllGeneratedImageOptions = {}) {
    const { search } = options;
    const results = await prisma.generatedImage.findMany({
      where: {
        createdByUserId: userId,
        createdByPrompt:
          search == null
            ? undefined
            : {
                search: `${search}*`,
              },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return results.map((x) => generatedImageSchema.parse(x));
  }

  async create(input: CreateGeneratedImage, userId: string) {
    const data = createGeneratedImageSchema.parse(input);

    const result = await prisma.generatedImage.createMany({
      data: data.imageUrls.map((url) => ({
        url,
        createdByPrompt: data.createdByPrompt,
        createdByUserId: userId,
      })),
    });

    return result.count;
  }

  async delete(id: string, userId: string) {
    const generatedImage = await prisma.generatedImage.findFirst({
      where: { id, createdByUserId: userId },
    });

    if (generatedImage == null) {
      return null;
    }

    const result = await prisma.generatedImage.delete({
      where: { id },
    });

    return generatedImageSchema.parse(result);
  }
}
