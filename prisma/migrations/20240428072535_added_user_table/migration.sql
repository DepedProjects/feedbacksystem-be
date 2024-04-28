-- CreateTable
CREATE TABLE `users` (
    `uid` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `officeName` VARCHAR(191) NULL,
    `officeId` INTEGER NULL,

    UNIQUE INDEX `users_username_key`(`username`),
    PRIMARY KEY (`uid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_officeId_fkey` FOREIGN KEY (`officeId`) REFERENCES `Offices`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
