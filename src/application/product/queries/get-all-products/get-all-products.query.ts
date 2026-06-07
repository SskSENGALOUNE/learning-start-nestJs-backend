export class GetAllProductsQuery {
    constructor(
        public readonly name?: string,
        public readonly page?: number,
        public readonly limit?: number
    ) { }
}
