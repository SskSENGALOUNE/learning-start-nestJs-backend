import { CqrsModule } from "@nestjs/cqrs";
import { BankAccountController } from "./presentation/bank-account/bank-account.controller";
import { BankAccountRepository } from "./infrastructure/bank-account/bank-account.repository";
import { GetAccountStatsHandler } from "./application/bank-account/queries/get-account-stats/get-account-stats.handler";
import { Module } from "@nestjs/common";
import { GetAccountsCursorHandler } from "./application/bank-account/queries/get-accounts-cursor/get-accounts-cursor.handler";
import { GetBenchmarkQueryHandler } from "./application/bank-account/queries/get-benchmark/get-benchmark.handler";
import { GetAccountsOffsetHandler } from "./application/bank-account/queries/get-accounts-offset/get-accounts-offset.handler";
import { GetAccountsFilterHandler } from "./application/bank-account/queries/get-accounts-filter/get-accounts-filter.handler";
import { GetTopAccountsHandler } from "./application/bank-account/queries/get-top-accounts/get-top-accounts.handler";
import { GetTopAccountsOrmHandler } from "./application/bank-account/queries/get-top-accounts-orm/get-top-accounts-orm.handler";

const QueryHandlers = [GetAccountStatsHandler, GetTopAccountsOrmHandler, GetTopAccountsHandler, GetAccountsCursorHandler, GetAccountsFilterHandler, GetAccountsOffsetHandler, GetBenchmarkQueryHandler]


@Module({
    imports: [CqrsModule],
    controllers: [BankAccountController],
    providers: [BankAccountRepository, ...QueryHandlers],
})
export class BankAccountModule { }
