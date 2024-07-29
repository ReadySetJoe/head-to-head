/*
  Warnings:

  - You are about to drop the column `entrantId` on the `Tournament` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Tournament" DROP CONSTRAINT "Tournament_entrantId_fkey";

-- DropIndex
DROP INDEX "Entrant_slug_key";

-- DropIndex
DROP INDEX "Tournament_slug_key";

-- AlterTable
ALTER TABLE "Tournament" DROP COLUMN "entrantId";
