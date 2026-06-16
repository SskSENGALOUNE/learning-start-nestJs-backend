import { Body, Controller, Get, Post } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { CategoryEntity } from "src/domain/category/category.entity";
import { CreateCategoryCommand } from "src/application/category/commands/create-category/create-category.command";
import { GetAllCategoriesQuery } from "src/application/category/query/get-all-categories.query";

@Controller('category')
export class CategoryController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus
    ) { }


    @Post()
    createCategory(@Body() dto: CreateCategoryDto): Promise<CategoryEntity> {
        return this.commandBus.execute(new CreateCategoryCommand(dto.name))
    }

    @Get()
    getAll(): Promise<CategoryEntity> {
        return this.queryBus.execute(new GetAllCategoriesQuery())
    }
}