-- DropForeignKey
ALTER TABLE `servicefeedback` DROP FOREIGN KEY `ServiceFeedback_serviceKindId_fkey`;

-- AlterTable
ALTER TABLE `servicefeedback` MODIFY `serviceKindId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `ServiceFeedback` ADD CONSTRAINT `ServiceFeedback_serviceKindId_fkey` FOREIGN KEY (`serviceKindId`) REFERENCES `ServiceKind`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
