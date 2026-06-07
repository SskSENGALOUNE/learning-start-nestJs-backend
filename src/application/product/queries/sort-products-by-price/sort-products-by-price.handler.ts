import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SortProductsByPriceQuery } from './sort-products-by-price.query';
import { ProductRepository } from '../../../../infrastructure/product/product.repository';
import { ProductEntity } from '../../../../domain/product/product.entity';

@QueryHandler(SortProductsByPriceQuery)
export class SortProductsByPriceHandler implements IQueryHandler<SortProductsByPriceQuery> {
    constructor(private readonly productRepository: ProductRepository) { }

    async execute(query: SortProductsByPriceQuery): Promise<ProductEntity[]> {
        return this.productRepository.findAllSortedByPrice(query.order);
    }
}
