import { Body, Controller, Post } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { CategoryEntity } from "src/domain/category/category.entity";
import { CreateCategoryCommand } from "src/application/category/commands/create-category/create-category.command";

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
}