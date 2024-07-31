/*
  Warnings:

  - Made the column `startAt` on table `Tournament` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Tournament" ALTER COLUMN "startAt" SET NOT NULL;
