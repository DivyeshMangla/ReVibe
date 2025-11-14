import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class EServiceBookService {
  private prisma = new PrismaClient();

  async create(data: any) {
    return this.prisma.eServiceBook.create({
      data: {
        ...data,
        entryDate: new Date(data.entryDate),
      },
      include: { employee: true },
    });
  }

  async findAll() {
    return this.prisma.eServiceBook.findMany({
      include: { employee: { select: { id: true, empCode: true, name: true, department: true } } },
      orderBy: { entryDate: 'desc' },
    });
  }

  async findByEmployee(employeeId: string) {
    return this.prisma.eServiceBook.findMany({
      where: { employeeId },
      orderBy: { entryDate: 'desc' },
    });
  }

  async findOne(id: string) {
    const record = await this.prisma.eServiceBook.findUnique({
      where: { id },
      include: { employee: true },
    });
    if (!record) throw new NotFoundException('eService Book entry not found');
    return record;
  }

  async verify(id: string, verifierId: string) {
    await this.findOne(id);
    return this.prisma.eServiceBook.update({
      where: { id },
      data: { verifiedBy: verifierId, verifiedAt: new Date() },
    });
  }
}
