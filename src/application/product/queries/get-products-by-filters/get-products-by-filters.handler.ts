import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProductsByFiltersQuery } from './get-products-by-filters.query';
import { ProductRepository } from '../../../../infrastructure/product/product.repository';
import { ProductEntity } from '../../../../domain/product/product.entity';

@QueryHandler(GetProductsByFiltersQuery)
export class GetProductsByFiltersHandler
  implements IQueryHandler<GetProductsByFiltersQuery>
{
  constructor(private readonly productRepository: ProductRepository) {}

  execute(query: GetProductsByFiltersQuery): Promise<ProductEntity[]> {
    return this.productRepository.findByFilters({
      minPrice: query.minPrice,
      minStock: query.minStock,
    });
  }
}
