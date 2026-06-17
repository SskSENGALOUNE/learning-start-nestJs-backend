import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetOrdersByStatusQuery } from "./get-by-status.query";
import { OrderRepository } from "src/infrastructure/order/order.repository";
import { OrderEntity } from "src/domain/order/order.entity";

@QueryHandler(GetOrdersByStatusQuery)
export class GetOrdersByStatusHandler implements IQueryHandler<GetOrdersByStatusQuery> {
    constructor(private readonly repo: OrderRepository) { }

    execute(query: GetOrdersByStatusQuery): Promise<OrderEntity[]> {
        return this.repo.findByStatus(query.status)
    }
}