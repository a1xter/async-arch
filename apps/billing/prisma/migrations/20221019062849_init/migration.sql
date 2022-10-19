-- CreateEnum
CREATE TYPE "Type" AS ENUM ('credit', 'debit');

-- CreateTable
CREATE TABLE "transactions" (
    "id" SERIAL NOT NULL,
    "publicId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "type" "Type" NOT NULL,
    "userPublicId" TEXT NOT NULL,
    "taskPublicId" TEXT NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "transactions_publicId_key" ON "transactions"("publicId");
