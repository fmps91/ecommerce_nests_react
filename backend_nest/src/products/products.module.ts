import { Module, forwardRef } from '@nestjs/common';
import { ProductService } from './products.service';
import { ProductController } from './productos.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
