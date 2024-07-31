/*
  Warnings:

  - You are about to drop the column `loserId` on the `Set` table. All the data in the column will be lost.
  - You are about to drop the column `winnerId` on the `Set` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Set" DROP COLUMN "loserId",
DROP COLUMN "winnerId";

-- CreateTable
CREATE TABLE "SetEntrantWinner" (
    "setId" INTEGER NOT NULL,
    "entrantId" INTEGER NOT NULL,

    CONSTRAINT "SetEntrantWinner_pkey" PRIMARY KEY ("setId")
);

-- CreateTable
CREATE TABLE "SetEntrantLoser" (
    "setId" INTEGER NOT NULL,
    "entrantId" INTEGER NOT NULL,

    CONSTRAINT "SetEntrantLoser_pkey" PRIMARY KEY ("setId")
);

-- AddForeignKey
ALTER TABLE "SetEntrantWinner" ADD CONSTRAINT "SetEntrantWinner_setId_fkey" FOREIGN KEY ("setId") REFERENCES "Set"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SetEntrantWinner" ADD CONSTRAINT "SetEntrantWinner_entrantId_fkey" FOREIGN KEY ("entrantId") REFERENCES "Entrant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SetEntrantLoser" ADD CONSTRAINT "SetEntrantLoser_setId_fkey" FOREIGN KEY ("setId") REFERENCES "Set"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SetEntrantLoser" ADD CONSTRAINT "SetEntrantLoser_entrantId_fkey" FOREIGN KEY ("entrantId") REFERENCES "Entrant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
