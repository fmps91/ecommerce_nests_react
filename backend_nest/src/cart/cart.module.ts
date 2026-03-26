import { Module, forwardRef } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { Cart } from './models/cart.model';
import { CartItem } from './models/cart-item.model';
import { ProductModule } from '../products/products.module';
import { DatabaseModule } from 'src/database/database.module';

@Module({
    imports: [
        DatabaseModule,
        forwardRef(() => ProductModule)],
    controllers: [CartController],
    providers: [CartService],
    exports: [CartService]
})
export class CartModule {}