/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `refreshToken` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "refreshToken_token_key";

-- CreateIndex
CREATE UNIQUE INDEX "refreshToken_userId_key" ON "refreshToken"("userId");
