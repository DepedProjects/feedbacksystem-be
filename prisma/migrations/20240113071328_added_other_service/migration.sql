/*
  Warnings:

  - You are about to drop the column `serviceDesc` on the `servicefeedback` table. All the data in the column will be lost.
  - Added the required column `serviceId` to the `ServiceFeedback` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `servicefeedback` DROP FOREIGN KEY `ServiceFeedback_serviceDesc_fkey`;

-- DropIndex
DROP INDEX `Services_title_key` ON `services`;

-- AlterTable
ALTER TABLE `servicefeedback` DROP COLUMN `serviceDesc`,
    ADD COLUMN `serviceId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `services` ALTER COLUMN `title` DROP DEFAULT;

-- AddForeignKey
ALTER TABLE `ServiceFeedback` ADD CONSTRAINT `ServiceFeedback_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Services`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
