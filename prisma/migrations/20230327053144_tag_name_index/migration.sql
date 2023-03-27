-- AlterTable
ALTER TABLE `Tag` MODIFY `name` VARCHAR(36) NOT NULL;

-- CreateIndex
CREATE INDEX `Tag_name_idx` ON `Tag`(`name`);
