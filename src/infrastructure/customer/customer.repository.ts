import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/prisma/prisma.service";
import { CustomerEntity } from "src/domain/customer/customer.entity";

@Injectable()
export class CustomerRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(name: string, email: string): Promise<CustomerEntity> {
        const record = await this.prisma.customer.create({ data: { name, email } });
        return this.toDomain(record);
    }
    async findByEmail(email: string): Promise<CustomerEntity | null> {
        const record = await this.prisma.customer.findFirst({ where: { email } });
        return record ? this.toDomain(record) : null;
    }


    private toDomain(record: { id: number; email: string; name: string }): CustomerEntity {
        return new CustomerEntity(record.id, record.email, record.name);
    }
}
