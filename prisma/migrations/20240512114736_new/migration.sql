/*
  Warnings:

  - You are about to drop the column `clientTypeId` on the `servicefeedback` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `servicefeedback` DROP FOREIGN KEY `ServiceFeedback_clientTypeId_fkey`;

-- AlterTable
ALTER TABLE `servicefeedback` DROP COLUMN `clientTypeId`,
    ADD COLUMN `typeId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `ServiceFeedback` ADD CONSTRAINT `ServiceFeedback_typeId_fkey` FOREIGN KEY (`typeId`) REFERENCES `ClientType`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
