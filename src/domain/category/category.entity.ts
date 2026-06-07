export class CategoryEntity {
    constructor(
        public readonly id: number,
        public name: string,
    ) { }

    rename(name: string): void {
        this.name = name;
    }
}
