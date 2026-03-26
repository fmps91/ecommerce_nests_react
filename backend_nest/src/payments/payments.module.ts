import { forwardRef, Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { ProductModule } from 'src/products/products.module';
import { DatabaseModule } from 'src/database/database.module';
import { UsersModule } from 'src/users/users.module';


@Module({
   imports: [
          DatabaseModule,
          forwardRef(() => ProductModule),
          forwardRef(() => UsersModule)
        ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}