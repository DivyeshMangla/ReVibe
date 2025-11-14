import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { AcrsService } from './acrs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('acrs')
@UseGuards(JwtAuthGuard)
export class AcrsController {
  constructor(private readonly acrsService: AcrsService) {}

  @Post()
  create(@Body() data: any) {
    return this.acrsService.create(data);
  }

  @Get()
  findAll() {
    return this.acrsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.acrsService.findOne(id);
  }

  @Patch(':id/submit')
  submit(@Param('id') id: string) {
    return this.acrsService.submit(id);
  }

  @Patch(':id/approve')
  approve(@Param('id') id: string) {
    return this.acrsService.approve(id);
  }
}
