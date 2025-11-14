-- CreateEnum
CREATE TYPE "JRType" AS ENUM ('JOINING', 'RELIEVING');

-- CreateEnum
CREATE TYPE "JRStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "ClearanceStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "PropertyStatus" AS ENUM ('ISSUED', 'RETURNED', 'DAMAGED', 'LOST');

-- CreateTable
CREATE TABLE "joining_relieving" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "type" "JRType" NOT NULL,
    "requestDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "effectiveDate" TIMESTAMP(3) NOT NULL,
    "reason" TEXT,
    "exitInterview" TEXT,
    "clearanceStatus" "ClearanceStatus" NOT NULL DEFAULT 'PENDING',
    "fnfSettlement" DOUBLE PRECISION,
    "status" "JRStatus" NOT NULL DEFAULT 'PENDING',
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "joining_relieving_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eservice_books" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "entryType" TEXT NOT NULL,
    "entryDate" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "documentUrl" TEXT,
    "verifiedBy" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "eservice_books_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_returns" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "itemCategory" TEXT NOT NULL,
    "serialNumber" TEXT,
    "issuedDate" TIMESTAMP(3) NOT NULL,
    "returnDate" TIMESTAMP(3),
    "condition" TEXT,
    "status" "PropertyStatus" NOT NULL DEFAULT 'ISSUED',
    "remarks" TEXT,
    "submittedAt" TIMESTAMP(3),
    "verifiedBy" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "property_returns_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "joining_relieving_employeeId_type_idx" ON "joining_relieving"("employeeId", "type");

-- CreateIndex
CREATE INDEX "eservice_books_employeeId_entryDate_idx" ON "eservice_books"("employeeId", "entryDate");

-- CreateIndex
CREATE INDEX "property_returns_employeeId_status_idx" ON "property_returns"("employeeId", "status");

-- AddForeignKey
ALTER TABLE "joining_relieving" ADD CONSTRAINT "joining_relieving_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eservice_books" ADD CONSTRAINT "eservice_books_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_returns" ADD CONSTRAINT "property_returns_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
