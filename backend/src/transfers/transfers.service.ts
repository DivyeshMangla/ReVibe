import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class TransfersService {
  private prisma = new PrismaClient();

  async create(data: any) {
    return this.prisma.transfer.create({
      data: {
        ...data,
        effectiveDate: new Date(data.effectiveDate),
      },
      include: { employee: true },
    });
  }

  async findAll() {
    return this.prisma.transfer.findMany({
      include: { employee: { select: { id: true, empCode: true, name: true, department: true } } },
      orderBy: { requestedAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const transfer = await this.prisma.transfer.findUnique({
      where: { id },
      include: { employee: true },
    });
    if (!transfer) throw new NotFoundException('Transfer not found');
    return transfer;
  }

  async approve(id: string, approverId: string) {
    await this.findOne(id);
    return this.prisma.transfer.update({
      where: { id },
      data: { status: 'APPROVED', approvedBy: approverId, approvedAt: new Date() },
    });
  }

  async reject(id: string) {
    await this.findOne(id);
    return this.prisma.transfer.update({
      where: { id },
      data: { status: 'REJECTED' },
    });
  }
}
