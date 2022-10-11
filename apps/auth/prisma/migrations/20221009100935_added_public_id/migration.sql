/*
  Warnings:

  - A unique constraint covering the columns `[publicId]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `publicId` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "publicId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_publicId_key" ON "user"("publicId");
