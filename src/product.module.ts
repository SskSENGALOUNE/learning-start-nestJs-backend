import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ProductController } from './presentation/product/product.controller';
import { ProductRepository } from './infrastructure/product/product.repository';

import { CreateProductHandler } from './application/product/commands/create-product/create-product.handler';
import { UpdateProductHandler } from './application/product/commands/update-product/update-product.handler';
import { DeleteProductHandler } from './application/product/commands/delete-product/delete-product.handler';

import { GetAllProductsHandler } from './application/product/queries/get-all-products/get-all-products.handler';
import { GetProductByIdHandler } from './application/product/queries/get-product-by-id/get-product-by-id.handler';
import { GetProductsByPriceRangeHandler } from './application/product/queries/get-products-by-price-range/get-products-by-price-range.handler';
import { SortProductsByPriceHandler } from './application/product/queries/sort-products-by-price/sort-products-by-price.handler';

const CommandHandlers = [CreateProductHandler, UpdateProductHandler, DeleteProductHandler];
const QueryHandlers = [
    GetAllProductsHandler,
    GetProductByIdHandler,
    GetProductsByPriceRangeHandler,
    SortProductsByPriceHandler,
];

@Module({
    imports: [CqrsModule],
    controllers: [ProductController],
    providers: [ProductRepository, ...CommandHandlers, ...QueryHandlers],
})
export class ProductModule { }
