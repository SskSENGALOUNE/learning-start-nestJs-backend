import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class GetAccountsCursorDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  cursorId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}
