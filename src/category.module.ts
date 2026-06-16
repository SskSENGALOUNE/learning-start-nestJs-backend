import { Module } from "@nestjs/common";
import { CreateCategoryHandler } from "./application/category/commands/create-category/create-category.handler";
import { CqrsModule } from "@nestjs/cqrs";
import { CategoryController } from "./presentation/category/category.controller";
import { CategoryRepository } from "./infrastructure/category/category.repository";
import { GetAllCategoriesHandler } from "./application/category/query/get-all-categories.handler";

const CommandHandlers = [CreateCategoryHandler, GetAllCategoriesHandler];

@Module({
    imports: [CqrsModule],
    controllers: [CategoryController],
    providers: [CategoryRepository, ...CommandHandlers],
})
export class CategoryModule { }
