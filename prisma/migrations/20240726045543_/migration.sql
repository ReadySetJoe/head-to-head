/*
  Warnings:

  - You are about to drop the `EventEntrant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SetEntrant` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `loserId` to the `Set` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "EventEntrant" DROP CONSTRAINT "EventEntrant_entrantId_fkey";

-- DropForeignKey
ALTER TABLE "EventEntrant" DROP CONSTRAINT "EventEntrant_eventId_fkey";

-- DropForeignKey
ALTER TABLE "SetEntrant" DROP CONSTRAINT "SetEntrant_entrantId_fkey";

-- DropForeignKey
ALTER TABLE "SetEntrant" DROP CONSTRAINT "SetEntrant_setId_fkey";

-- AlterTable
ALTER TABLE "Set" ADD COLUMN     "loserId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "EventEntrant";

-- DropTable
DROP TABLE "SetEntrant";
