/*
  Warnings:

  - Added the required column `videogameId` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ggId` to the `Tournament` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "videogameId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Tournament" ADD COLUMN     "ggId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Videogame" (
    "id" SERIAL NOT NULL,
    "ggId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Videogame_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entrant" (
    "id" SERIAL NOT NULL,
    "ggId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Entrant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventEntrant" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "entrantId" INTEGER NOT NULL,

    CONSTRAINT "EventEntrant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SetEntrant" (
    "id" SERIAL NOT NULL,
    "setId" INTEGER NOT NULL,
    "entrantId" INTEGER NOT NULL,

    CONSTRAINT "SetEntrant_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_videogameId_fkey" FOREIGN KEY ("videogameId") REFERENCES "Videogame"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventEntrant" ADD CONSTRAINT "EventEntrant_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventEntrant" ADD CONSTRAINT "EventEntrant_entrantId_fkey" FOREIGN KEY ("entrantId") REFERENCES "Entrant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SetEntrant" ADD CONSTRAINT "SetEntrant_setId_fkey" FOREIGN KEY ("setId") REFERENCES "Set"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SetEntrant" ADD CONSTRAINT "SetEntrant_entrantId_fkey" FOREIGN KEY ("entrantId") REFERENCES "Entrant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
