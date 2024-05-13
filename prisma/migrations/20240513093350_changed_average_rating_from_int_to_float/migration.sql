/*
  Warnings:

  - You are about to alter the column `averageRating` on the `servicefeedback` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `servicefeedback` MODIFY `averageRating` DOUBLE NOT NULL;
