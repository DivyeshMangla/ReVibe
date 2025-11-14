import { IsNumber, IsNotEmpty, Min, IsOptional } from 'class-validator';

export class CalculateSalaryDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  basicSalary: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  otherEarnings?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  otherDeductions?: number;
}
