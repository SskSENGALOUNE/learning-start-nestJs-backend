import { Controller, Get, Query } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { GetAccountsOffsetDto } from "./dto/get-accounts-offset.dto";
import { GetAccountsCursorDto } from "./dto/get-accounts-cursor.dto";
import { GetAccountsFilterDto } from "./dto/get-accounts-filter.dto";
import { GetAccountsOffsetQuery } from "src/application/bank-account/queries/get-accounts-offset/get-accounts-offset.query";
import { GetAccountStatsQuery } from "src/application/bank-account/queries/get-account-stats/get-account-stats.query";
import { GetAccountsCursorQuery } from "src/application/bank-account/queries/get-accounts-cursor/get-accounts-cursor.query";
import { GetAccountsFilterQuery } from "src/application/bank-account/queries/get-accounts-filter/get-accounts-filter.query";
import { GetBenchmarkQuery } from "src/application/bank-account/queries/get-benchmark/get-benchmark.query";
import { GetTopAccountsQuery } from "src/application/bank-account/queries/get-top-accounts/get-top-accounts.query";
import { GetTopAccountsOrmQuery } from "src/application/bank-account/queries/get-top-accounts-orm/get-top-accounts-orm.query";

@Controller('bank-accounts')
export class BankAccountController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) { }

    @Get('offset')
    getWithOffset(@Query() dto: GetAccountsOffsetDto) {
        return this.queryBus.execute(new GetAccountsOffsetQuery(dto.page ?? 1, dto.limit ?? 20));
    }

    @Get('cursor')
    getWithCursor(@Query() dto: GetAccountsCursorDto) {
        return this.queryBus.execute(
            new GetAccountsCursorQuery(dto.cursorId, dto.limit ?? 20)
        );
    }
    @Get('filter')
    getWithFilter(@Query() dto: GetAccountsFilterDto) {
        return this.queryBus.execute(
            new GetAccountsFilterQuery(dto.bankName ?? 'BCEL', dto.limit ?? 50)
        );
    }


    @Get('stats')
    getStats() { return this.queryBus.execute(new GetAccountStatsQuery()); }

    @Get('top')
    getTopAccounts(@Query('n') n: string) {
        return this.queryBus.execute(new GetTopAccountsQuery(Number(n) || 3));
    }
    @Get('top/orm')
    getTopAccountsOrm(@Query('n') n: string) {
        return this.queryBus.execute(new GetTopAccountsOrmQuery(Number(n) || 3));
    }


    @Get('benchmark')
    getBenchmark() {
        return this.queryBus.execute(new GetBenchmarkQuery());
    }


}