import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { UpdateLeaveDto } from './dto/update-leave.dto';

@Injectable()
export class LeavesService {
  private prisma = new PrismaClient();

  async create(createLeaveDto: CreateLeaveDto) {
    const startDate = new Date(createLeaveDto.startDate);
    const endDate = new Date(createLeaveDto.endDate);
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    return this.prisma.leave.create({
      data: {
        ...createLeaveDto,
        startDate,
        endDate,
        days,
      },
      include: {
        employee: {
          select: {
            id: true,
            empCode: true,
            name: true,
            email: true,
            department: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.leave.findMany({
      include: {
        employee: {
          select: {
            id: true,
            empCode: true,
            name: true,
            department: true,
          },
        },
      },
      orderBy: { appliedAt: 'desc' },
    });
  }

  async findByEmployee(employeeId: string) {
    return this.prisma.leave.findMany({
      where: { employeeId },
      orderBy: { appliedAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const leave = await this.prisma.leave.findUnique({
      where: { id },
      include: {
        employee: {
          select: {
            id: true,
            empCode: true,
            name: true,
            email: true,
            department: true,
          },
        },
      },
    });

    if (!leave) {
      throw new NotFoundException('Leave request not found');
    }

    return leave;
  }

  async approve(id: string, approverId: string) {
    await this.findOne(id);

    return this.prisma.leave.update({
      where: { id },
      data: {
        status: 'APPROVED',
        approvedBy: approverId,
        approvedAt: new Date(),
      },
    });
  }

  async reject(id: string, rejecterId: string) {
    await this.findOne(id);

    return this.prisma.leave.update({
      where: { id },
      data: {
        status: 'REJECTED',
        rejectedBy: rejecterId,
        rejectedAt: new Date(),
      },
    });
  }

  async cancel(id: string) {
    await this.findOne(id);

    return this.prisma.leave.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
  }

  async update(id: string, updateLeaveDto: UpdateLeaveDto) {
    await this.findOne(id);

    return this.prisma.leave.update({
      where: { id },
      data: updateLeaveDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.leave.delete({
      where: { id },
    });
  }
}
