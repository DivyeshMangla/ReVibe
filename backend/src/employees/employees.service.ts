import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
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

    // Create employee
    const employee = await this.prisma.employee.create({
      data: {
        ...createEmployeeDto,
        hireDate: new Date(createEmployeeDto.hireDate),
      }
    });

    // Auto-create user account with default password
    const defaultPassword = 'Welcome@123';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    await this.prisma.user.create({
      data: {
        email: employee.email,
        password: hashedPassword,
        name: employee.name,
        role: 'EMPLOYEE',
        employeeId: employee.id,
      }
    });

    return {
      ...employee,
      defaultPassword, // Return this so HR knows the password to give to employee
    };
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

  async updateUserRole(employeeId: string, role: 'EMPLOYEE' | 'SUPERVISOR' | 'HR' | 'PAYROLL_ADMIN') {
    const employee = await this.findOne(employeeId);
    
    const user = await this.prisma.user.findUnique({
      where: { employeeId }
    });

    if (!user) {
      throw new NotFoundException('User account not found for this employee');
    }

    return this.prisma.user.update({
      where: { id: user.id },
      data: { role }
    });
  }

  async resetPassword(employeeId: string) {
    const employee = await this.findOne(employeeId);
    
    const user = await this.prisma.user.findUnique({
      where: { employeeId }
    });

    if (!user) {
      throw new NotFoundException('User account not found for this employee');
    }

    const newPassword = 'Welcome@123';
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    return {
      message: 'Password reset successfully',
      newPassword,
    };
  }
}
