/*
  Warnings:

  - You are about to drop the column `startTTime` on the `servicefeedback` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `servicefeedback` DROP COLUMN `startTTime`,
    ADD COLUMN `startTime` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3);
