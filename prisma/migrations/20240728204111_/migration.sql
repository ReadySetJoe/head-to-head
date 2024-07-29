/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Entrant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Entrant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Entrant" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Entrant_slug_key" ON "Entrant"("slug");
