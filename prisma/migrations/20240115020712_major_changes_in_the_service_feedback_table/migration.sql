/*
  Warnings:

  - You are about to drop the column `overallRating` on the `servicefeedback` table. All the data in the column will be lost.
  - You are about to drop the `overallservicefeedback` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `accessAndFacilities` to the `ServiceFeedback` table without a default value. This is not possible if the table is not empty.
  - Added the required column `assurance` to the `ServiceFeedback` table without a default value. This is not possible if the table is not empty.
  - Added the required column `communication` to the `ServiceFeedback` table without a default value. This is not possible if the table is not empty.
  - Added the required column `integrity` to the `ServiceFeedback` table without a default value. This is not possible if the table is not empty.
  - Added the required column `outcome` to the `ServiceFeedback` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reliability` to the `ServiceFeedback` table without a default value. This is not possible if the table is not empty.
  - Added the required column `responsiveness` to the `ServiceFeedback` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `servicefeedback` DROP COLUMN `overallRating`,
    ADD COLUMN `accessAndFacilities` INTEGER NOT NULL,
    ADD COLUMN `assurance` INTEGER NOT NULL,
    ADD COLUMN `communication` INTEGER NOT NULL,
    ADD COLUMN `integrity` INTEGER NOT NULL,
    ADD COLUMN `outcome` INTEGER NOT NULL,
    ADD COLUMN `reliability` INTEGER NOT NULL,
    ADD COLUMN `responsiveness` INTEGER NOT NULL;

-- DropTable
DROP TABLE `overallservicefeedback`;
