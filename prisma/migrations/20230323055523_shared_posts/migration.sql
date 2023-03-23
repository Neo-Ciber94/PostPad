-- AlterTable
ALTER TABLE `Post` MODIFY `title` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `Tag` MODIFY `name` TINYTEXT NOT NULL;

-- CreateTable
CREATE TABLE `SharedPost` (
    `id` VARCHAR(191) NOT NULL,
    `postId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `SharedPost_id_key`(`id`),
    INDEX `SharedPost_postId_idx`(`postId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
