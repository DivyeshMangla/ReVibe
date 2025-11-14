import { Controller, Get, Post, Body, Param, Patch, UseGuards, Request } from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { CreatePayrollRunDto } from './dto/create-payroll-run.dto';
import { CalculateSalaryDto } from './dto/calculate-salary.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('payroll')
@UseGuards(JwtAuthGuard)
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Post('runs')
  createRun(@Body() createPayrollRunDto: CreatePayrollRunDto, @Request() req) {
    return this.payrollService.createPayrollRun(createPayrollRunDto, req.user.userId);
  }

  @Get('runs')
  findAllRuns() {
    return this.payrollService.findAllRuns();
  }

  @Get('runs/:id')
  findOneRun(@Param('id') id: string) {
    return this.payrollService.findOneRun(id);
  }

  @Patch('runs/:id/approve')
  approveRun(@Param('id') id: string, @Request() req) {
    return this.payrollService.approveRun(id, req.user.userId);
  }

  @Patch('runs/:id/finalize')
  finalizeRun(@Param('id') id: string, @Request() req) {
    return this.payrollService.finalizeRun(id, req.user.userId);
  }

  @Get('slips/:id')
  findSlip(@Param('id') id: string) {
    return this.payrollService.findSalarySlip(id);
  }

  @Get('slips/:id/pdf')
  generatePdf(@Param('id') id: string) {
    return this.payrollService.generatePdf(id);
  }

  @Post('calculate')
  calculateSalary(@Body() calculateSalaryDto: CalculateSalaryDto) {
    return this.payrollService.calculateSalary(calculateSalaryDto);
  }
}
