/*
  Warnings:

  - You are about to drop the `FavoritePlant` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `FavoritePlant` DROP FOREIGN KEY `FavoritePlant_plantId_fkey`;

-- DropForeignKey
ALTER TABLE `FavoritePlant` DROP FOREIGN KEY `FavoritePlant_userId_fkey`;

-- DropTable
DROP TABLE `FavoritePlant`;

-- CreateTable
CREATE TABLE `Favorite` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,
    `favoritedId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Favorite_userId_favoritedId_key`(`userId`, `favoritedId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Favorite` ADD CONSTRAINT `Favorite_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Favorite` ADD CONSTRAINT `Favorite_favoritedId_fkey` FOREIGN KEY (`favoritedId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
