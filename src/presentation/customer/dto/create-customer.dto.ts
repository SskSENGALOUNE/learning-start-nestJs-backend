import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class CreateCustomerDto {
    @IsString()
    @IsNotEmpty()
    email: string
    @IsEmail()
    name: string


}