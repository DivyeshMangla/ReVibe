import { Controller, Get, Post, Body, Param, Patch, UseGuards, Request } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('promotions')
@UseGuards(JwtAuthGuard)
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Post()
  create(@Body() createPromotionDto: CreatePromotionDto, @Request() req) {
    return this.promotionsService.create(createPromotionDto, req.user.userId);
  }

  @Get()
  findAll() {
    return this.promotionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.promotionsService.findOne(id);
  }

  @Patch(':id/approve')
  approve(@Param('id') id: string, @Request() req) {
    return this.promotionsService.approve(id, req.user.userId);
  }

  @Patch(':id/reject')
  reject(@Param('id') id: string, @Request() req) {
    return this.promotionsService.reject(id, req.user.userId);
  }

  @Patch(':id/mark-effective')
  markEffective(@Param('id') id: string) {
    return this.promotionsService.markEffective(id);
  }
}
