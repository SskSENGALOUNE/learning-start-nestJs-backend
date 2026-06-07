import { Body, Controller, Post } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { CategoryEntity } from "src/domain/category/category.entity";
import { CreateCustomerCommand } from "src/application/customer/commands/create-customer/create-customer.command";
import { CustomerEntity } from "src/domain/customer/customer.entity";

@Controller('customer')
export class CustomerController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus
    ) { }


    @Post()
    createCategory(@Body() dto: CreateCustomerDto): Promise<CustomerEntity> {
        return this.commandBus.execute(new CreateCustomerCommand(dto.name, dto.email))
    }
}