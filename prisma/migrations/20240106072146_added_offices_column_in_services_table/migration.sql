/*
  Warnings:

  - Added the required column `officeId` to the `Services` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `services` ADD COLUMN `officeId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Services` ADD CONSTRAINT `Services_officeId_fkey` FOREIGN KEY (`officeId`) REFERENCES `Offices`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
