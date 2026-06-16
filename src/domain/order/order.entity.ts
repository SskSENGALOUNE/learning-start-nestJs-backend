export class OrderItemEntity {
  constructor(
    public readonly id: number,
    public readonly productId: number,
    public readonly quantity: number,
    public readonly price: number,
    public readonly name: string,
  ) { }
}

export class OrderEntity {
  public readonly total: number;
  constructor(
    public readonly id: number,
    public readonly customerId: number,
    public readonly status: string,
    public readonly createdAt: Date,
    public readonly items: OrderItemEntity[],
  ) {
    this.total = items.reduce(
      (sum, item) => sum + item.price * item.quantity, 0
    )
  }

}
