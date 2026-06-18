import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ProductEntity } from '../../domain/product/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductCommand } from '../../application/product/commands/create-product/create-product.command';
import { UpdateProductCommand } from '../../application/product/commands/update-product/update-product.command';
import { DeleteProductCommand } from '../../application/product/commands/delete-product/delete-product.command';
import { GetAllProductsQuery } from '../../application/product/queries/get-all-products/get-all-products.query';
import { GetProductByIdQuery } from '../../application/product/queries/get-product-by-id/get-product-by-id.query';
import { GetProductsByPriceRangeQuery } from '../../application/product/queries/get-products-by-price-range/get-products-by-price-range.query';
import { SortProductsByPriceQuery } from '../../application/product/queries/sort-products-by-price/sort-products-by-price.query';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { GetProductStatsQuery } from 'src/application/product/queries/get-product-stats/get-product-stats.query';
import { CreateProductResponseDto } from './dto/create-product-response.dto';
import { GetProductsByFiltersQuery } from '../../application/product/queries/get-products-by-filters/get-products-by-filters.query';
import { FilterProductDto } from './dto/filter-product.dto';
import { GetProductsByCategoryQuery } from 'src/application/product/queries/get-products-by-category.ts/get-products-by-category.query';

@Controller('product')
export class ProductController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) { }

    @Get()
    getProductAll(
        @Query('name') name?: string,
        @Query() pagination?: PaginationDto
    ): Promise<ProductEntity[]> {
        return this.queryBus.execute(new GetAllProductsQuery(name, pagination?.page, pagination?.limit));
    }

    @Get('search')
    getProductByPriceRange(
        @Query('minPrice') minPrice: string,
        @Query('maxPrice') maxPrice: string,
    ): Promise<ProductEntity[]> {
        return this.queryBus.execute(new GetProductsByPriceRangeQuery(Number(minPrice), Number(maxPrice)));
    }
    @Get('stats')
    getProductStats() {
        return this.queryBus.execute(new GetProductStatsQuery)
    }

    @Get('sort')
    sortProductByPrice(@Query('order') order: 'asc' | 'desc' = 'asc'): Promise<ProductEntity[]> {
        return this.queryBus.execute(new SortProductsByPriceQuery(order));
    }

    @Get('filter')
    getProductByFilters(@Query() dto: FilterProductDto): Promise<ProductEntity[]> {
        return this.queryBus.execute(new GetProductsByFiltersQuery(dto.minPrice, dto.minStock));
    }

    @Get('by-category')
    getByCategory() {
        return this.queryBus.execute(new GetProductsByCategoryQuery())
    }

    @Get(':id')
    getProductById(@Param('id') id: string): Promise<ProductEntity> {
        return this.queryBus.execute(new GetProductByIdQuery(Number(id)));
    }

    @Post()
    async createProduct(@Body() dto: CreateProductDto): Promise<CreateProductResponseDto> {
        const product = await this.commandBus.execute(
            new CreateProductCommand(dto.name, dto.price, dto.stock)
        );
        return {
            id: product.id,
            name: product.name,
            price: product.price,
        };

        // return this.commandBus.execute(new CreateProductCommand(dto.name, dto.price, dto.stock));
    }

    @Patch(':id')
    updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto): Promise<ProductEntity> {
        return this.commandBus.execute(new UpdateProductCommand(Number(id), dto.name, dto.price));
    }

    @Delete(':id')
    deleteProduct(@Param('id') id: string): Promise<void> {
        return this.commandBus.execute(new DeleteProductCommand(Number(id)));
    }
}
