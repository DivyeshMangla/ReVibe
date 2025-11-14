import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { EvaluationsService } from './evaluations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('evaluations')
@UseGuards(JwtAuthGuard)
export class EvaluationsController {
  constructor(private readonly evaluationsService: EvaluationsService) {}

  @Post()
  create(@Body() data: any) {
    return this.evaluationsService.create(data);
  }

  @Get()
  findAll() {
    return this.evaluationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.evaluationsService.findOne(id);
  }

  @Patch(':id/submit')
  submit(@Param('id') id: string) {
    return this.evaluationsService.submit(id);
  }

  @Patch(':id/approve')
  approve(@Param('id') id: string) {
    return this.evaluationsService.approve(id);
  }
}
