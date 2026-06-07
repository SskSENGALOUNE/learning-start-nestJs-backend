import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteProductCommand } from './delete-product.command';
import { ProductRepository } from '../../../../infrastructure/product/product.repository';

@CommandHandler(DeleteProductCommand)
export class DeleteProductHandler implements ICommandHandler<DeleteProductCommand> {
    constructor(private readonly productRepository: ProductRepository) { }

    async execute(command: DeleteProductCommand): Promise<void> {
        const product = await this.productRepository.findById(command.id);
        if (!product) {
            throw new NotFoundException(`Product with id ${command.id} not found`);
        }

        await this.productRepository.remove(product.id);
    }
}
