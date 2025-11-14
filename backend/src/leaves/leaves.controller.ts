import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { LeavesService } from './leaves.service';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { UpdateLeaveDto } from './dto/update-leave.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('leaves')
@UseGuards(JwtAuthGuard)
export class LeavesController {
  constructor(private readonly leavesService: LeavesService) {}

  @Post()
  create(@Body() createLeaveDto: CreateLeaveDto) {
    return this.leavesService.create(createLeaveDto);
  }

  @Get()
  findAll() {
    return this.leavesService.findAll();
  }

  @Get('employee/:employeeId')
  findByEmployee(@Param('employeeId') employeeId: string) {
    return this.leavesService.findByEmployee(employeeId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leavesService.findOne(id);
  }

  @Patch(':id/approve')
  approve(@Param('id') id: string, @Body('approverId') approverId: string) {
    return this.leavesService.approve(id, approverId);
  }

  @Patch(':id/reject')
  reject(@Param('id') id: string, @Body('rejecterId') rejecterId: string) {
    return this.leavesService.reject(id, rejecterId);
  }

  @Patch(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.leavesService.cancel(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLeaveDto: UpdateLeaveDto) {
    return this.leavesService.update(id, updateLeaveDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.leavesService.remove(id);
  }
}
