import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

// Infrastructure
import { CategoryRepository } from '../infrastructure/category/category.repository';

// Presentation
import { CategoryController } from '../presentation/category/category.controller';

// Command Handlers
import { CreateCategoryHandler } from '../application/category/commands/create-category/create-category.handler';

// Query Handlers
import { GetAllCategoriesHandler } from '../application/category/query/get-all-categories.handler';
import { GetCategoryByIdHandler } from '../application/category/query/get-category-by-id.handler';
import { SearchCategoriesByNameHandler } from '../application/category/query/search-categories-by-name.handler';

const CommandHandlers = [CreateCategoryHandler];

const QueryHandlers = [
  GetAllCategoriesHandler,
  GetCategoryByIdHandler,
  SearchCategoriesByNameHandler,
];

@Module({
  imports: [CqrsModule],
  controllers: [CategoryController],
  providers: [CategoryRepository, ...CommandHandlers, ...QueryHandlers],
})
export class CategoryModule {}
