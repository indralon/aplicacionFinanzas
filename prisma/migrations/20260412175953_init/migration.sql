-- CreateEnum
CREATE TYPE "ExpenseType" AS ENUM ('FIXED', 'VARIABLE');

-- CreateEnum
CREATE TYPE "IncomeType" AS ENUM ('NET', 'GROSS');

-- CreateEnum
CREATE TYPE "IncomeCategory" AS ENUM ('SALARY', 'INTEREST', 'DIVIDEND', 'RENTAL', 'OTHER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExpenseRow" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "expenseType" "ExpenseType" NOT NULL,
    "description" TEXT NOT NULL,
    "jan" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "feb" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "mar" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "apr" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "may" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "jun" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "jul" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "aug" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "sep" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "oct" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "nov" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "dec" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "order" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExpenseRow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncomeRow" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "incomeType" "IncomeType" NOT NULL,
    "incomeCategory" "IncomeCategory" NOT NULL,
    "description" TEXT NOT NULL,
    "jan" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "feb" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "mar" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "apr" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "may" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "jun" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "jul" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "aug" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "sep" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "oct" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "nov" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "dec" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "order" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IncomeRow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL,
    "irpfRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "ExpenseRow_userId_year_idx" ON "ExpenseRow"("userId", "year");

-- CreateIndex
CREATE INDEX "IncomeRow_userId_year_idx" ON "IncomeRow"("userId", "year");

-- CreateIndex
CREATE UNIQUE INDEX "Settings_userId_key" ON "Settings"("userId");

-- AddForeignKey
ALTER TABLE "ExpenseRow" ADD CONSTRAINT "ExpenseRow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncomeRow" ADD CONSTRAINT "IncomeRow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Settings" ADD CONSTRAINT "Settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
