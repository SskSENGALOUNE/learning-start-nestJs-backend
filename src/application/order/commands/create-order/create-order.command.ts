export class CreateOrderCommand {
    constructor(
        public readonly customerId: number,
        public readonly productId: number,
        public readonly quantity: number,
    ) { }
}
