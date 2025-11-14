import { Controller, Get, Post, Body, Param, Patch, UseGuards, Request } from '@nestjs/common';
import { SalaryCorrectionsService } from './salary-corrections.service';
import { CreateCorrectionDto } from './dto/create-correction.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('corrections')
@UseGuards(JwtAuthGuard)
export class SalaryCorrectionsController {
  constructor(private readonly correctionsService: SalaryCorrectionsService) {}

  @Post()
  create(@Body() createCorrectionDto: CreateCorrectionDto, @Request() req) {
    return this.correctionsService.create(createCorrectionDto, req.user.userId);
  }

  @Get()
  findAll() {
    return this.correctionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.correctionsService.findOne(id);
  }

  @Patch(':id/approve')
  approve(@Param('id') id: string, @Request() req) {
    return this.correctionsService.approve(id, req.user.userId);
  }

  @Patch(':id/reject')
  reject(@Param('id') id: string, @Request() req) {
    return this.correctionsService.reject(id, req.user.userId);
  }
}
