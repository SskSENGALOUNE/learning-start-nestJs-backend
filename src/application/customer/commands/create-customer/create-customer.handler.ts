import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateCustomerCommand } from "./create-customer.command";
import { CustomerEntity } from "src/domain/customer/customer.entity";
import { CustomerRepository } from "src/infrastructure/customer/customer.repository";
import { ConflictException } from "@nestjs/common";

@CommandHandler(CreateCustomerCommand)
export class CreateCustomerHandler implements ICommandHandler<CreateCustomerCommand> {
    constructor(private readonly customerRepository: CustomerRepository) { }

    async execute(command: CreateCustomerCommand): Promise<CustomerEntity> {
        const existing = await this.customerRepository.findByEmail(command.email);
        if (existing) {
            throw new ConflictException(`Email ${command.email} already exists`);
        }
        return this.customerRepository.create(command.name, command.email);

    }


}