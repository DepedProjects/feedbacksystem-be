-- DropForeignKey
ALTER TABLE `services` DROP FOREIGN KEY `Services_relatedOfficeId_fkey`;

-- DropForeignKey
ALTER TABLE `services` DROP FOREIGN KEY `Services_serviceKindId_fkey`;

-- AlterTable
ALTER TABLE `services` MODIFY `serviceKindId` INTEGER NULL,
    MODIFY `relatedOfficeId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Services` ADD CONSTRAINT `Services_relatedOfficeId_fkey` FOREIGN KEY (`relatedOfficeId`) REFERENCES `Offices`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Services` ADD CONSTRAINT `Services_serviceKindId_fkey` FOREIGN KEY (`serviceKindId`) REFERENCES `ServiceKind`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
