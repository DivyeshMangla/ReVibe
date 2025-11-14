import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { EServiceBookService } from './eservice-book.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('eservice-book')
@UseGuards(JwtAuthGuard)
export class EServiceBookController {
  constructor(private readonly service: EServiceBookService) {}

  @Post()
  create(@Body() data: any) {
    return this.service.create(data);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('employee/:employeeId')
  findByEmployee(@Param('employeeId') employeeId: string) {
    return this.service.findByEmployee(employeeId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id/verify')
  verify(@Param('id') id: string, @Body('verifierId') verifierId: string) {
    return this.service.verify(id, verifierId);
  }
}
