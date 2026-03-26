import { Module } from '@nestjs/common';
import { CartItemsService } from './cart-items.service';
import { CartItemsController } from './cart-items.controller';
import { CartItem } from './models/cart-item.model';
import { Product } from '../products/models/product.model';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
  ],
  controllers: [CartItemsController],
  providers: [CartItemsService, CartItem, Product],
  exports: [CartItemsService],
})
export class CartItemsModule {}
