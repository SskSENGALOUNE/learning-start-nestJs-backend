import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpsertCustomerCommand } from "./upsert-customer.command";
import { CustomerRepository } from "src/infrastructure/customer/customer.repository";

@CommandHandler(UpsertCustomerCommand)
export class UpsertCustomerHandler implements ICommandHandler<UpsertCustomerCommand> {
    constructor(private readonly customerRepository: CustomerRepository) {}

    execute(command: UpsertCustomerCommand) {
        return this.customerRepository.upsert(command.email, command.name);
    }
}
