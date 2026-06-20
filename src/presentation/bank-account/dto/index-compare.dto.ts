import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';

export class IndexCompareDto {
  @IsOptional()
  @IsString()
  bankName?: string = 'BCEL'; // field ที่มี index

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  rate?: number = 3; // field ที่ไม่มี index (interestRate)

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 50;
}
