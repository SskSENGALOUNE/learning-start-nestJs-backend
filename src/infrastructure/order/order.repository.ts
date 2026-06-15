import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/prisma/prisma.service";
import { OrderEntity } from "src/domain/order/order.entity";

@Injectable()
export class OrderRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(customerId: number, productId: number, quantity: number): Promise<OrderEntity> {
        // TODO: this.prisma.order.create({ data: { customerId, productId, quantity } })
        //       แล้วแปลงผลลัพธ์ด้วย this.toDomain(record)

        const record = await this.prisma.order.create({
            data: {
                customerId,
                productId,
                quantity
            }
        });


        return this.toDomain(record);
    }

    private toDomain(record: { id: number; customerId: number; productId: number; quantity: number }): OrderEntity {
        // TODO: return new OrderEntity(record.id, record.customerId, record.productId, record.quantity)
        return new OrderEntity(record.id, record.customerId, record.productId, record.quantity)
    }
}
