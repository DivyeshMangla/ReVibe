import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateJobProfileDto } from './dto/create-job-profile.dto';
import { UpdateJobProfileDto } from './dto/update-job-profile.dto';

@Injectable()
export class JobProfilesService {
  private prisma = new PrismaClient();

  async create(createJobProfileDto: CreateJobProfileDto) {
    const employee = await this.prisma.employee.findUnique({
      where: { id: createJobProfileDto.employeeId }
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return this.prisma.jobProfile.create({
      data: {
        ...createJobProfileDto,
        effectiveDate: new Date(createJobProfileDto.effectiveDate),
      },
      include: { employee: true }
    });
  }

  async findByEmployee(employeeId: string) {
    return this.prisma.jobProfile.findMany({
      where: { employeeId },
      orderBy: { effectiveDate: 'desc' },
      include: { employee: true }
    });
  }

  async findOne(id: string) {
    const profile = await this.prisma.jobProfile.findUnique({
      where: { id },
      include: { employee: true }
    });

    if (!profile) {
      throw new NotFoundException('Job profile not found');
    }

    return profile;
  }

  async update(id: string, updateJobProfileDto: UpdateJobProfileDto) {
    await this.findOne(id);

    return this.prisma.jobProfile.update({
      where: { id },
      data: updateJobProfileDto,
      include: { employee: true }
    });
  }

  async getCurrentProfile(employeeId: string) {
    const profiles = await this.prisma.jobProfile.findMany({
      where: {
        employeeId,
        effectiveDate: { lte: new Date() }
      },
      orderBy: { effectiveDate: 'desc' },
      take: 1
    });

    if (profiles.length === 0) {
      throw new NotFoundException('No current job profile found');
    }

    return profiles[0];
  }
}
