export class ProductEntity {
    constructor(
        public readonly id: number,
        public name: string,
        public price: number,
        public stock: number
    ) { }

    static create(name: string, price: number, stock: number): ProductEntity {
        if (stock < 0) {
            throw new Error("Stock connot be negative")
        }
        return new ProductEntity(0, name, price, stock)
    }



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
