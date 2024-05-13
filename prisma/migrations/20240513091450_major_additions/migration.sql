/*
  Warnings:

  - Added the required column `costs` to the `ServiceFeedback` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `servicefeedback` ADD COLUMN `awareCC` VARCHAR(191) NULL,
    ADD COLUMN `costs` INTEGER NOT NULL,
    ADD COLUMN `seeCC` VARCHAR(191) NULL,
    ADD COLUMN `useCC` VARCHAR(191) NULL;
