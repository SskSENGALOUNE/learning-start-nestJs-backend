export class GetProductsByPriceRangeQuery {
    constructor(
        public readonly minPrice: number,
        public readonly maxPrice: number,
    ) { }
}
