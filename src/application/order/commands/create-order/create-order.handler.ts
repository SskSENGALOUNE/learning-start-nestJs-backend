import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateOrderCommand } from "./create-order.command";
import { OrderEntity } from "src/domain/order/order.entity";
import { OrderRepository } from "src/infrastructure/order/order.repository";
import { CustomerRepository } from "src/infrastructure/customer/customer.repository";
import { ProductRepository } from "src/infrastructure/product/product.repository";
import { NotFoundException } from "@nestjs/common";

@CommandHandler(CreateOrderCommand)
export class CreateOrderHandler implements ICommandHandler<CreateOrderCommand> {
    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly customerRepository: CustomerRepository,
        private readonly productRepository: ProductRepository,
    ) { }

    async execute(command: CreateOrderCommand): Promise<OrderEntity> {
        // TODO: 1. หา customer ด้วย this.customerRepository.findById(command.customerId)
        //          ถ้าไม่พบ throw NotFoundException

        const customer = await this.customerRepository.findById(command.customerId)
        if (!customer) {
            throw new NotFoundException("This custommer Not Found")
        }

        // TODO: 2. หา product ด้วย this.productRepository.findById(command.productId)
        //          ถ้าไม่พบ throw NotFoundException

        const product = await this.productRepository.findById(command.productId)
        if (!product) {
            throw new NotFoundException("Product not found")
        }

        // TODO: 3. เรียก this.orderRepository.create(...) แล้ว return ผลลัพธ์

        return this.orderRepository.create(command.customerId, command.productId, command.quantity)
    }
}
