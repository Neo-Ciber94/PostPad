-- DropForeignKey
ALTER TABLE `Account` DROP FOREIGN KEY `Account_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Post` DROP FOREIGN KEY `Post_createdByUserId_fkey`;

-- DropForeignKey
ALTER TABLE `Session` DROP FOREIGN KEY `Session_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Tag` DROP FOREIGN KEY `Tag_createdByUserId_fkey`;

-- DropForeignKey
ALTER TABLE `Tag` DROP FOREIGN KEY `Tag_postId_fkey`;

-- AlterTable
ALTER TABLE `Post` ADD COLUMN `aiGenerated` BOOLEAN NOT NULL DEFAULT false;

-- RenameIndex
ALTER TABLE `Account` RENAME INDEX `Account_userId_fkey` TO `Account_userId_idx`;

-- RenameIndex
ALTER TABLE `Post` RENAME INDEX `Post_createdByUserId_fkey` TO `Post_createdByUserId_idx`;

-- RenameIndex
ALTER TABLE `Session` RENAME INDEX `Session_userId_fkey` TO `Session_userId_idx`;

-- RenameIndex
ALTER TABLE `Tag` RENAME INDEX `Tag_createdByUserId_fkey` TO `Tag_createdByUserId_idx`;

-- RenameIndex
ALTER TABLE `Tag` RENAME INDEX `Tag_postId_fkey` TO `Tag_postId_idx`;
