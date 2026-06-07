export class CustomerEntity {
    constructor(
        public readonly id: number,
        public readonly email: string,
        public name: string
    ) { }

    rename(name: string): void {
        this.name = name
    }

}