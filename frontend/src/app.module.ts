import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    RolesModule,
    DatabaseModule,    // Primero la base de datos
    UsersModule,       // Luego usuarios (no depende de nadie)
    AuthModule,       // Finalmente auth (depende de users)
  ],
  controllers: [
    AppController,   // <-- Los controladores van aquí
  ],
  providers: [AppService],
})
export class AppModule {}