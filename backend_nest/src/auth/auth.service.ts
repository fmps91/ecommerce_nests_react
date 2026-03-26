import { Injectable, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RolesService } from 'src/rols/roles.service';
import { EmailService } from './services/email.service';
import { PasswordResetEntity } from './entities/password-reset.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private rolesService: RolesService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  // Almacenamiento temporal para tokens de restablecimiento
  // En producción, esto debería estar en una base de datos
  private passwordResetTokens: Map<string, PasswordResetEntity> = new Map();

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      return null;
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      //const { password, ...result } = user;
      return {
        id:user.id,
        name:user.name,
        rolId:user.roleId
      }
      
    }

    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const rol = await this.rolesService.findOne(user.rolId);

    const payload = {
      sub: user.id,
      name: user.name,
      rol: rol.name,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        rol: rol.name
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.create(registerDto);

    const rol = await this.rolesService.findOne(user.roleId);
    
    const payload = {
      sub: user.id,
      name: user.name,
      rol: rol.name,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        rol: rol.name,
      },
    };
  }

  // Solicitar restablecimiento de contraseña
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    const { email } = forgotPasswordDto;

    // Verificar si el usuario existe
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      // Por seguridad, no revelamos si el email existe o no
      return;
    }

    // Generar token único
    const token = this.generateResetToken();
    
    // Crear entidad de restablecimiento
    const passwordReset = PasswordResetEntity.create(email, token);
    
    // Almacenar token (en producción, guardar en base de datos)
    this.passwordResetTokens.set(token, passwordReset);

    // Enviar correo electrónico
    await this.emailService.sendPasswordResetEmail(email, token);
  }

  // Restablecer contraseña
  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const { token, newPassword } = resetPasswordDto;

    // Buscar token de restablecimiento
    const passwordReset = this.passwordResetTokens.get(token);
    
    if (!passwordReset || !passwordReset.isValid()) {
      throw new BadRequestException('Token inválido o expirado');
    }

    // Marcar token como usado
    passwordReset.isUsed = true;

    // Buscar usuario por email
    const user = await this.usersService.findByEmail(passwordReset.email);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar contraseña del usuario
    await this.usersService.updatePassword(user.id, hashedPassword);

    // Limpiar token
    this.passwordResetTokens.delete(token);
  }
  async sendTestEmail(email: string): Promise<void> {
    await this.emailService.sendEmail(email, 'Correo de prueba', '<p>Este es un correo de prueba para verificar la configuración del servicio de email.</p>');
  }

  // Generar token aleatorio
  private generateResetToken(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }
}