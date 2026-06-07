export class ProductEntity {
    constructor(
        public readonly id: number,
        public name: string,
        public price: number,
    ) { }

    rename(name: string): void {
        this.name = name;
    }

    changePrice(price: number): void {
        if (price < 0) {
            throw new Error('Price cannot be negative');
        }
        this.price = price;
    }
}
