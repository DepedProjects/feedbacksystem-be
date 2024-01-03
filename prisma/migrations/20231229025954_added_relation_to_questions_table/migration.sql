/*
  Warnings:

  - Added the required column `service_id` to the `Questions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `questions` ADD COLUMN `service_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Questions` ADD CONSTRAINT `Questions_service_id_fkey` FOREIGN KEY (`service_id`) REFERENCES `Services`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
