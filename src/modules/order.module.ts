import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

// Infrastructure
import { OrderRepository } from '../infrastructure/order/order.repository';
import { CustomerRepository } from '../infrastructure/customer/customer.repository';
import { ProductRepository } from '../infrastructure/product/product.repository';

// Presentation
import { OrderController } from '../presentation/order/order.controller';

// Command Handlers
import { CreateOrderHandler } from '../application/order/commands/create-order/create-order.handler';

// Query Handlers
import { GetOrdersByStatusHandler } from '../application/order/query/get-by-status.handler';
import { GetOrderByIdHandler } from '../application/order/query/get-by-id.handler';

const CommandHandlers = [CreateOrderHandler];

const QueryHandlers = [GetOrdersByStatusHandler, GetOrderByIdHandler];

@Module({
  imports: [CqrsModule],
  controllers: [OrderController],
  providers: [
    OrderRepository,
    CustomerRepository,
    ProductRepository,
    ...CommandHandlers,
    ...QueryHandlers,
  ],
})
export class OrderModule {}
