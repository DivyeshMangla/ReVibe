import { IsInt, IsNotEmpty, Min, Max } from 'class-validator';

export class CreatePayrollRunDto {
  @IsInt()
  @Min(1)
  @Max(12)
  @IsNotEmpty()
  month: number;

  @IsInt()
  @Min(2000)
  @Max(2100)
  @IsNotEmpty()
  year: number;
}
