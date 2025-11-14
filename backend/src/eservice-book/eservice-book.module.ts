import { Module } from '@nestjs/common';
import { EServiceBookController } from './eservice-book.controller';
import { EServiceBookService } from './eservice-book.service';

@Module({
  controllers: [EServiceBookController],
  providers: [EServiceBookService],
  exports: [EServiceBookService],
})
export class EServiceBookModule {}
