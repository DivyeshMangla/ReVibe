import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('transfers')
@UseGuards(JwtAuthGuard)
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @Post()
  create(@Body() data: any) {
    return this.transfersService.create(data);
  }

  @Get()
  findAll() {
    return this.transfersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transfersService.findOne(id);
  }

  @Patch(':id/approve')
  approve(@Param('id') id: string, @Body('approverId') approverId: string) {
    return this.transfersService.approve(id, approverId);
  }

  @Patch(':id/reject')
  reject(@Param('id') id: string) {
    return this.transfersService.reject(id);
  }
}
