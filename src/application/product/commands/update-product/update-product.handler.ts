import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateProductCommand } from './update-product.command';
import { ProductRepository } from '../../../../infrastructure/product/product.repository';
import { ProductEntity } from '../../../../domain/product/product.entity';

@CommandHandler(UpdateProductCommand)
export class UpdateProductHandler implements ICommandHandler<UpdateProductCommand> {
    constructor(private readonly productRepository: ProductRepository) { }

    async execute(command: UpdateProductCommand): Promise<ProductEntity> {
        const product = await this.productRepository.findById(command.id);
        if (!product) {
            throw new NotFoundException(`Product with id ${command.id} not found`);
        }

        if (command.name !== undefined) {
            product.rename(command.name);
        }
        if (command.price !== undefined) {
            product.changePrice(command.price);
        }

        return this.productRepository.update(product);
    }
}
