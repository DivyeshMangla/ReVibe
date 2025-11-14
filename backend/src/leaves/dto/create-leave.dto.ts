import { IsNotEmpty, IsString, IsDateString, IsEnum } from 'class-validator';

export class CreateLeaveDto {
  @IsNotEmpty()
  @IsString()
  employeeId: string;

  @IsNotEmpty()
  @IsEnum(['SICK', 'CASUAL', 'EARNED', 'MATERNITY', 'PATERNITY', 'UNPAID'])
  leaveType: 'SICK' | 'CASUAL' | 'EARNED' | 'MATERNITY' | 'PATERNITY' | 'UNPAID';

  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @IsNotEmpty()
  @IsDateString()
  endDate: string;

  @IsNotEmpty()
  @IsString()
  reason: string;
}
