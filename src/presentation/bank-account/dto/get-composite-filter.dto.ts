import { IsBoolean, IsEnum, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { AccountType } from 'generated/prisma/enums';




export class GetCompositeFilterDto {
    @IsOptional()
    @IsEnum(AccountType)
    accountType?: AccountType = AccountType.SAVINGS;

    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    isActive?: boolean = true;

    @IsOptional()
    @Transform(({ value }) => Number(value))
    @IsNumber()
    @Min(1)
    @Max(500)
    limit?: number = 50;
}
