import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetAllCategoriesQuery } from "./get-all-categories.query";
import { CategoryRepository } from "src/infrastructure/category/category.repository";
import { CategoryEntity } from "src/domain/category/category.entity";

@QueryHandler(GetAllCategoriesQuery)
export class GetAllCategoriesHandler implements IQueryHandler<GetAllCategoriesQuery> {
    constructor(private readonly categoryRepository: CategoryRepository) { }

    execute(): Promise<CategoryEntity[]> {
        return this.categoryRepository.findAll();
    }
}