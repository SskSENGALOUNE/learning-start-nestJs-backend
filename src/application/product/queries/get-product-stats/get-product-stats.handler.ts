import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProductStatsQuery } from './get-product-stats.query';
import { ProductRepository } from '../../../../infrastructure/product/product.repository';

@QueryHandler(GetProductStatsQuery)
export class GetProductStatsHandler implements IQueryHandler<GetProductStatsQuery> {
    constructor(private readonly productRepository: ProductRepository) { }

    async execute(query: GetProductStatsQuery) {
        return this.productRepository.getStats();
    }
}
