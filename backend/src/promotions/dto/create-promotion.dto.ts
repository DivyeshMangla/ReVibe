import { IsNotEmpty, IsString, IsNumber, IsDateString, Min } from 'class-validator';

export class CreatePromotionDto {
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @IsString()
  @IsNotEmpty()
  currentRole: string;

  @IsString()
  @IsNotEmpty()
  proposedRole: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  currentSalary: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  proposedSalary: number;

  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsDateString()
  @IsNotEmpty()
  effectiveDate: string;
}
