import { IsNotEmpty, IsString, IsObject } from 'class-validator';

export class CreateCorrectionDto {
  @IsString()
  @IsNotEmpty()
  salarySlipId: string;

  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsObject()
  @IsNotEmpty()
  changes: Record<string, any>;
}
