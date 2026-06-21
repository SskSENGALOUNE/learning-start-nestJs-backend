import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class CreateCustomerDto {
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string
    @IsString()
    @IsNotEmpty()
    name: string


}