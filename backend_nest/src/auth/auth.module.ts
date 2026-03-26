import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { EmailService } from './services/email.service';
import { UsersModule } from '../users/users.module';
import { RolesModule } from '../rols/roles.module';

@Module({
  imports: [
    forwardRef(() => UsersModule), // Usar forwardRef para evitar dependencias circulares
    RolesModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'secretKey',
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    EmailService,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard
  ],
  exports: [
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
  ],
})
export class AuthModule {}