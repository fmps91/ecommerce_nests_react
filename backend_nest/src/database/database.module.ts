import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { databaseProviders } from './database.providers';


@Global() // Opcional: hace el módulo global
@Module({
  imports: [ConfigModule], // Importa ConfigModule para que DatabaseService pueda inyectar ConfigService
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}