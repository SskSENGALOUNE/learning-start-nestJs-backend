import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetOrderByIdQuery } from "./get-by-id.query";
import { OrderRepository } from "src/infrastructure/order/order.repository";
import { OrderDetailResponse } from "src/presentation/order/dto/order-detail.response";

@QueryHandler(GetOrderByIdQuery)
export class GetOrderByIdHandler implements IQueryHandler<GetOrderByIdQuery> {
    constructor(private readonly repo: OrderRepository) { }


    execute(query: GetOrderByIdQuery): Promise<OrderDetailResponse> {
        return this.repo.findByIdWithRelations(query.id)
    }
}



// @QueryHandler(GetOrdersByStatusQuery)
// export class GetOrdersByStatusHandler implements IQueryHandler<GetOrdersByStatusQuery> {
//     constructor(private readonly repo: OrderRepository) { }

//     execute(query: GetOrdersByStatusQuery): Promise<OrderEntity[]> {
//         return this.repo.findByStatus(query.status)
//     }
// }