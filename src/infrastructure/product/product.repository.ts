import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ProductEntity } from '../../domain/product/product.entity';

@Injectable()
export class ProductRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(name?: string, page: number = 1, limit: number = 10): Promise<ProductEntity[]> {
        const records = await this.prisma.product.findMany({
            orderBy: { id: 'asc' },
            skip: (page - 1) * limit,
            take: limit,

        });
        return records.map(record => this.toDomain(record));
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

    private toDomain(record: { id: number; name: string; price: number }): ProductEntity {
        return new ProductEntity(record.id, record.name, record.price);
    }
}
