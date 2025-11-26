/*
  Warnings:

  - You are about to drop the column `commnt` on the `Feedback` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Feedback" DROP COLUMN "commnt",
ADD COLUMN     "comment" TEXT;
