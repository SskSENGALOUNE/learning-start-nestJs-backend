
// presentation/order/dto/order-detail.response.ts
export class OrderDetailResponse {
    id: number;
    status: string;
    customer: { id: number; name: string; email: string };
    items: { productName: string; quantity: number; price: number }[];
}