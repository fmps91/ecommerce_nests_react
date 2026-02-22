import { Module, Global } from '@nestjs/common';
import { databaseProviders } from './database.providers';

@Global() // Opcional: hace el módulo global
@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}