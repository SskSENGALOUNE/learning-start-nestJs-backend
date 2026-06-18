import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetProductsByCategoryQuery } from "./get-products-by-category.query";
import { ProductRepository } from "src/infrastructure/product/product.repository";
import { ProductEntity } from "src/domain/product/product.entity";

@QueryHandler(GetProductsByCategoryQuery)
export class GetProductsByCategoryHandler implements IQueryHandler<GetProductsByCategoryQuery> {
    constructor(private readonly productRepository: ProductRepository) { }

    execute(query: GetProductsByCategoryQuery) {
        return this.productRepository.countByCategory();
    }

}