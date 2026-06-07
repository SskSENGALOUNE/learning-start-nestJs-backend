import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { CategoryModule } from './category.module';

@Module({
  imports: [PrismaModule, ProductModule, CategoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
