-- CreateTable
CREATE TABLE `Comments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `text` VARCHAR(191) NOT NULL,
    `serviceFeedbackId` INTEGER NOT NULL,

    UNIQUE INDEX `Comments_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Comments` ADD CONSTRAINT `Comments_serviceFeedbackId_fkey` FOREIGN KEY (`serviceFeedbackId`) REFERENCES `ServiceFeedback`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
