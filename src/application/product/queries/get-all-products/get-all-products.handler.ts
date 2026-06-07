import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllProductsQuery } from './get-all-products.query';
import { ProductRepository } from '../../../../infrastructure/product/product.repository';
import { ProductEntity } from '../../../../domain/product/product.entity';

@QueryHandler(GetAllProductsQuery)
export class GetAllProductsHandler implements IQueryHandler<GetAllProductsQuery> {
    constructor(private readonly productRepository: ProductRepository) { }

    async execute(query: GetAllProductsQuery): Promise<ProductEntity[]> {
        const products = await this.productRepository.findAll();

        if (query.name) {
            return products.filter(product => product.name.includes(query.name as string));
        }

        return products;
    }
}
