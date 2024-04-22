/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Questions` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `questions` MODIFY `description` TEXT NULL,
    MODIFY `title` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Questions_title_key` ON `Questions`(`title`);
