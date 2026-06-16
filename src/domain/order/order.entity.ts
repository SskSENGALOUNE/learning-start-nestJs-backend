export class OrderItemEntity {
  constructor(
    public readonly id: number,
    public readonly productId: number,
    public readonly quantity: number,
    public readonly price: number,
    public readonly name: string,
  ) {}
}

export class OrderEntity {
  constructor(
    public readonly id: number,
    public readonly customerId: number,
    public readonly items: OrderItemEntity[],
  ) {}
}
