
import { IsNotEmpty, IsString } from "class-validator";


export class UpsertCustomerDto {

    @IsString()
    @IsNotEmpty()
    name: string
}
