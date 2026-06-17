export class GetProductsByFiltersQuery {
  constructor(
    public readonly minPrice?: number,
    public readonly minStock?: number,
  ) {}
}
