import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCategoryByIdQuery } from './get-category-by-id.query';
import { CategoryRepository } from 'src/infrastructure/category/category.repository';
import { CategoryEntity } from 'src/domain/category/category.entity';
import { NotFoundException } from '@nestjs/common';

@QueryHandler(GetCategoryByIdQuery)
export class GetCategoryByIdHandler implements IQueryHandler<GetCategoryByIdQuery> {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(query: GetCategoryByIdQuery): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findById(query.id);
    if (!category) {
      throw new NotFoundException(`Category with id ${query.id} not found`);
    }
    return category;
  }
}
