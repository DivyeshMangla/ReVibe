import { Module } from '@nestjs/common';
import { JoiningRelievingController } from './joining-relieving.controller';
import { JoiningRelievingService } from './joining-relieving.service';

@Module({
  controllers: [JoiningRelievingController],
  providers: [JoiningRelievingService],
  exports: [JoiningRelievingService],
})
export class JoiningRelievingModule {}
