import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RolesModule } from './rols/roles.module';
import { OrdersModule } from './orders/orders.module';
import { ProductModule } from './products/products.module';
import { CartModule } from './cart/cart.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV ?? 'developer'}`,
    }),
    RolesModule,
    DatabaseModule,    // Primero la base de datos
    UsersModule,       // Luego usuarios (no depende de nadie)
    AuthModule,       // Finalmente auth (depende de users)
    OrdersModule,      // Luego orders (depende de users)
    ProductModule,     // Productos con CRUD igual a Orders
    CartModule,        // Carrito con CRUD igual a Orders
    PaymentsModule,     // Módulo de pagos
  ],
  controllers: [
    AppController,   // <-- Los controladores van aquí
  ],
  providers: [AppService],
})
export class AppModule {}