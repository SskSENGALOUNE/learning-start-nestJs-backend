import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllCustomersQuery } from './get-all-customers.query';
import { CustomerRepository } from '../../../infrastructure/customer/customer.repository';
import { CustomerEntity } from '../../../domain/customer/customer.entity';

@QueryHandler(GetAllCustomersQuery)
export class GetAllCustomersHandler implements IQueryHandler<GetAllCustomersQuery> {
    constructor(private readonly customerRepository: CustomerRepository) {}

    async execute(): Promise<CustomerEntity[]> {
        return this.customerRepository.findAll();
    }
}
