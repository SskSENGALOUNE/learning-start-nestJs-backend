import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAccountsFilterQuery } from './get-accounts-filter.query';
import { BankAccountRepository } from 'src/infrastructure/bank-account/bank-account.repository';

@QueryHandler(GetAccountsFilterQuery)
export class GetAccountsFilterHandler implements IQueryHandler<GetAccountsFilterQuery> {
    constructor(private readonly repo: BankAccountRepository) { }

    async execute(query: GetAccountsFilterQuery) {
        const [star, fields] = await Promise.all([
            this.repo.findFilterSelectStar(query.bankName, query.limit),
            this.repo.findFilterSelectFields(query.bankName, query.limit),
        ]);
        return {
            select_star: { ms: star.ms, count: star.count },
            select_fields: { ms: fields.ms, count: fields.count },
        };
    }
}
