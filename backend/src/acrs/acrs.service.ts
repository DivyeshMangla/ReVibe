import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AcrsService {
  private prisma = new PrismaClient();

  async create(data: any) {
    return this.prisma.aCR.create({
      data,
      include: { employee: true },
    });
  }

  async findAll() {
    return this.prisma.aCR.findMany({
      include: { employee: { select: { id: true, empCode: true, name: true, department: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const acr = await this.prisma.aCR.findUnique({
      where: { id },
      include: { employee: true },
    });
    if (!acr) throw new NotFoundException('ACR not found');
    return acr;
  }

  async submit(id: string) {
    await this.findOne(id);
    return this.prisma.aCR.update({
      where: { id },
      data: { status: 'SUBMITTED', submittedAt: new Date() },
    });
  }

  async approve(id: string) {
    await this.findOne(id);
    return this.prisma.aCR.update({
      where: { id },
      data: { status: 'APPROVED', approvedAt: new Date() },
    });
  }
}
