import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { JobProfilesService } from './job-profiles.service';
import { CreateJobProfileDto } from './dto/create-job-profile.dto';
import { UpdateJobProfileDto } from './dto/update-job-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('job-profiles')
@UseGuards(JwtAuthGuard)
export class JobProfilesController {
  constructor(private readonly jobProfilesService: JobProfilesService) {}

  @Post()
  create(@Body() createJobProfileDto: CreateJobProfileDto) {
    return this.jobProfilesService.create(createJobProfileDto);
  }

  @Get('employee/:employeeId')
  findByEmployee(@Param('employeeId') employeeId: string) {
    return this.jobProfilesService.findByEmployee(employeeId);
  }

  @Get('employee/:employeeId/current')
  getCurrentProfile(@Param('employeeId') employeeId: string) {
    return this.jobProfilesService.getCurrentProfile(employeeId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobProfilesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJobProfileDto: UpdateJobProfileDto) {
    return this.jobProfilesService.update(id, updateJobProfileDto);
  }
}
