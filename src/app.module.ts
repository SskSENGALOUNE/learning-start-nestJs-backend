import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { CategoryModule } from './category.module';
import { CutomerModule } from './customer.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from './common/interfaces/transform.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { OrderModule } from './order.module';

@Module({
  imports: [PrismaModule, ProductModule, CategoryModule, CutomerModule, OrderModule],
  controllers: [AppController],
  providers: [AppService, { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },],
})
export class AppModule { }
