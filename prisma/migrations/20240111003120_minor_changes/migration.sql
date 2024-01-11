/*
  Warnings:

  - Added the required column `otherservice` to the `ServiceFeedback` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `servicefeedback` ADD COLUMN `otherservice` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `services` ADD COLUMN `otherServiceDesc` VARCHAR(191) NULL;
