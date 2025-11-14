import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateCorrectionDto } from './dto/create-correction.dto';
import { PayrollMath } from '../utils/payroll-math.util';

@Injectable()
export class SalaryCorrectionsService {
  private prisma = new PrismaClient();

  async create(createCorrectionDto: CreateCorrectionDto, requestedBy: string) {
    const { salarySlipId, reason, changes } = createCorrectionDto;

    const salarySlip = await this.prisma.salarySlip.findUnique({
      where: { id: salarySlipId },
      include: { payrollRun: true }
    });

    if (!salarySlip) {
      throw new NotFoundException('Salary slip not found');
    }

    if (salarySlip.payrollRun.status === 'FINALIZED') {
      throw new BadRequestException('Cannot create correction for finalized payroll');
    }

    return this.prisma.correction.create({
      data: {
        salarySlipId,
        requestedBy,
        reason,
        changes,
        status: 'PENDING'
      },
      include: {
        salarySlip: {
          include: {
            employee: true,
            payrollRun: true
          }
        }
      }
    });
  }

  async findAll() {
    return this.prisma.correction.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        salarySlip: {
          include: {
            employee: true,
            payrollRun: true
          }
        }
      }
    });
  }

  async findOne(id: string) {
    const correction = await this.prisma.correction.findUnique({
      where: { id },
      include: {
        salarySlip: {
          include: {
            employee: true,
            payrollRun: true
          }
        }
      }
    });

    if (!correction) {
      throw new NotFoundException('Correction not found');
    }

    return correction;
  }

  async approve(id: string, approvedBy: string) {
    const correction = await this.findOne(id);

    if (correction.status !== 'PENDING') {
      throw new BadRequestException('Only pending corrections can be approved');
    }

    const changes = correction.changes as any;
    const currentSlip = correction.salarySlip;

    const updatedData = {
      ...currentSlip,
      ...changes,
      version: currentSlip.version + 1
    };

    if (changes.basicSalary !== undefined) {
      const recalculated = PayrollMath.calculateSalaryComponents(
        changes.basicSalary,
        updatedData.otherEarnings,
        updatedData.otherDeductions
      );
      Object.assign(updatedData, recalculated);
    }

    await this.prisma.salarySlip.update({
      where: { id: correction.salarySlipId },
      data: {
        basicSalary: updatedData.basicSalary,
        hra: updatedData.hra,
        da: updatedData.da,
        otherEarnings: updatedData.otherEarnings,
        pf: updatedData.pf,
        esi: updatedData.esi,
        tds: updatedData.tds,
        otherDeductions: updatedData.otherDeductions,
        grossSalary: updatedData.grossSalary,
        netPay: updatedData.netPay,
        version: updatedData.version
      }
    });

    return this.prisma.correction.update({
      where: { id },
      data: {
        status: 'APPROVED',
        approvedBy
      }
    });
  }

  async reject(id: string, rejectedBy: string) {
    const correction = await this.findOne(id);

    if (correction.status !== 'PENDING') {
      throw new BadRequestException('Only pending corrections can be rejected');
    }

    return this.prisma.correction.update({
      where: { id },
      data: {
        status: 'REJECTED',
        rejectedBy
      }
    });
  }
}
