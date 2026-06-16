// TODO: implement UpsertCustomerHandler
//   1. @CommandHandler(UpsertCustomerCommand) + implements ICommandHandler
//   2. inject CustomerRepository
//   3. execute(): เรียก this.customerRepository.upsert(command.email, command.name) แล้ว return
//      *** ไม่ต้องเช็ค conflict / ไม่ต้อง throw — logic อยู่ที่ DB layer แล้ว ***

import { CommandHandler } from "@nestjs/cqrs";
import { UpsertCustomerCommand } from "./upsert-customer.command";




@CommandHandler(UpsertCustomerCommand) {
    export class CreateCustomerHandler implements ICommandHandler<CreateCustomerCommand> { }
 }
