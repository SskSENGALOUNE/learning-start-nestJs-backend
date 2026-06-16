export interface CreateOrderItem {
  productId: number;
  quantity: number;
}

export class CreateOrderCommand {
  constructor(
    public readonly customerId: number,
    public readonly items: CreateOrderItem[],
  ) {}
}
