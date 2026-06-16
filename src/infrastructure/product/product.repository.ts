import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ProductEntity } from '../../domain/product/product.entity';
import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';

@Injectable()
export class ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    name?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResult<ProductEntity>> {
    const where = name ? { name: { contains: name } } : {};
    const [records, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        orderBy: { id: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);
    return {
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      items: records.map((record) => this.toDomain(record)),
    };
  }
  async findByPriceRange(
    minPrice: number,
    maxPrice: number,
  ): Promise<ProductEntity[]> {
    const records = await this.prisma.product.findMany({
      where: { price: { gte: minPrice, lte: maxPrice } },
    });
    return records.map((record) => this.toDomain(record));
  }
  async findAllSortedByPrice(order: 'asc' | 'desc'): Promise<ProductEntity[]> {
    const records = await this.prisma.product.findMany({
      orderBy: { price: order },
    });
    return records.map((record) => this.toDomain(record));
  }
  async getStats(): Promise<{
    totalValue: number;
    totalProducts: number;
    averagePrice: number;
  }> {
    const result = await this.prisma.product.aggregate({
      _sum: { price: true },
      _count: { _all: true },
      _avg: { price: true },
    });

    return {
      totalValue: result._sum.price ?? 0,
      totalProducts: result._count._all,
      averagePrice: result._avg.price ?? 0,
    };
  }

  async findById(id: number): Promise<ProductEntity | null> {
    const record = await this.prisma.product.findUnique({ where: { id } });
    return record ? this.toDomain(record) : null;
  }

  async create(name: string, price: number): Promise<ProductEntity> {
    const record = await this.prisma.product.create({ data: { name, price } });
    return this.toDomain(record);
  }

  async update(product: ProductEntity): Promise<ProductEntity> {
    const record = await this.prisma.product.update({
      where: { id: product.id },
      data: { name: product.name, price: product.price },
    });
    return this.toDomain(record);
  }

  async remove(id: number): Promise<void> {
    await this.prisma.product.delete({ where: { id } });
  }

    async create(name: string, price: number, stock: number): Promise<ProductEntity> {
        const record = await this.prisma.product.create({ data: { name, price, stock } });

        return this.toDomain(record);
    }

    async update(product: ProductEntity): Promise<ProductEntity> {
        const record = await this.prisma.product.update({
            where: { id: product.id },
            data: { name: product.name, price: product.price },
        });
        return this.toDomain(record);
    }

    async remove(id: number): Promise<void> {
        await this.prisma.product.delete({ where: { id } });
    }

    private toDomain(record: { id: number; name: string; price: number, stock: number }): ProductEntity {
        return new ProductEntity(record.id, record.name, record.price, record.stock);
    }
}
