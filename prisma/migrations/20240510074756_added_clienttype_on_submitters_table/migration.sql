-- AlterTable
ALTER TABLE `submitters` ADD COLUMN `clientTypeId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Submitters` ADD CONSTRAINT `Submitters_clientTypeId_fkey` FOREIGN KEY (`clientTypeId`) REFERENCES `ClientType`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
