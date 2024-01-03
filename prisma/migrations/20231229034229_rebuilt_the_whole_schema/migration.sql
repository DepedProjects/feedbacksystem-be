/*
  Warnings:

  - You are about to drop the column `created_at` on the `logs` table. All the data in the column will be lost.
  - You are about to drop the column `submitter_id` on the `logs` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `logs` table. All the data in the column will be lost.
  - You are about to drop the column `Age` on the `submitters` table. All the data in the column will be lost.
  - You are about to drop the column `Sex` on the `submitters` table. All the data in the column will be lost.
  - You are about to drop the column `office_id` on the `submitters` table. All the data in the column will be lost.
  - You are about to drop the column `region_id` on the `submitters` table. All the data in the column will be lost.
  - You are about to drop the column `service_recieved_id` on the `submitters` table. All the data in the column will be lost.
  - You are about to drop the `comments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `divisions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `offices` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `questions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `regions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `schools` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `units` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `serviceFeedbackId` to the `Logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `age` to the `Submitters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sex` to the `Submitters` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `comments` DROP FOREIGN KEY `Comments_comment_submitter_id_fkey`;

-- DropForeignKey
ALTER TABLE `logs` DROP FOREIGN KEY `Logs_submitter_id_fkey`;

-- DropForeignKey
ALTER TABLE `offices` DROP FOREIGN KEY `Offices_region_id_fkey`;

-- DropForeignKey
ALTER TABLE `questions` DROP FOREIGN KEY `Questions_service_id_fkey`;

-- DropForeignKey
ALTER TABLE `schools` DROP FOREIGN KEY `Schools_school_region_id_fkey`;

-- DropForeignKey
ALTER TABLE `submitters` DROP FOREIGN KEY `Submitters_office_id_fkey`;

-- DropForeignKey
ALTER TABLE `submitters` DROP FOREIGN KEY `Submitters_region_id_fkey`;

-- DropForeignKey
ALTER TABLE `submitters` DROP FOREIGN KEY `Submitters_service_recieved_id_fkey`;

-- DropForeignKey
ALTER TABLE `units` DROP FOREIGN KEY `Units_division_id_fkey`;

-- AlterTable
ALTER TABLE `logs` DROP COLUMN `created_at`,
    DROP COLUMN `submitter_id`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `serviceFeedbackId` INTEGER NOT NULL,
    ADD COLUMN `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `submitters` DROP COLUMN `Age`,
    DROP COLUMN `Sex`,
    DROP COLUMN `office_id`,
    DROP COLUMN `region_id`,
    DROP COLUMN `service_recieved_id`,
    ADD COLUMN `age` INTEGER NOT NULL,
    ADD COLUMN `sex` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `comments`;

-- DropTable
DROP TABLE `divisions`;

-- DropTable
DROP TABLE `offices`;

-- DropTable
DROP TABLE `questions`;

-- DropTable
DROP TABLE `regions`;

-- DropTable
DROP TABLE `schools`;

-- DropTable
DROP TABLE `units`;

-- CreateTable
CREATE TABLE `ServiceFeedback` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `submitterId` INTEGER NOT NULL,
    `serviceId` INTEGER NOT NULL,
    `serviceKindId` INTEGER NOT NULL,
    `officeVisited` INTEGER NOT NULL,

    UNIQUE INDEX `ServiceFeedback_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FeedbackQuestion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `categoryId` INTEGER NOT NULL,
    `questionId` INTEGER NOT NULL,
    `rating` INTEGER NOT NULL,
    `serviceFeedbackId` INTEGER NOT NULL,

    UNIQUE INDEX `FeedbackQuestion_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ServiceFeedback` ADD CONSTRAINT `ServiceFeedback_submitterId_fkey` FOREIGN KEY (`submitterId`) REFERENCES `Submitters`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceFeedback` ADD CONSTRAINT `ServiceFeedback_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Services`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceFeedback` ADD CONSTRAINT `ServiceFeedback_serviceKindId_fkey` FOREIGN KEY (`serviceKindId`) REFERENCES `ServiceKind`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FeedbackQuestion` ADD CONSTRAINT `FeedbackQuestion_serviceFeedbackId_fkey` FOREIGN KEY (`serviceFeedbackId`) REFERENCES `ServiceFeedback`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Logs` ADD CONSTRAINT `Logs_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Submitters`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Logs` ADD CONSTRAINT `Logs_serviceFeedbackId_fkey` FOREIGN KEY (`serviceFeedbackId`) REFERENCES `ServiceFeedback`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
