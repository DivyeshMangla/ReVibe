import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { PropertyReturnsService } from './property-returns.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('property-returns')
@UseGuards(JwtAuthGuard)
export class PropertyReturnsController {
  constructor(private readonly service: PropertyReturnsService) {}

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

  @Patch(':id/return')
  markReturned(@Param('id') id: string, @Body('condition') condition: string) {
    return this.service.markReturned(id, condition);
  }

  @Patch(':id/verify')
  verify(@Param('id') id: string, @Body('verifierId') verifierId: string) {
    return this.service.verify(id, verifierId);
  }
}
