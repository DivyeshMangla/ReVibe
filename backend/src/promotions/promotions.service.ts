import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreatePromotionDto } from './dto/create-promotion.dto';

@Injectable()
export class PromotionsService {
  private prisma = new PrismaClient();

  async create(createPromotionDto: CreatePromotionDto, requestedBy: string) {
    const employee = await this.prisma.employee.findUnique({
      where: { id: createPromotionDto.employeeId }
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    const salaryIncrease = createPromotionDto.proposedSalary - createPromotionDto.currentSalary;

    return this.prisma.promotion.create({
      data: {
        ...createPromotionDto,
        salaryIncrease,
        effectiveDate: new Date(createPromotionDto.effectiveDate),
        requestedBy,
        status: 'PENDING'
      },
      include: {
        employee: true
      }
    });
  }

  async findAll() {
    return this.prisma.promotion.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        employee: true
      }
    });
  }

  async findOne(id: string) {
    const promotion = await this.prisma.promotion.findUnique({
      where: { id },
      include: {
        employee: true
      }
    });

    if (!promotion) {
      throw new NotFoundException('Promotion not found');
    }

    return promotion;
  }

  async approve(id: string, approvedBy: string) {
    const promotion = await this.findOne(id);

    if (promotion.status !== 'PENDING') {
      throw new BadRequestException('Only pending promotions can be approved');
    }

    await this.prisma.jobProfile.create({
      data: {
        employeeId: promotion.employeeId,
        role: promotion.proposedRole,
        department: promotion.employee.department,
        responsibilities: `Promoted to ${promotion.proposedRole}`,
        effectiveDate: promotion.effectiveDate
      }
    });

    return this.prisma.promotion.update({
      where: { id },
      data: {
        status: 'APPROVED',
        approvedBy
      }
    });
  }

  async reject(id: string, rejectedBy: string) {
    const promotion = await this.findOne(id);

    if (promotion.status !== 'PENDING') {
      throw new BadRequestException('Only pending promotions can be rejected');
    }

    return this.prisma.promotion.update({
      where: { id },
      data: {
        status: 'REJECTED',
        rejectedBy
      }
    });
  }

  async markEffective(id: string) {
    const promotion = await this.findOne(id);

    if (promotion.status !== 'APPROVED') {
      throw new BadRequestException('Only approved promotions can be marked as effective');
    }

    if (promotion.effectiveDate > new Date()) {
      throw new BadRequestException('Cannot mark promotion as effective before effective date');
    }

    return this.prisma.promotion.update({
      where: { id },
      data: {
        status: 'EFFECTIVE'
      }
    });
  }
}
