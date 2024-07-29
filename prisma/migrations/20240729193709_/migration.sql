-- AlterTable
ALTER TABLE "Entrant" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Entrant_id_seq";

-- AlterTable
ALTER TABLE "Set" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Set_id_seq";
