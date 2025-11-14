import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeesService {
  private prisma = new PrismaClient();

  async create(createEmployeeDto: CreateEmployeeDto) {
    const existing = await this.prisma.employee.findFirst({
      where: {
        OR: [
          { empCode: createEmployeeDto.empCode },
          { email: createEmployeeDto.email }
        ]
      }
    });

    if (existing) {
      throw new ConflictException('Employee code or email already exists');
    }

    return this.prisma.employee.create({
      data: {
        ...createEmployeeDto,
        hireDate: new Date(createEmployeeDto.hireDate),
      }
    });
  }

  async findAll() {
    return this.prisma.employee.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(id: string) {
    const employee = await this.prisma.employee.findUnique({
      where: { id },
      include: {
        jobProfiles: {
          orderBy: { effectiveDate: 'desc' }
        },
        salarySlips: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return employee;
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    await this.findOne(id);

    return this.prisma.employee.update({
      where: { id },
      data: updateEmployeeDto
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.employee.update({
      where: { id },
      data: { status: 'INACTIVE' }
    });
  }
}
