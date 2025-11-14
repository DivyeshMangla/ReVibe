import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class JoiningRelievingService {
  private prisma = new PrismaClient();

  async create(data: any) {
    return this.prisma.joiningRelieving.create({
      data: {
        ...data,
        effectiveDate: new Date(data.effectiveDate),
      },
      include: { employee: true },
    });
  }

  async findAll() {
    return this.prisma.joiningRelieving.findMany({
      include: { employee: { select: { id: true, empCode: true, name: true, department: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const record = await this.prisma.joiningRelieving.findUnique({
      where: { id },
      include: { employee: true },
    });
    if (!record) throw new NotFoundException('Record not found');
    return record;
  }

  async approve(id: string, approverId: string) {
    await this.findOne(id);
    return this.prisma.joiningRelieving.update({
      where: { id },
      data: { status: 'APPROVED', approvedBy: approverId, approvedAt: new Date() },
    });
  }

  async complete(id: string) {
    await this.findOne(id);
    return this.prisma.joiningRelieving.update({
      where: { id },
      data: { status: 'COMPLETED', clearanceStatus: 'COMPLETED' },
    });
  }
}
