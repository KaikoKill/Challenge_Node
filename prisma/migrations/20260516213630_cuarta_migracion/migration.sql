/*
  Warnings:

  - Added the required column `numero` to the `tarjetas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tarjetas" ADD COLUMN     "numero" VARCHAR(100) NOT NULL;
