import { OrderStatus } from "generated/prisma/enums";

export class GetOrdersByStatusQuery {
    constructor(public readonly status: OrderStatus) { }
}