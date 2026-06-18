import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTopAccountsOrmQuery } from './get-top-accounts-orm.query';
import { BankAccountRepository } from 'src/infrastructure/bank-account/bank-account.repository';

@QueryHandler(GetTopAccountsOrmQuery)
export class GetTopAccountsOrmHandler implements IQueryHandler<GetTopAccountsOrmQuery> {
    constructor(private readonly repo: BankAccountRepository) {}

    async execute(query: GetTopAccountsOrmQuery) {
        return this.repo.getTopNPerGroupOrm(query.n);
    }
}
