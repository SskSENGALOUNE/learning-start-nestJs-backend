import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetAccountsOffsetQuery } from "./get-accounts-offset.query";
import { BankAccountRepository } from "src/infrastructure/bank-account/bank-account.repository";

@QueryHandler(GetAccountsOffsetQuery)
export class GetAccountsOffsetHandler implements IQueryHandler<GetAccountsOffsetQuery> {
    constructor(private readonly repo: BankAccountRepository) { }

    async execute(query: GetAccountsOffsetQuery) {
        return this.repo.findWithOffset(query.page, query.limit)
    }
}