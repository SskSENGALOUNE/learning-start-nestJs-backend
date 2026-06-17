import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(process.env.PORT ?? 3000);
  console.log(
    `Application is running on: http://localhost:${process.env.PORT ?? 3000}`,
  );
  console.log(`For APi on: http://localhost:${process.env.PORT ?? 3000}/api`);
  console.log(
    `Feature product http://localhost:${process.env.PORT ?? 3000}/api/product`,
  );
  console.log(
    `Feature category http://localhost:${process.env.PORT ?? 3000}/api/category`,
  );
  console.log(
    `Feature customer http://localhost:${process.env.PORT ?? 3000}/api/customer`,
  );
  console.log(
    `Feature order http://localhost:${process.env.PORT ?? 3000}/api/order`,
  );
}
bootstrap();
