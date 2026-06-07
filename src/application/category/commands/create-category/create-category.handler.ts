import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateCategoryCommand } from "./create-category.command";
import { CategoryRepository } from '../../../../infrastructure/category/category.repository';
import { CategoryEntity } from '../../../../domain/category/category.entity';

@CommandHandler(CreateCategoryCommand)
export class CreateCategoryHandler implements ICommandHandler<CreateCategoryCommand> {
    constructor(private readonly categoryRepository: CategoryRepository) { }

    async execute(command: CreateCategoryCommand): Promise<CategoryEntity> {
        return this.categoryRepository.create(command.name);

    }


}