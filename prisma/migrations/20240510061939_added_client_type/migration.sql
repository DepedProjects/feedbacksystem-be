-- AlterTable
ALTER TABLE `servicefeedback` ADD COLUMN `clientTypeId` INTEGER NULL;

-- CreateTable
CREATE TABLE `ClientType` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ClientType_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ServiceFeedback` ADD CONSTRAINT `ServiceFeedback_clientTypeId_fkey` FOREIGN KEY (`clientTypeId`) REFERENCES `ClientType`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
