import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PropertyReturnsService {
  private prisma = new PrismaClient();

  async create(data: any) {
    return this.prisma.propertyReturn.create({
      data: {
        ...data,
        issuedDate: new Date(data.issuedDate),
        returnDate: data.returnDate ? new Date(data.returnDate) : null,
      },
      include: { employee: true },
    });
  }

  async findAll() {
    return this.prisma.propertyReturn.findMany({
      include: { employee: { select: { id: true, empCode: true, name: true, department: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const record = await this.prisma.propertyReturn.findUnique({
      where: { id },
      include: { employee: true },
    });
    if (!record) throw new NotFoundException('Property return record not found');
    return record;
  }

  async markReturned(id: string, condition: string) {
    await this.findOne(id);
    return this.prisma.propertyReturn.update({
      where: { id },
      data: { status: 'RETURNED', returnDate: new Date(), condition, submittedAt: new Date() },
    });
  }

  async verify(id: string, verifierId: string) {
    await this.findOne(id);
    return this.prisma.propertyReturn.update({
      where: { id },
      data: { verifiedBy: verifierId, verifiedAt: new Date() },
    });
  }
}
