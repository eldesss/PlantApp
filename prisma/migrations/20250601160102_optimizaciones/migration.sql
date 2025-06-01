/*
  Warnings:

  - You are about to drop the `_UserFavorites` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_UserFavorites` DROP FOREIGN KEY `_UserFavorites_A_fkey`;

-- DropForeignKey
ALTER TABLE `_UserFavorites` DROP FOREIGN KEY `_UserFavorites_B_fkey`;

-- AlterTable
ALTER TABLE `Plant` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- DropTable
DROP TABLE `_UserFavorites`;

-- CreateTable
CREATE TABLE `FavoritePlant` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,
    `plantId` INTEGER NOT NULL,

    UNIQUE INDEX `FavoritePlant_userId_plantId_key`(`userId`, `plantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FavoritePlant` ADD CONSTRAINT `FavoritePlant_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FavoritePlant` ADD CONSTRAINT `FavoritePlant_plantId_fkey` FOREIGN KEY (`plantId`) REFERENCES `Plant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `Plant` RENAME INDEX `Plant_userId_fkey` TO `Plant_userId_idx`;
