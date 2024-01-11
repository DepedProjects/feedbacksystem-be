/*
  Warnings:

  - You are about to drop the column `description` on the `categories` table. All the data in the column will be lost.
  - Added the required column `qualityDimension` to the `Categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceKindId` to the `Services` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `categories` DROP COLUMN `description`,
    ADD COLUMN `qualityDimension` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `servicefeedback` ADD COLUMN `otherService` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `services` ADD COLUMN `serviceKindId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Services` ADD CONSTRAINT `Services_serviceKindId_fkey` FOREIGN KEY (`serviceKindId`) REFERENCES `ServiceKind`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
