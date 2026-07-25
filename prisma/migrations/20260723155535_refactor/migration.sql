/*
  Warnings:

  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[payId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `payId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "username",
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "payId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_payId_key" ON "User"("payId");
