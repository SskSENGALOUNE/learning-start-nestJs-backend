import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BankAccountRepository } from 'src/infrastructure/bank-account/bank-account.repository';
import { GetBenchmarkQuery } from './get-benchmark.query';

@QueryHandler(GetBenchmarkQuery)
export class GetBenchmarkQueryHandler implements IQueryHandler<GetBenchmarkQuery> {
    constructor(private readonly repo: BankAccountRepository) { }

    async execute(query: GetBenchmarkQuery) {
        const [offset, cursor, star, fields, orm, raw] = await Promise.all([
            this.repo.findWithOffset(4000, 20),
            this.repo.findWithCursor(undefined, 20),
            this.repo.findFilterSelectStar('BCEL', 50),
            this.repo.findFilterSelectFields('BCEL', 50),
            this.repo.getStatsPrismaOrm(),
            this.repo.getStatsRawSql(),
        ]);
        return {
            pagination: { offset_page4000: offset.ms, cursor_start: cursor.ms },
            filter: { select_star: star.ms, select_fields: fields.ms },
            aggregation: { prisma_orm: orm.ms, raw_sql: raw.ms },
        };
    }

}
