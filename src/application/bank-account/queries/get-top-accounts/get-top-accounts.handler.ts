import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetTopAccountsQuery } from "./get-top-accounts.query";
import { BankAccountRepository } from "src/infrastructure/bank-account/bank-account.repository";

@QueryHandler(GetTopAccountsQuery)
export class GetTopAccountsHandler implements IQueryHandler<GetTopAccountsQuery> {
    constructor(private readonly repo: BankAccountRepository) { }

    async execute(query: GetTopAccountsQuery) {
        return this.repo.getTopNPerGroup(query.n);
    }
}
