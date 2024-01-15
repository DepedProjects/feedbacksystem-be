-- CreateTable
CREATE TABLE `overallServiceFeedback` (
    `uuid` INTEGER NOT NULL AUTO_INCREMENT,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `office` VARCHAR(191) NOT NULL,
    `responsiveness` INTEGER NOT NULL,
    `reliability` INTEGER NOT NULL,
    `accessAndFacilities` INTEGER NOT NULL,
    `communication` INTEGER NOT NULL,
    `integrity` INTEGER NOT NULL,
    `assurance` INTEGER NOT NULL,
    `outcome` INTEGER NOT NULL,
    `average` INTEGER NOT NULL,
    `servicesRecieved` VARCHAR(191) NOT NULL,
    `comments` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `overallServiceFeedback_uuid_key`(`uuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
