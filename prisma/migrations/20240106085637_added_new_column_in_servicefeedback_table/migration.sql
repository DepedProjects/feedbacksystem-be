/*
  Warnings:

  - Added the required column `uniqueIdentifier` to the `ServiceFeedback` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `servicefeedback` ADD COLUMN `uniqueIdentifier` VARCHAR(191) NOT NULL;
