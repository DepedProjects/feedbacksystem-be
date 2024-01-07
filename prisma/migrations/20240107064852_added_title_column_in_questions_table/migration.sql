/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Questions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `title` to the `Questions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `questions` ADD COLUMN `title` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Questions_title_key` ON `Questions`(`title`);
