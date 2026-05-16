/*
  Warnings:

  - You are about to drop the column `tarjeta_id` on the `pagos` table. All the data in the column will be lost.
  - You are about to drop the column `usuario_id` on the `pagos` table. All the data in the column will be lost.
  - You are about to drop the column `numero_last4` on the `tarjetas` table. All the data in the column will be lost.
  - You are about to drop the column `usuario_id` on the `tarjetas` table. All the data in the column will be lost.
  - Added the required column `usuario_fk` to the `pagos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuario_fk` to the `tarjetas` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "pagos" DROP CONSTRAINT "pagos_tarjeta_id_fkey";

-- DropForeignKey
ALTER TABLE "pagos" DROP CONSTRAINT "pagos_usuario_id_fkey";

-- DropForeignKey
ALTER TABLE "tarjetas" DROP CONSTRAINT "tarjetas_usuario_id_fkey";

-- AlterTable
ALTER TABLE "pagos" DROP COLUMN "tarjeta_id",
DROP COLUMN "usuario_id",
ADD COLUMN     "tarjeta_fk" INTEGER,
ADD COLUMN     "usuario_fk" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "tarjetas" DROP COLUMN "numero_last4",
DROP COLUMN "usuario_id",
ADD COLUMN     "usuario_fk" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "tarjetas" ADD CONSTRAINT "tarjetas_usuario_fk_fkey" FOREIGN KEY ("usuario_fk") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_usuario_fk_fkey" FOREIGN KEY ("usuario_fk") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_tarjeta_fk_fkey" FOREIGN KEY ("tarjeta_fk") REFERENCES "tarjetas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
