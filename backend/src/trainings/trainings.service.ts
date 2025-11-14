import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class TrainingsService {
  private prisma = new PrismaClient();

  async create(data: any) {
    return this.prisma.training.create({
      data: {
        ...data,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
      },
      include: { employee: true },
    });
  }

  async findAll() {
    return this.prisma.training.findMany({
      include: { employee: { select: { id: true, empCode: true, name: true, department: true } } },
      orderBy: { startDate: 'desc' },
    });
  }

  async findOne(id: string) {
    const training = await this.prisma.training.findUnique({
      where: { id },
      include: { employee: true },
    });
    if (!training) throw new NotFoundException('Training not found');
    return training;
  }

  async complete(id: string, data: { completionDate: string; score?: number; feedback?: string }) {
    await this.findOne(id);
    return this.prisma.training.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        completionDate: new Date(data.completionDate),
        score: data.score,
        feedback: data.feedback,
      },
    });
  }
}
