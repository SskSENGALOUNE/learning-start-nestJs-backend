import { Module } from "@nestjs/common";
import { CreateCustomerHandler } from "./application/customer/commands/create-customer/create-customer.handler";
import { CqrsModule } from "@nestjs/cqrs";
import { CustomerRepository } from "./infrastructure/customer/customer.repository";
import { CustomerController } from "./presentation/customer/customer.controller";
import { UpsertCustomerHandler } from "./application/customer/commands/upsert-customer/upsert-customer.handler";

const CommandHandlers = [CreateCustomerHandler, UpsertCustomerHandler];

@Module({
    imports: [CqrsModule],
    controllers: [CustomerController],
    providers: [CustomerRepository, ...CommandHandlers],
})
export class CutomerModule { }
