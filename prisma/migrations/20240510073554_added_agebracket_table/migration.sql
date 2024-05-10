/*
  Warnings:

  - You are about to drop the column `age` on the `servicefeedback` table. All the data in the column will be lost.
  - You are about to drop the column `age` on the `submitters` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `servicefeedback` DROP COLUMN `age`;

-- AlterTable
ALTER TABLE `submitters` DROP COLUMN `age`,
    ADD COLUMN `ageId` INTEGER NULL;

-- CreateTable
CREATE TABLE `Age` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Age_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Submitters` ADD CONSTRAINT `Submitters_ageId_fkey` FOREIGN KEY (`ageId`) REFERENCES `Age`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
