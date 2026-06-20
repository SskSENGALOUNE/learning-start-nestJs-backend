import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

// Infrastructure
import { ProductRepository } from '../infrastructure/product/product.repository';

// Presentation
import { ProductController } from '../presentation/product/product.controller';

// Command Handlers
import { CreateProductHandler } from '../application/product/commands/create-product/create-product.handler';
import { UpdateProductHandler } from '../application/product/commands/update-product/update-product.handler';
import { DeleteProductHandler } from '../application/product/commands/delete-product/delete-product.handler';

// Query Handlers
import { GetAllProductsHandler } from '../application/product/queries/get-all-products/get-all-products.handler';
import { GetProductByIdHandler } from '../application/product/queries/get-product-by-id/get-product-by-id.handler';
import { GetProductsByPriceRangeHandler } from '../application/product/queries/get-products-by-price-range/get-products-by-price-range.handler';
import { SortProductsByPriceHandler } from '../application/product/queries/sort-products-by-price/sort-products-by-price.handler';
import { GetProductStatsHandler } from '../application/product/queries/get-product-stats/get-product-stats.handler';
import { GetProductsByFiltersHandler } from '../application/product/queries/get-products-by-filters/get-products-by-filters.handler';
import { GetProductsByCategoryHandler } from '../application/product/queries/get-products-by-category.ts/get-products-by-category.handler';

const CommandHandlers = [
  CreateProductHandler,
  UpdateProductHandler,
  DeleteProductHandler,
];

const QueryHandlers = [
  GetAllProductsHandler,
  GetProductByIdHandler,
  GetProductsByPriceRangeHandler,
  SortProductsByPriceHandler,
  GetProductStatsHandler,
  GetProductsByFiltersHandler,
  GetProductsByCategoryHandler,
];

@Module({
  imports: [CqrsModule],
  controllers: [ProductController],
  providers: [ProductRepository, ...CommandHandlers, ...QueryHandlers],
})
export class ProductModule {}
