/*
  Warnings:

  - A unique constraint covering the columns `[ggId]` on the table `Entrant` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ggId]` on the table `Event` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ggId]` on the table `Set` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ggId]` on the table `Videogame` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Entrant_ggId_key" ON "Entrant"("ggId");

-- CreateIndex
CREATE UNIQUE INDEX "Event_ggId_key" ON "Event"("ggId");

-- CreateIndex
CREATE UNIQUE INDEX "Set_ggId_key" ON "Set"("ggId");

-- CreateIndex
CREATE UNIQUE INDEX "Videogame_ggId_key" ON "Videogame"("ggId");
