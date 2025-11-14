import { Module } from '@nestjs/common';
import { AcrsController } from './acrs.controller';
import { AcrsService } from './acrs.service';

@Module({
  controllers: [AcrsController],
  providers: [AcrsService],
  exports: [AcrsService],
})
export class AcrsModule {}
