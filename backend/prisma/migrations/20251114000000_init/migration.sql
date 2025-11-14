-- CreateEnum
CREATE TYPE "EmployeeStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'TERMINATED');

-- CreateEnum
CREATE TYPE "PayrollStatus" AS ENUM ('DRAFT', 'APPROVED', 'FINALIZED');

-- CreateEnum
CREATE TYPE "CorrectionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "PromotionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'EFFECTIVE');

-- CreateTable
CREATE TABLE "employees" (
    "id" TEXT NOT NULL,
    "empCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "hireDate" TIMESTAMP(3) NOT NULL,
    "status" "EmployeeStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_profiles" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "responsibilities" TEXT NOT NULL,
    "effectiveDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payroll_runs" (
    "id" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "status" "PayrollStatus" NOT NULL DEFAULT 'DRAFT',
    "createdBy" TEXT NOT NULL,
    "approvedBy" TEXT,
    "finalizedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payroll_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "salary_slips" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "payrollRunId" TEXT NOT NULL,
    "basicSalary" INTEGER NOT NULL,
    "hra" INTEGER NOT NULL,
    "da" INTEGER NOT NULL,
    "otherEarnings" INTEGER NOT NULL DEFAULT 0,
    "pf" INTEGER NOT NULL,
    "esi" INTEGER NOT NULL,
    "tds" INTEGER NOT NULL,
    "otherDeductions" INTEGER NOT NULL DEFAULT 0,
    "grossSalary" INTEGER NOT NULL,
    "netPay" INTEGER NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "salary_slips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "corrections" (
    "id" TEXT NOT NULL,
    "salarySlipId" TEXT NOT NULL,
    "requestedBy" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "changes" JSONB NOT NULL,
    "status" "CorrectionStatus" NOT NULL DEFAULT 'PENDING',
    "approvedBy" TEXT,
    "rejectedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "corrections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promotions" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "currentRole" TEXT NOT NULL,
    "proposedRole" TEXT NOT NULL,
    "currentSalary" INTEGER NOT NULL,
    "proposedSalary" INTEGER NOT NULL,
    "salaryIncrease" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "PromotionStatus" NOT NULL DEFAULT 'PENDING',
    "effectiveDate" TIMESTAMP(3) NOT NULL,
    "requestedBy" TEXT NOT NULL,
    "approvedBy" TEXT,
    "rejectedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "promotions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_messages" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "employees_empCode_key" ON "employees"("empCode");

-- CreateIndex
CREATE UNIQUE INDEX "employees_email_key" ON "employees"("email");

-- CreateIndex
CREATE INDEX "employees_status_idx" ON "employees"("status");

-- CreateIndex
CREATE INDEX "job_profiles_employeeId_idx" ON "job_profiles"("employeeId");

-- CreateIndex
CREATE INDEX "job_profiles_effectiveDate_idx" ON "job_profiles"("effectiveDate");

-- CreateIndex
CREATE INDEX "payroll_runs_month_year_idx" ON "payroll_runs"("month", "year");

-- CreateIndex
CREATE INDEX "payroll_runs_status_idx" ON "payroll_runs"("status");

-- CreateIndex
CREATE UNIQUE INDEX "payroll_runs_month_year_key" ON "payroll_runs"("month", "year");

-- CreateIndex
CREATE INDEX "salary_slips_employeeId_idx" ON "salary_slips"("employeeId");

-- CreateIndex
CREATE INDEX "salary_slips_payrollRunId_idx" ON "salary_slips"("payrollRunId");

-- CreateIndex
CREATE INDEX "corrections_salarySlipId_status_idx" ON "corrections"("salarySlipId", "status");

-- CreateIndex
CREATE INDEX "promotions_employeeId_idx" ON "promotions"("employeeId");

-- CreateIndex
CREATE INDEX "promotions_status_idx" ON "promotions"("status");

-- CreateIndex
CREATE INDEX "chat_messages_userId_idx" ON "chat_messages"("userId");

-- AddForeignKey
ALTER TABLE "job_profiles" ADD CONSTRAINT "job_profiles_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salary_slips" ADD CONSTRAINT "salary_slips_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salary_slips" ADD CONSTRAINT "salary_slips_payrollRunId_fkey" FOREIGN KEY ("payrollRunId") REFERENCES "payroll_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "corrections" ADD CONSTRAINT "corrections_salarySlipId_fkey" FOREIGN KEY ("salarySlipId") REFERENCES "salary_slips"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotions" ADD CONSTRAINT "promotions_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
