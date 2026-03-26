import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

import * as dotenv from 'dotenv';
import * as path from 'path';

function loadEnv() {
  const mode = process.env.NODE_ENV;          // o ngn, prod, etc.
  const file = path.resolve(process.cwd(), `.env.${mode}`);
  dotenv.config({ path: file });
  console.log('env file loaded:', file);
}

async function bootstrap() {

  loadEnv();
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api/v1');

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));


  const config = new DocumentBuilder()
    .setTitle('Api de E-commerce')
    .setDescription('el ecommerce de NestJS ')
    .setVersion('1.0')
    .addServer('http://localhost:3000')
    .addServer('https://api.example.com')
    //.addBearerAuth()
    .build();

  
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  console.log('url: ', 'http://localhost:3000/api/v1/');

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
