import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { JoiningRelievingService } from './joining-relieving.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('joining-relieving')
@UseGuards(JwtAuthGuard)
export class JoiningRelievingController {
  constructor(private readonly service: JoiningRelievingService) {}

  @Post()
  create(@Body() data: any) {
    return this.service.create(data);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id/approve')
  approve(@Param('id') id: string, @Body('approverId') approverId: string) {
    return this.service.approve(id, approverId);
  }

  @Patch(':id/complete')
  complete(@Param('id') id: string) {
    return this.service.complete(id);
  }
}
