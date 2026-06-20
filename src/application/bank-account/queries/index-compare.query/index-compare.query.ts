export class IndexCompareQuery {
  constructor(
    public readonly bankName: string,
    public readonly rate: number,
    public readonly limit: number,
  ) {}
}
