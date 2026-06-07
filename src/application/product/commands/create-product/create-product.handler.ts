import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateProductCommand } from './create-product.command';
import { ProductRepository } from '../../../../infrastructure/product/product.repository';
import { ProductEntity } from '../../../../domain/product/product.entity';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler implements ICommandHandler<CreateProductCommand> {
    constructor(private readonly productRepository: ProductRepository) { }

    async execute(command: CreateProductCommand): Promise<ProductEntity> {
        return this.productRepository.create(command.name, command.price);
    }
}
