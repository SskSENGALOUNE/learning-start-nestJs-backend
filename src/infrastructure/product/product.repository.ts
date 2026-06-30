import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ProductEntity } from '../../domain/product/product.entity';
import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';
import { Prisma } from '../../../generated/prisma/client';



interface CreateProductInput {
  name: string,
  price: number,
  stock: number
}

@Injectable()
export class ProductRepository {
  constructor(private readonly prisma: PrismaService) { }
  private toDomain(record: {
    id: number;
    name: string;
    price: number;
    stock: number;
  }): ProductEntity {
    return new ProductEntity(
      record.id,
      record.name,
      record.price,
      record.stock,
    );
  }


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

  async countByCategory() {
    const result = await this.prisma.product.groupBy({
      by: ['categoryId'],
      _count: { id: true },
    });

    // ดึงชื่อ category มา map
    const categories = await this.prisma.category.findMany();

    return result.map(r => ({
      categoryName: categories.find(c => c.id === r.categoryId)?.name ?? 'ไม่มี category',
      count: r._count.id,
    }));
  }



  async findByFilters(filters: {
    minPrice?: number;
    minStock?: number;
  }): Promise<ProductEntity[]> {
    const where: Prisma.ProductWhereInput = {};

    if (filters.minPrice !== undefined) {
      where.price = { gte: filters.minPrice };
    }
    if (filters.minStock !== undefined) {
      where.stock = { gte: filters.minStock };
    }

    const records = await this.prisma.product.findMany({ where });
    return records.map((record) => this.toDomain(record));
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

  async findTop5(topN: number): Promise<ProductEntity[]> {
    const records = await this.prisma.product.findMany({
      orderBy: { price: "desc" },
      take: topN,
    })
    return records.map((record) => this.toDomain(record))
  }

  async findOutOfStock(): Promise<ProductEntity[]> {
    const records = await this.prisma.product.findMany({
      where: { stock: 0 },
    });
    return records.map((record) => this.toDomain(record));
  }

  async findExpensive(minPrice: number): Promise<ProductEntity[]> {
    const records = await this.prisma.product.findMany({
      where: {
        price: { gt: minPrice }
      }
    })
    return records.map((record) => { return this.toDomain(record) })
  }

  async findByNameKeyword(keyword: string): Promise<ProductEntity[]> {
    const records = await this.prisma.product.findMany({
      where: {
        name: { contains: keyword }
      }
    })
    return records.map((record) => { return this.toDomain(record) })
  }


  async updateStock(id: number, newStock: number): Promise<ProductEntity> {
    const record = await this.prisma.product.update({
      where: { id },
      data: { stock: newStock }
    })
    return this.toDomain(record)
  }

  async deleteProduct(id: number): Promise<void> {
    const record = await this.prisma.product.delete({
      where: { id }
    })
  }


  async findAffordableInStock(maxPrice: number): Promise<ProductEntity[]> {
    const records = await this.prisma.product.findMany({
      where: {
        stock: { gt: 0 },
        price: { lte: maxPrice }
      }
    })
    return records.map((record) => this.toDomain(record))
  }

  async findLowestStock(topN: number): Promise<ProductEntity[]> {
    const records = await this.prisma.product.findMany({
      orderBy: { stock: 'asc' },
      take: topN
    })
    return records.map((record) => this.toDomain(record))
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

  async create(
    name: string,
    price: number,
    stock: number,
  ): Promise<ProductEntity> {
    const record = await this.prisma.product.create({
      data: { name, price, stock },
    });
    return this.toDomain(record);
  }

  async update(product: ProductEntity): Promise<ProductEntity> {
    const record = await this.prisma.product.update({
      where: { id: product.id },
      data: { name: product.name, price: product.price, stock: product.stock },
    });
    return this.toDomain(record);
  }



  async createProduct(input: CreateProductInput): Promise<ProductEntity> {
    const data = await this.prisma.product.create({
      data: input
    })
    return this.toDomain(data)
  }




  async remove(id: number): Promise<void> {
    await this.prisma.product.delete({ where: { id } });
  }

  async findByCategorySorted(categoryId: number): Promise<ProductEntity[]> {
    const records = await this.prisma.product.findMany({
      where: { categoryId: categoryId },    // กรอง categoryId
      orderBy: {
        price: 'desc'
      },    // เรียงราคา แพง→ถูก
    })
    return records.map((record) => this.toDomain(record));
  }

  async findPaginated(page: number, limit: number): Promise<ProductEntity[]> {
    const records = await this.prisma.product.findMany({
      skip: (page - 1) * limit,
      take: limit
    })
    return records.map((record) => this.toDomain(record))
  }


  async countOutOfStock(): Promise<number> {
    const total = await this.prisma.product.count({
      where: { stock: 0 }
    })
    return total
  }

  async getAveragePrice(): Promise<number> {
    const result = await this.prisma.product.aggregate({
      _avg: { price: true }
    })
    return result._avg.price ?? 0
  }

  async countGroupedByCategory() {
    const result = await this.prisma.product.groupBy({
      by: ['categoryId'],
      _count: { id: true }
    })

    return result
  }

}
