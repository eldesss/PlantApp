/*
  Warnings:

  - You are about to drop the column `emailVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `verificationToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Garden` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Garden` DROP FOREIGN KEY `Garden_userId_fkey`;

-- DropIndex
DROP INDEX `User_verificationToken_key` ON `User`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `emailVerified`,
    DROP COLUMN `verificationToken`;

-- DropTable
DROP TABLE `Garden`;
