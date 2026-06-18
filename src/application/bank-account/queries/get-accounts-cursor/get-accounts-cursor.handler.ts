import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetAccountsCursorQuery } from "./get-accounts-cursor.query";
import { BankAccountRepository } from "src/infrastructure/bank-account/bank-account.repository";

@QueryHandler(GetAccountsCursorQuery)
export class GetAccountsCursorHandler implements IQueryHandler<GetAccountsCursorQuery> {
    constructor(private readonly repo: BankAccountRepository) { }
    async execute(query: GetAccountsCursorQuery) {
        return this.repo.findWithCursor(query.cursorId, query.limit)
    }

}