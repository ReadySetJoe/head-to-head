-- AlterTable
ALTER TABLE "Tournament" ADD COLUMN     "entrantId" INTEGER;

-- AddForeignKey
ALTER TABLE "Tournament" ADD CONSTRAINT "Tournament_entrantId_fkey" FOREIGN KEY ("entrantId") REFERENCES "Entrant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
