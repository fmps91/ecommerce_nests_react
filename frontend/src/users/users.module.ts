import { Module, forwardRef } from '@nestjs/common';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule } from '../database/database.module';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  imports: [
    DatabaseModule,
    forwardRef(() => RolesModule), // <-- IMPORTANTE: Evita la dependencia circular
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // ESTO ES CRÍTICO - DEBE ESTAR PRESENTE
})
export class UsersModule {}