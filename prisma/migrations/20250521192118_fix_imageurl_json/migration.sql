/*
  Warnings:

  - You are about to alter the column `imageUrl` on the `plant` table. The data in that column could be lost. The data in that column will be cast from `LongText` to `Json`.

*/
-- AlterTable
ALTER TABLE `plant` MODIFY `imageUrl` JSON NULL;
