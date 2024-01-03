/*
  Warnings:

  - You are about to drop the column `comment` on the `servicefeedback` table. All the data in the column will be lost.
  - Added the required column `overallRating` to the `ServiceFeedback` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `servicefeedback` DROP COLUMN `comment`,
    ADD COLUMN `overallComment` VARCHAR(191) NULL,
    ADD COLUMN `overallRating` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `services` MODIFY `title` VARCHAR(191) NULL;
