import { IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class CreateJobProfileDto {
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @IsString()
  @IsNotEmpty()
  role: string;

  @IsString()
  @IsNotEmpty()
  department: string;

  @IsString()
  @IsNotEmpty()
  responsibilities: string;

  @IsDateString()
  @IsNotEmpty()
  effectiveDate: string;
}
