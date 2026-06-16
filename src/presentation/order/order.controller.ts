import { Body, Controller, Post } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateOrderDto } from "./dto/create-order.dto";
import { OrderEntity } from "src/domain/order/order.entity";

import { CreateOrderCommand } from "src/application/order/commands/create-order/create-order.command";


@Controller('order')
export class OrderController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) { }

    @Post()
    createOrder(@Body() dto: CreateOrderDto): Promise<OrderEntity> {

        return this.commandBus.execute(new CreateOrderCommand(dto.customerId, dto.items))
    }
}
