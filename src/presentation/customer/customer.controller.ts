import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { CreateCustomerCommand } from "src/application/customer/commands/create-customer/create-customer.command";
import { CustomerEntity } from "src/domain/customer/customer.entity";
import { UpsertCustomerDto } from "./dto/upsert-customer.dto";
import { UpsertCustomerCommand } from "src/application/customer/commands/upsert-customer/upsert-customer.command";
import { GetAllCustomersQuery } from "src/application/customer/query/get-all-customers.query";

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
    @Get()
    getAllCustomers(): Promise<CustomerEntity[]> {
        return this.queryBus.execute(new GetAllCustomersQuery());
    }

    @Put(':email')
    upsertCustomer(
        @Param('email') email: string, @Body() dto: UpsertCustomerDto
    ): Promise<CustomerEntity> {
        return this.commandBus.execute(new UpsertCustomerCommand(email, dto.name))
    }
}