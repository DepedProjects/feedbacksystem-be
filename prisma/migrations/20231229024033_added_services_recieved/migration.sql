/*
  Warnings:

  - Added the required column `service_recieved_id` to the `Submitters` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `submitters` ADD COLUMN `service_recieved_id` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `ServiceKind` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ServiceKind_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Submitters` ADD CONSTRAINT `Submitters_service_recieved_id_fkey` FOREIGN KEY (`service_recieved_id`) REFERENCES `ServiceKind`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
