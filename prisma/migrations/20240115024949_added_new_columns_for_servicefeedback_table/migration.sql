/*
  Warnings:

  - Added the required column `overallRating` to the `ServiceFeedback` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `servicefeedback` ADD COLUMN `overallRating` INTEGER NOT NULL;
