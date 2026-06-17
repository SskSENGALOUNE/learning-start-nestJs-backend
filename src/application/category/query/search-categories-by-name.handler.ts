import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { SearchCategoriesByNameQuery } from "./search-categories-by-name.query";
import { CategoryRepository } from "src/infrastructure/category/category.repository";


@QueryHandler(SearchCategoriesByNameQuery)
export class SearchCategoriesByNameHandler
    implements IQueryHandler<SearchCategoriesByNameQuery> {
    constructor(private readonly repo: CategoryRepository) { }

    execute(query: SearchCategoriesByNameQuery) {
        return this.repo.searchByName(query.keyword);
    }
}

