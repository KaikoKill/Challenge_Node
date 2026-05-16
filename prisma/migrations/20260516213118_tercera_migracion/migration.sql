/*
  Warnings:

  - You are about to drop the column `nombre_titular` on the `tarjetas` table. All the data in the column will be lost.
  - Added the required column `nombre_targeta` to the `tarjetas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tarjetas" DROP COLUMN "nombre_titular",
ADD COLUMN     "nombre_targeta" VARCHAR(100) NOT NULL;
