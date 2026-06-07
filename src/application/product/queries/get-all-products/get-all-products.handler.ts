import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllProductsQuery } from './get-all-products.query';
import { ProductRepository } from '../../../../infrastructure/product/product.repository';
import { ProductEntity } from '../../../../domain/product/product.entity';
import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';

@QueryHandler(GetAllProductsQuery)
export class GetAllProductsHandler implements IQueryHandler<GetAllProductsQuery> {
    constructor(private readonly productRepository: ProductRepository) { }

    async execute(query: GetAllProductsQuery): Promise<PaginatedResult<ProductEntity>> {
        if (query.name) {
            return this.productRepository.findAll(query.name, query.page, query.limit);
        }
        return this.productRepository.findAll(query.name, query.page, query.limit);
    }

}

