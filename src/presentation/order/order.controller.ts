import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateOrderDto } from "./dto/create-order.dto";
import { OrderEntity } from "src/domain/order/order.entity";

import { CreateOrderCommand } from "src/application/order/commands/create-order/create-order.command";
import { OrderStatus } from "generated/prisma/enums";
import { GetOrdersByStatusQuery } from "src/application/order/query/get-by-status.query";


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
    @Get('status')
    getByStatus(@Query('status') status: OrderStatus) {
        return this.queryBus.execute(new GetOrdersByStatusQuery(status));
    }

}
