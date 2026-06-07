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

    @Get('sort')
    sortProductByPrice(@Query('order') order: 'asc' | 'desc' = 'asc'): Promise<ProductEntity[]> {
        return this.queryBus.execute(new SortProductsByPriceQuery(order));
    }

    @Get(':id')
    getProductById(@Param('id') id: string): Promise<ProductEntity> {
        return this.queryBus.execute(new GetProductByIdQuery(Number(id)));
    }

    @Post()
    createProduct(@Body() dto: CreateProductDto): Promise<ProductEntity> {
        return this.commandBus.execute(new CreateProductCommand(dto.name, dto.price));
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
