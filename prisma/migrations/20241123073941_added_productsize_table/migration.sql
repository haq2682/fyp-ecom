/*
  Warnings:

  - You are about to drop the column `productId` on the `Size` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Size` DROP FOREIGN KEY `Size_productId_fkey`;

-- AlterTable
ALTER TABLE `Size` DROP COLUMN `productId`;

-- CreateTable
CREATE TABLE `ProductSize` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productId` INTEGER NOT NULL,
    `sizeId` INTEGER NOT NULL,

    UNIQUE INDEX `ProductSize_productId_sizeId_key`(`productId`, `sizeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProductSize` ADD CONSTRAINT `ProductSize_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductSize` ADD CONSTRAINT `ProductSize_sizeId_fkey` FOREIGN KEY (`sizeId`) REFERENCES `Size`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
