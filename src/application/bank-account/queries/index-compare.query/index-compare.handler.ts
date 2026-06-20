import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IndexCompareQuery } from './index-compare.query';
import { BankAccountRepository } from 'src/infrastructure/bank-account/bank-account.repository';

@QueryHandler(IndexCompareQuery)
export class IndexCompareHandler implements IQueryHandler<IndexCompareQuery> {
  constructor(private readonly repo: BankAccountRepository) {}

  async execute(query: IndexCompareQuery) {
    const unindexed = await this.repo.findByUnindexed(query.rate, query.limit);
    const indexed = await this.repo.findByIndexed(query.bankName, query.limit);
    return {
      indexed: { field: 'bankName', ms: indexed.ms, count: indexed.count },
      unindexed: {
        field: 'interestRate',
        ms: unindexed.ms,
        count: unindexed.count,
      },
      diff_ms: unindexed.ms - indexed.ms,
    };
  }
}
