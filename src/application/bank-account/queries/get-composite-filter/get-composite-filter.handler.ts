import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetCompositeFilterQuery } from "./get-composite-filter.query";
import { BankAccountRepository } from "src/infrastructure/bank-account/bank-account.repository";

@QueryHandler(GetCompositeFilterQuery)
export class GetCompositeFilterHandler implements IQueryHandler<GetCompositeFilterQuery> {
    constructor(private readonly repo: BankAccountRepository) { }

    async execute(query: GetCompositeFilterQuery) {
        const [withComposite, withoutComposite] = await Promise.all([
            this.repo.findByCompositeIndex(query.accountType, query.isActive, query.limit),
            this.repo.findByIsActiveOnly(query.isActive, query.limit),
        ]);

        return {
            composite_index: { ...withComposite },      // accountType + isActive
            no_composite_index: { ...withoutComposite }, // isActive only
            note: 'composite index @@index([accountType, isActive]) — leading column คือ accountType',
        };
    }
}
