-- CreateTable
CREATE TABLE `GeneratedImage` (
    `id` VARCHAR(191) NOT NULL,
    `url` MEDIUMTEXT NOT NULL,
    `createdByPrompt` TINYTEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdByUserId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `GeneratedImage_id_key`(`id`),
    INDEX `GeneratedImage_createdByUserId_idx`(`createdByUserId`),
    FULLTEXT INDEX `GeneratedImage_createdByPrompt_idx`(`createdByPrompt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
