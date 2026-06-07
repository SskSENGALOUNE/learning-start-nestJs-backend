import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProductByIdQuery } from './get-product-by-id.query';
import { ProductRepository } from '../../../../infrastructure/product/product.repository';
import { ProductEntity } from '../../../../domain/product/product.entity';

@QueryHandler(GetProductByIdQuery)
export class GetProductByIdHandler implements IQueryHandler<GetProductByIdQuery> {
    constructor(private readonly productRepository: ProductRepository) { }

    async execute(query: GetProductByIdQuery): Promise<ProductEntity> {
        const product = await this.productRepository.findById(query.id);
        if (!product) {
            throw new NotFoundException(`Product with id ${query.id} not found`);
        }

        return product;
    }
}
