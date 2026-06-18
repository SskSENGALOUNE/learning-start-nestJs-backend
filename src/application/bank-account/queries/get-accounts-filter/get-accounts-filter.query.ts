export class GetAccountsFilterQuery {
    constructor(public readonly bankName: string, public readonly limit: number) { }
}