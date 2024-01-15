/*
  Warnings:

  - You are about to drop the column `overallRating` on the `servicefeedback` table. All the data in the column will be lost.
  - Added the required column `averageRating` to the `ServiceFeedback` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `servicefeedback` DROP COLUMN `overallRating`,
    ADD COLUMN `averageRating` INTEGER NOT NULL;
