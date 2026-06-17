import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { OrderEntity, OrderItemEntity } from 'src/domain/order/order.entity';
import { CreateOrderItem } from 'src/application/order/commands/create-order/create-order.command';
import { OrderStatus } from 'generated/prisma/enums';

@Injectable()
export class OrderRepository {
  constructor(private readonly prisma: PrismaService) { }

  async create(
    customerId: number,
    items: CreateOrderItem[],
  ): Promise<OrderEntity> {
    const record = await this.prisma.order.create({
      data: {
        customerId,
        orderItems: {
          create: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
        },
      },
      include: {
        orderItems: {
          include: { product: true },
        },
      },
    });

    return this.toDomain(record);
  }

  async findByStatus(status: OrderStatus): Promise<OrderEntity[]> {
    const records = await this.prisma.order.findMany({
      where: { status },
      include: {
        orderItems: {
          include: { product: true }
        }
      }
    })

    return records.map(r => this.toDomain(r))
  }

  private toDomain(record: {
    id: number;
    customerId: number;
    status: string,
    createdAt: Date
    orderItems: {
      id: number;
      productId: number;
      quantity: number;
      product: { price: number; name: string };
    }[];
  }): OrderEntity {
    return new OrderEntity(
      record.id,
      record.customerId,
      record.status,
      record.createdAt,
      record.orderItems.map(
        (i) =>
          new OrderItemEntity(
            i.id,
            i.productId,
            i.quantity,
            i.product.price,
            i.product.name,
          ),
      ),
    );
  }
}
