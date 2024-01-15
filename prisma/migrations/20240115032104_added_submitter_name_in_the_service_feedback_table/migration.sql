/*
  Warnings:

  - Added the required column `submittername` to the `ServiceFeedback` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `servicefeedback` ADD COLUMN `submittername` VARCHAR(191) NOT NULL;
