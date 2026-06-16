// TODO: ประกาศ UpsertCustomerCommand
//   - รับ email: string, name: string (ดูแบบจาก create-customer.command.ts)

export class UpsertCustomerCommand {
  constructor(
    public readonly email: string,
    public readonly name: string,
  ) {}
}
