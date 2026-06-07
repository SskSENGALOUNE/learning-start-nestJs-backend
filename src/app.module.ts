import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { CategoryModule } from './category.module';
import { CutomerModule } from './customer.module';

@Module({
  imports: [PrismaModule, ProductModule, CategoryModule, CutomerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
