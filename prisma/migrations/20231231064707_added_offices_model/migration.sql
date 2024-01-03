/*
  Warnings:

  - You are about to drop the column `officeVisited` on the `servicefeedback` table. All the data in the column will be lost.
  - Added the required column `officeId` to the `ServiceFeedback` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `servicefeedback` DROP COLUMN `officeVisited`,
    ADD COLUMN `officeId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Offices` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Offices_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ServiceFeedback` ADD CONSTRAINT `ServiceFeedback_officeId_fkey` FOREIGN KEY (`officeId`) REFERENCES `Offices`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
