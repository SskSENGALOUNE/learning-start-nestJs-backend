import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

// Infrastructure
import { BankAccountRepository } from '../infrastructure/bank-account/bank-account.repository';

// Presentation
import { BankAccountController } from '../presentation/bank-account/bank-account.controller';

// Query Handlers
import { GetAccountsOffsetHandler } from '../application/bank-account/queries/get-accounts-offset/get-accounts-offset.handler';
import { GetAccountsCursorHandler } from '../application/bank-account/queries/get-accounts-cursor/get-accounts-cursor.handler';
import { GetAccountsFilterHandler } from '../application/bank-account/queries/get-accounts-filter/get-accounts-filter.handler';
import { GetAccountStatsHandler } from '../application/bank-account/queries/get-account-stats/get-account-stats.handler';
import { GetBenchmarkQueryHandler } from '../application/bank-account/queries/get-benchmark/get-benchmark.handler';
import { GetTopAccountsHandler } from '../application/bank-account/queries/get-top-accounts/get-top-accounts.handler';
import { GetTopAccountsOrmHandler } from '../application/bank-account/queries/get-top-accounts-orm/get-top-accounts-orm.handler';
import { IndexCompareHandler } from '../application/bank-account/queries/index-compare.query/index-compare.handler';
import { GetCompositeFilterHandler } from '../application/bank-account/queries/get-composite-filter/get-composite-filter.handler';

const QueryHandlers = [
  // Pagination
  GetAccountsOffsetHandler,
  GetAccountsCursorHandler,

  // Filtering & Search
  GetAccountsFilterHandler,
  GetCompositeFilterHandler,
  IndexCompareHandler,

  // Aggregation & Stats
  GetAccountStatsHandler,
  GetTopAccountsHandler,
  GetTopAccountsOrmHandler,

  // Benchmark
  GetBenchmarkQueryHandler,
];

@Module({
  imports: [CqrsModule],
  controllers: [BankAccountController],
  providers: [BankAccountRepository, ...QueryHandlers],
})
export class BankAccountModule {}
