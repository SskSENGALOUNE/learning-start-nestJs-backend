import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

// Infrastructure
import { CustomerRepository } from '../infrastructure/customer/customer.repository';

// Presentation
import { CustomerController } from '../presentation/customer/customer.controller';

// Command Handlers
import { CreateCustomerHandler } from '../application/customer/commands/create-customer/create-customer.handler';
import { UpsertCustomerHandler } from '../application/customer/commands/upsert-customer/upsert-customer.handler';
import { GetAllCustomersHandler } from 'src/application/customer/query/get-all-customers.handler';

const CommandHandlers = [CreateCustomerHandler, UpsertCustomerHandler];
const QueryHandlers = [GetAllCustomersHandler];
@Module({
  imports: [CqrsModule],
  controllers: [CustomerController],
  providers: [CustomerRepository, ...CommandHandlers, ...QueryHandlers],
})
export class CutomerModule {}
