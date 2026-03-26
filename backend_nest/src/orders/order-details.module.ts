import { Module } from '@nestjs/common';
import { OrderDetailsService } from './order-details.service';
import { OrderDetailsController } from './order-details.controller';
import { OrderDetail } from './models/order-detail.model';
import { Product } from '../products/models/product.model';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
  ],
  controllers: [OrderDetailsController],
  providers: [OrderDetailsService, OrderDetail, Product],
  exports: [OrderDetailsService],
})
export class OrderDetailsModule {}
