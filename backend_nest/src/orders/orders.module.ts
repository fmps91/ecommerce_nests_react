// src/orders/orders.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { UsersModule } from 'src/users/users.module';
import { DatabaseModule } from 'src/database/database.module';
import { OrderDetail } from './models/order-detail.model';

@Module({
  imports: [
    //SequelizeModule.forFeature([Order, User]),
    DatabaseModule,
        forwardRef(() => UsersModule),
        OrdersModule,
        
  ],
  controllers: [OrdersController],
  providers: [OrdersService,OrderDetail],
  exports: [OrdersService],
})
export class OrdersModule {}