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

        // TODO: 2. ตรวจทุก product ใน items ว่ามีจริง ถ้าไม่พบ throw NotFoundException

        for (const item of command.items) {
            const product = await this.productRepository.findById(item.productId)
            if (!product) {
                throw new NotFoundException(`Product ${item.productId} not found`)
            }
        }

        // TODO: 3. เรียก this.orderRepository.create(...) แล้ว return ผลลัพธ์

        return this.orderRepository.create(command.customerId, command.items)
    }
}
