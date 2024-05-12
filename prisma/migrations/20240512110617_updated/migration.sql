-- AlterTable
ALTER TABLE `servicefeedback` ADD COLUMN `ageBracketId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `ServiceFeedback` ADD CONSTRAINT `ServiceFeedback_ageBracketId_fkey` FOREIGN KEY (`ageBracketId`) REFERENCES `Age`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
