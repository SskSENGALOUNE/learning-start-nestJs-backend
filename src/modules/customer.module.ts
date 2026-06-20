import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

// Infrastructure
import { CustomerRepository } from '../infrastructure/customer/customer.repository';

// Presentation
import { CustomerController } from '../presentation/customer/customer.controller';

// Command Handlers
import { CreateCustomerHandler } from '../application/customer/commands/create-customer/create-customer.handler';
import { UpsertCustomerHandler } from '../application/customer/commands/upsert-customer/upsert-customer.handler';

const CommandHandlers = [CreateCustomerHandler, UpsertCustomerHandler];

@Module({
  imports: [CqrsModule],
  controllers: [CustomerController],
  providers: [CustomerRepository, ...CommandHandlers],
})
export class CutomerModule {}
