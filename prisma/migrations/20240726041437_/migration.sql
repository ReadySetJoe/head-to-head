/*
  Warnings:

  - You are about to drop the column `completedAt` on the `Set` table. All the data in the column will be lost.
  - You are about to drop the column `displayScore` on the `Set` table. All the data in the column will be lost.
  - You are about to drop the column `round` on the `Set` table. All the data in the column will be lost.
  - You are about to drop the column `roundText` on the `Set` table. All the data in the column will be lost.
  - You are about to drop the column `winnerGGId` on the `Set` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the `Entrant` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Tournament` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Entrant" DROP CONSTRAINT "Entrant_setId_fkey";

-- DropForeignKey
ALTER TABLE "Set" DROP CONSTRAINT "Set_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Tournament" DROP CONSTRAINT "Tournament_userId_fkey";

-- AlterTable
ALTER TABLE "Set" DROP COLUMN "completedAt",
DROP COLUMN "displayScore",
DROP COLUMN "round",
DROP COLUMN "roundText",
DROP COLUMN "winnerGGId",
ALTER COLUMN "eventId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Tournament" DROP COLUMN "userId";

-- DropTable
DROP TABLE "Entrant";

-- CreateIndex
CREATE UNIQUE INDEX "Tournament_slug_key" ON "Tournament"("slug");

-- AddForeignKey
ALTER TABLE "Set" ADD CONSTRAINT "Set_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;
