export class OrderEntity {
    constructor(
        public readonly id: number,
        public readonly customerId: number,
        public readonly productId: number,
        public readonly quantity: number,
    ) { }
}
