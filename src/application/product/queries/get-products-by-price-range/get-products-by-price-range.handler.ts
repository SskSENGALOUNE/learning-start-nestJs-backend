import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProductsByPriceRangeQuery } from './get-products-by-price-range.query';
import { ProductRepository } from '../../../../infrastructure/product/product.repository';
import { ProductEntity } from '../../../../domain/product/product.entity';

@QueryHandler(GetProductsByPriceRangeQuery)
export class GetProductsByPriceRangeHandler implements IQueryHandler<GetProductsByPriceRangeQuery> {
    constructor(private readonly productRepository: ProductRepository) { }

    async execute(query: GetProductsByPriceRangeQuery): Promise<ProductEntity[]> {
        return this.productRepository.findByPriceRange(query.minPrice, query.maxPrice);
    }
}
