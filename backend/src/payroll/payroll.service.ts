import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreatePayrollRunDto } from './dto/create-payroll-run.dto';
import { CalculateSalaryDto } from './dto/calculate-salary.dto';
import { PayrollMath } from '../utils/payroll-math.util';

@Injectable()
export class PayrollService {
  private prisma = new PrismaClient();

  async createPayrollRun(createPayrollRunDto: CreatePayrollRunDto, createdBy: string) {
    const { month, year } = createPayrollRunDto;

    const existing = await this.prisma.payrollRun.findUnique({
      where: { month_year: { month, year } }
    });

    if (existing) {
      throw new BadRequestException('Payroll run already exists for this month/year');
    }

    const employees = await this.prisma.employee.findMany({
      where: { status: 'ACTIVE' }
    });

    const payrollRun = await this.prisma.payrollRun.create({
      data: {
        month,
        year,
        status: 'DRAFT',
        createdBy
      }
    });

    const salarySlips = await Promise.all(
      employees.map(async (employee) => {
        const basicSalary = 50000;
        const components = PayrollMath.calculateSalaryComponents(basicSalary);

        return this.prisma.salarySlip.create({
          data: {
            employeeId: employee.id,
            payrollRunId: payrollRun.id,
            ...components
          }
        });
      })
    );

    return {
      ...payrollRun,
      salarySlipsCount: salarySlips.length
    };
  }

  async findAllRuns() {
    return this.prisma.payrollRun.findMany({
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
      include: {
        _count: {
          select: { salarySlips: true }
        }
      }
    });
  }

  async findOneRun(id: string) {
    const run = await this.prisma.payrollRun.findUnique({
      where: { id },
      include: {
        salarySlips: {
          include: {
            employee: true
          }
        }
      }
    });

    if (!run) {
      throw new NotFoundException('Payroll run not found');
    }

    return run;
  }

  async approveRun(id: string, approvedBy: string) {
    const run = await this.findOneRun(id);

    if (run.status !== 'DRAFT') {
      throw new BadRequestException('Only DRAFT payroll runs can be approved');
    }

    return this.prisma.payrollRun.update({
      where: { id },
      data: {
        status: 'APPROVED',
        approvedBy
      }
    });
  }

  async finalizeRun(id: string, finalizedBy: string) {
    const run = await this.findOneRun(id);

    if (run.status !== 'APPROVED') {
      throw new BadRequestException('Only APPROVED payroll runs can be finalized');
    }

    return this.prisma.payrollRun.update({
      where: { id },
      data: {
        status: 'FINALIZED',
        finalizedBy
      }
    });
  }

  async findSalarySlip(id: string) {
    const slip = await this.prisma.salarySlip.findUnique({
      where: { id },
      include: {
        employee: true,
        payrollRun: true,
        corrections: true
      }
    });

    if (!slip) {
      throw new NotFoundException('Salary slip not found');
    }

    return slip;
  }

  async generatePdf(id: string) {
    const slip = await this.findSalarySlip(id);

    return {
      message: 'PDF generation stub',
      slipId: id,
      employee: slip.employee.name,
      month: slip.payrollRun.month,
      year: slip.payrollRun.year,
      netPay: slip.netPay,
      pdfUrl: `http://localhost:3000/api/payroll/slips/${id}/pdf/download`
    };
  }

  async calculateSalary(calculateSalaryDto: CalculateSalaryDto) {
    const { basicSalary, otherEarnings = 0, otherDeductions = 0 } = calculateSalaryDto;

    return PayrollMath.calculateSalaryComponents(basicSalary, otherEarnings, otherDeductions);
  }
}
