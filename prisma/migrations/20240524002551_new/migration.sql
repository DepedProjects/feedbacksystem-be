-- CreateTable
CREATE TABLE `users` (
    `uid` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `officeName` VARCHAR(191) NULL,
    `officeId` INTEGER NULL,

    UNIQUE INDEX `users_username_key`(`username`),
    PRIMARY KEY (`uid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Submitters` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `ageId` INTEGER NULL,
    `clientTypeId` INTEGER NULL,
    `sex` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Submitters_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Age` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Age_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ServiceFeedback` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `submitterId` INTEGER NOT NULL,
    `submittername` VARCHAR(191) NOT NULL,
    `serviceDesc` VARCHAR(191) NULL,
    `serviceId` INTEGER NOT NULL,
    `otherService` TEXT NULL,
    `typeId` INTEGER NULL,
    `ageBracketId` INTEGER NULL,
    `serviceKindId` INTEGER NULL,
    `serviceKindDescription` VARCHAR(191) NULL,
    `relatedClientType` VARCHAR(191) NULL,
    `ageBracket` VARCHAR(191) NULL,
    `officeId` INTEGER NOT NULL,
    `officeName` VARCHAR(191) NULL,
    `consent` VARCHAR(191) NULL,
    `awareCC` VARCHAR(191) NULL,
    `seeCC` VARCHAR(191) NULL,
    `useCC` VARCHAR(191) NULL,
    `overallComment` VARCHAR(191) NULL,
    `averageRating` DOUBLE NOT NULL,
    `responsiveness` INTEGER NOT NULL,
    `reliability` INTEGER NOT NULL,
    `accessAndFacilities` INTEGER NOT NULL,
    `communication` INTEGER NOT NULL,
    `costs` INTEGER NOT NULL,
    `integrity` INTEGER NOT NULL,
    `assurance` INTEGER NOT NULL,
    `outcome` INTEGER NOT NULL,
    `uniqueIdentifier` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ServiceFeedback_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClientType` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ClientType_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FeedbackQuestion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `categoryId` INTEGER NOT NULL,
    `questionId` INTEGER NOT NULL,
    `rating` INTEGER NOT NULL,
    `serviceFeedbackId` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `FeedbackQuestion_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Services` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `relatedOfficeId` INTEGER NULL,
    `serviceKindId` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Services_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ServiceKind` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ServiceKind_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `serviceFeedbackId` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Logs_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `qualityDimension` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Categories_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Questions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `categoryId` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Questions_id_key`(`id`),
    UNIQUE INDEX `Questions_title_key`(`title`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Offices` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Offices_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_officeId_fkey` FOREIGN KEY (`officeId`) REFERENCES `Offices`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Submitters` ADD CONSTRAINT `Submitters_ageId_fkey` FOREIGN KEY (`ageId`) REFERENCES `Age`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Submitters` ADD CONSTRAINT `Submitters_clientTypeId_fkey` FOREIGN KEY (`clientTypeId`) REFERENCES `ClientType`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceFeedback` ADD CONSTRAINT `ServiceFeedback_submitterId_fkey` FOREIGN KEY (`submitterId`) REFERENCES `Submitters`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceFeedback` ADD CONSTRAINT `ServiceFeedback_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Services`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceFeedback` ADD CONSTRAINT `ServiceFeedback_typeId_fkey` FOREIGN KEY (`typeId`) REFERENCES `ClientType`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceFeedback` ADD CONSTRAINT `ServiceFeedback_ageBracketId_fkey` FOREIGN KEY (`ageBracketId`) REFERENCES `Age`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceFeedback` ADD CONSTRAINT `ServiceFeedback_serviceKindId_fkey` FOREIGN KEY (`serviceKindId`) REFERENCES `ServiceKind`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceFeedback` ADD CONSTRAINT `ServiceFeedback_officeId_fkey` FOREIGN KEY (`officeId`) REFERENCES `Offices`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FeedbackQuestion` ADD CONSTRAINT `FeedbackQuestion_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FeedbackQuestion` ADD CONSTRAINT `FeedbackQuestion_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `Questions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FeedbackQuestion` ADD CONSTRAINT `FeedbackQuestion_serviceFeedbackId_fkey` FOREIGN KEY (`serviceFeedbackId`) REFERENCES `ServiceFeedback`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Services` ADD CONSTRAINT `Services_relatedOfficeId_fkey` FOREIGN KEY (`relatedOfficeId`) REFERENCES `Offices`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Services` ADD CONSTRAINT `Services_serviceKindId_fkey` FOREIGN KEY (`serviceKindId`) REFERENCES `ServiceKind`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Logs` ADD CONSTRAINT `Logs_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Submitters`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Logs` ADD CONSTRAINT `Logs_serviceFeedbackId_fkey` FOREIGN KEY (`serviceFeedbackId`) REFERENCES `ServiceFeedback`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Questions` ADD CONSTRAINT `Questions_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
