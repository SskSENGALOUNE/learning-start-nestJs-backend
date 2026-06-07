import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SortProductsByPriceQuery } from './sort-products-by-price.query';
import { ProductRepository } from '../../../../infrastructure/product/product.repository';
import { ProductEntity } from '../../../../domain/product/product.entity';

@QueryHandler(SortProductsByPriceQuery)
export class SortProductsByPriceHandler implements IQueryHandler<SortProductsByPriceQuery> {
    constructor(private readonly productRepository: ProductRepository) { }

    async execute(query: SortProductsByPriceQuery): Promise<ProductEntity[]> {
        const products = await this.productRepository.findAll();
        const direction = query.order === 'asc' ? 1 : -1;

        return products.toSorted((a, b) => (a.price - b.price) * direction);
    }
}
