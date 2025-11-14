import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { TrainingsService } from './trainings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('trainings')
@UseGuards(JwtAuthGuard)
export class TrainingsController {
  constructor(private readonly trainingsService: TrainingsService) {}

  @Post()
  create(@Body() data: any) {
    return this.trainingsService.create(data);
  }

  @Get()
  findAll() {
    return this.trainingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trainingsService.findOne(id);
  }

  @Patch(':id/complete')
  complete(@Param('id') id: string, @Body() data: any) {
    return this.trainingsService.complete(id, data);
  }
}
