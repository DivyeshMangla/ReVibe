import { Module } from '@nestjs/common';
import { PropertyReturnsController } from './property-returns.controller';
import { PropertyReturnsService } from './property-returns.service';

@Module({
  controllers: [PropertyReturnsController],
  providers: [PropertyReturnsService],
  exports: [PropertyReturnsService],
})
export class PropertyReturnsModule {}
