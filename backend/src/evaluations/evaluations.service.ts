import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class EvaluationsService {
  private prisma = new PrismaClient();

  async create(data: any) {
    return this.prisma.evaluation.create({
      data,
      include: { employee: true },
    });
  }

  async findAll() {
    return this.prisma.evaluation.findMany({
      include: { employee: { select: { id: true, empCode: true, name: true, department: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const evaluation = await this.prisma.evaluation.findUnique({
      where: { id },
      include: { employee: true },
    });
    if (!evaluation) throw new NotFoundException('Evaluation not found');
    return evaluation;
  }

  async submit(id: string) {
    await this.findOne(id);
    return this.prisma.evaluation.update({
      where: { id },
      data: { status: 'SUBMITTED', submittedAt: new Date() },
    });
  }

  async approve(id: string) {
    await this.findOne(id);
    return this.prisma.evaluation.update({
      where: { id },
      data: { status: 'APPROVED' },
    });
  }
}
