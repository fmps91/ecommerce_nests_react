// src/roles/roles.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { UsersModule } from 'src/users/users.module';
import { DatabaseModule } from 'src/database/database.module';
// No importamos SequelizeModule

@Module({
  imports: [
    DatabaseModule,
    forwardRef(() => UsersModule),
  ],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}