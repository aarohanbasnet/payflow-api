/*
  Warnings:

  - You are about to drop the column `createdAr` on the `OTP` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OTP" DROP COLUMN "createdAr",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
