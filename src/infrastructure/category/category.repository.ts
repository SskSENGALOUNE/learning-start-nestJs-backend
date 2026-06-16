import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CategoryEntity } from 'src/domain/category/category.entity';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prisma: PrismaService) { }

  async create(name: string): Promise<CategoryEntity> {
    const record = await this.prisma.category.create({ data: { name } });
    return this.toDomain(record);
  }

  async findByName(name: string): Promise<CategoryEntity | null> {
    const record = await this.prisma.category.findFirst({ where: { name } });
    return record ? this.toDomain(record) : null;
  }

  async findAll(): Promise<CategoryEntity[]> {
    const record = await this.prisma.category.findMany()
    return record.map((r) => new CategoryEntity(r.id, r.name))
  }

  private toDomain(record: { id: number; name: string }): CategoryEntity {
    return new CategoryEntity(record.id, record.name);
  }
}
