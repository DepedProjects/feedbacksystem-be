-- DropForeignKey
ALTER TABLE `feedbackquestion` DROP FOREIGN KEY `FeedbackQuestion_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `feedbackquestion` DROP FOREIGN KEY `FeedbackQuestion_questionId_fkey`;

-- DropForeignKey
ALTER TABLE `feedbackquestion` DROP FOREIGN KEY `FeedbackQuestion_serviceFeedbackId_fkey`;

-- DropForeignKey
ALTER TABLE `logs` DROP FOREIGN KEY `Logs_serviceFeedbackId_fkey`;

-- DropForeignKey
ALTER TABLE `logs` DROP FOREIGN KEY `Logs_userId_fkey`;

-- DropForeignKey
ALTER TABLE `questions` DROP FOREIGN KEY `Questions_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `servicefeedback` DROP FOREIGN KEY `ServiceFeedback_ageBracketId_fkey`;

-- DropForeignKey
ALTER TABLE `servicefeedback` DROP FOREIGN KEY `ServiceFeedback_officeId_fkey`;

-- DropForeignKey
ALTER TABLE `servicefeedback` DROP FOREIGN KEY `ServiceFeedback_serviceId_fkey`;

-- DropForeignKey
ALTER TABLE `servicefeedback` DROP FOREIGN KEY `ServiceFeedback_serviceKindId_fkey`;

-- DropForeignKey
ALTER TABLE `servicefeedback` DROP FOREIGN KEY `ServiceFeedback_submitterId_fkey`;

-- DropForeignKey
ALTER TABLE `servicefeedback` DROP FOREIGN KEY `ServiceFeedback_typeId_fkey`;

-- DropForeignKey
ALTER TABLE `services` DROP FOREIGN KEY `Services_relatedOfficeId_fkey`;

-- DropForeignKey
ALTER TABLE `services` DROP FOREIGN KEY `Services_serviceKindId_fkey`;

-- DropForeignKey
ALTER TABLE `submitters` DROP FOREIGN KEY `Submitters_ageId_fkey`;

-- DropForeignKey
ALTER TABLE `submitters` DROP FOREIGN KEY `Submitters_clientTypeId_fkey`;

-- AddForeignKey
ALTER TABLE `submitters` ADD CONSTRAINT `submitters_ageId_fkey` FOREIGN KEY (`ageId`) REFERENCES `age`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `submitters` ADD CONSTRAINT `submitters_clientTypeId_fkey` FOREIGN KEY (`clientTypeId`) REFERENCES `clientType`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `serviceFeedback` ADD CONSTRAINT `serviceFeedback_submitterId_fkey` FOREIGN KEY (`submitterId`) REFERENCES `submitters`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `serviceFeedback` ADD CONSTRAINT `serviceFeedback_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `services`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `serviceFeedback` ADD CONSTRAINT `serviceFeedback_typeId_fkey` FOREIGN KEY (`typeId`) REFERENCES `clientType`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `serviceFeedback` ADD CONSTRAINT `serviceFeedback_ageBracketId_fkey` FOREIGN KEY (`ageBracketId`) REFERENCES `age`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `serviceFeedback` ADD CONSTRAINT `serviceFeedback_serviceKindId_fkey` FOREIGN KEY (`serviceKindId`) REFERENCES `serviceKind`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `serviceFeedback` ADD CONSTRAINT `serviceFeedback_officeId_fkey` FOREIGN KEY (`officeId`) REFERENCES `offices`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `feedbackQuestion` ADD CONSTRAINT `feedbackQuestion_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `feedbackQuestion` ADD CONSTRAINT `feedbackQuestion_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `questions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `feedbackQuestion` ADD CONSTRAINT `feedbackQuestion_serviceFeedbackId_fkey` FOREIGN KEY (`serviceFeedbackId`) REFERENCES `serviceFeedback`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `services` ADD CONSTRAINT `services_relatedOfficeId_fkey` FOREIGN KEY (`relatedOfficeId`) REFERENCES `offices`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `services` ADD CONSTRAINT `services_serviceKindId_fkey` FOREIGN KEY (`serviceKindId`) REFERENCES `serviceKind`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `logs` ADD CONSTRAINT `logs_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `submitters`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `logs` ADD CONSTRAINT `logs_serviceFeedbackId_fkey` FOREIGN KEY (`serviceFeedbackId`) REFERENCES `serviceFeedback`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `questions` ADD CONSTRAINT `questions_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `age` RENAME INDEX `Age_id_key` TO `age_id_key`;

-- RenameIndex
ALTER TABLE `categories` RENAME INDEX `Categories_id_key` TO `categories_id_key`;

-- RenameIndex
ALTER TABLE `clienttype` RENAME INDEX `ClientType_id_key` TO `clientType_id_key`;

-- RenameIndex
ALTER TABLE `feedbackquestion` RENAME INDEX `FeedbackQuestion_id_key` TO `feedbackQuestion_id_key`;

-- RenameIndex
ALTER TABLE `logs` RENAME INDEX `Logs_id_key` TO `logs_id_key`;

-- RenameIndex
ALTER TABLE `offices` RENAME INDEX `Offices_id_key` TO `offices_id_key`;

-- RenameIndex
ALTER TABLE `questions` RENAME INDEX `Questions_id_key` TO `questions_id_key`;

-- RenameIndex
ALTER TABLE `questions` RENAME INDEX `Questions_title_key` TO `questions_title_key`;

-- RenameIndex
ALTER TABLE `servicefeedback` RENAME INDEX `ServiceFeedback_id_key` TO `serviceFeedback_id_key`;

-- RenameIndex
ALTER TABLE `servicekind` RENAME INDEX `ServiceKind_id_key` TO `serviceKind_id_key`;

-- RenameIndex
ALTER TABLE `services` RENAME INDEX `Services_id_key` TO `services_id_key`;

-- RenameIndex
ALTER TABLE `submitters` RENAME INDEX `Submitters_id_key` TO `submitters_id_key`;
