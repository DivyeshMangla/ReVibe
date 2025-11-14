import { Module } from '@nestjs/common';
import { SalaryCorrectionsService } from './salary-corrections.service';
import { SalaryCorrectionsController } from './salary-corrections.controller';

@Module({
  controllers: [SalaryCorrectionsController],
  providers: [SalaryCorrectionsService],
  exports: [SalaryCorrectionsService],
})
export class SalaryCorrectionsModule {}
