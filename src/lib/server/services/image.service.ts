import { GetAllGeneratedImageOptions, ImageRepository } from "../repositories/image.repository";
import { CreateGeneratedImage } from "../schemas/GeneratedImage";
import { getCurrentUserId } from "../utils/getCurrentUserId";

export class ImageService {
  private readonly imageRepository = new ImageRepository();

  async getAllImages(options: GetAllGeneratedImageOptions = {}) {
    const userId = await getCurrentUserId();

    if (userId == null) {
      throw new Error("user not found");
    }

    const result = await this.imageRepository.getAll(userId, options);
    return result;
  }

  async createImages(input: CreateGeneratedImage) {
    const userId = await getCurrentUserId();

    if (userId == null) {
      throw new Error("user not found");
    }

    const result = await this.imageRepository.create(input, userId);
    return result;
  }

  async deleteImage(imageId: string) {
    const userId = await getCurrentUserId();

    if (userId == null) {
      throw new Error("user not found");
    }

    const result = await this.imageRepository.delete(imageId, userId);
    return result;
  }
}
