/*
  Warnings:

  - You are about to drop the column `ggId` on the `Entrant` table. All the data in the column will be lost.
  - You are about to drop the column `ggId` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `ggId` on the `Set` table. All the data in the column will be lost.
  - You are about to drop the column `ggId` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `ggId` on the `Videogame` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Entrant_ggId_key";

-- DropIndex
DROP INDEX "Event_ggId_key";

-- DropIndex
DROP INDEX "Set_ggId_key";

-- DropIndex
DROP INDEX "Videogame_ggId_key";

-- AlterTable
ALTER TABLE "Entrant" DROP COLUMN "ggId";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "ggId",
ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Event_id_seq";

-- AlterTable
ALTER TABLE "Set" DROP COLUMN "ggId";

-- AlterTable
ALTER TABLE "Tournament" DROP COLUMN "ggId",
ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Tournament_id_seq";

-- AlterTable
ALTER TABLE "Videogame" DROP COLUMN "ggId",
ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Videogame_id_seq";
