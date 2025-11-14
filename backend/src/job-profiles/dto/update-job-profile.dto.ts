import { IsOptional, IsString } from 'class-validator';

export class UpdateJobProfileDto {
  @IsString()
  @IsOptional()
  role?: string;

  @IsString()
  @IsOptional()
  department?: string;

  @IsString()
  @IsOptional()
  responsibilities?: string;
}
