import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetAccountStatsQuery } from "./get-account-stats.query";
import { BankAccountRepository } from "src/infrastructure/bank-account/bank-account.repository";

@QueryHandler(GetAccountStatsQuery)
export class GetAccountStatsHandler implements IQueryHandler<GetAccountStatsQuery> {
    constructor(private readonly repo: BankAccountRepository) { }

    async execute(query: GetAccountStatsQuery) {
        const [orm, raw] = await Promise.all([
            this.repo.getStatsPrismaOrm(),
            this.repo.getStatsRawSql(),
        ]);
        return {
            prisma_orm: { ms: orm.ms, data: orm.data },
            raw_sql: { ms: raw.ms, data: raw.data },
        };
    }
}