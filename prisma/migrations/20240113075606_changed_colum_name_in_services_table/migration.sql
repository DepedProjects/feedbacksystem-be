/*
  Warnings:

  - You are about to drop the column `officeId` on the `services` table. All the data in the column will be lost.
  - Added the required column `relatedOfficeId` to the `Services` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `services` DROP FOREIGN KEY `Services_officeId_fkey`;

-- AlterTable
ALTER TABLE `services` DROP COLUMN `officeId`,
    ADD COLUMN `relatedOfficeId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Services` ADD CONSTRAINT `Services_relatedOfficeId_fkey` FOREIGN KEY (`relatedOfficeId`) REFERENCES `Offices`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
