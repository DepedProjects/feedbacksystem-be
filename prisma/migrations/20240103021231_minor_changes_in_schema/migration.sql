/*
  Warnings:

  - You are about to drop the column `serviceId` on the `servicefeedback` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[title]` on the table `Services` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `serviceDesc` to the `ServiceFeedback` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `servicefeedback` DROP FOREIGN KEY `ServiceFeedback_serviceId_fkey`;

-- AlterTable
ALTER TABLE `servicefeedback` DROP COLUMN `serviceId`,
    ADD COLUMN `serviceDesc` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `servicekind` MODIFY `description` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Services_title_key` ON `Services`(`title`);

-- AddForeignKey
ALTER TABLE `ServiceFeedback` ADD CONSTRAINT `ServiceFeedback_serviceDesc_fkey` FOREIGN KEY (`serviceDesc`) REFERENCES `Services`(`title`) ON DELETE RESTRICT ON UPDATE CASCADE;
