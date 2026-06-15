import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { OrderController } from "./presentation/order/order.controller";
import { OrderRepository } from "./infrastructure/order/order.repository";
import { CustomerRepository } from "./infrastructure/customer/customer.repository";
import { ProductRepository } from "./infrastructure/product/product.repository";
import { CreateOrderHandler } from "./application/order/commands/create-order/create-order.handler";


const CommandHandlers = [CreateOrderHandler];


@Module({
    imports: [CqrsModule],
    controllers: [OrderController],
    providers: [
        OrderRepository,
        CustomerRepository,
        ProductRepository,
        ...CommandHandlers,
    ],
})
export class OrderModule { }
