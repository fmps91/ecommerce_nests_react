import { IsEmail, IsString, MinLength, MaxLength, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '../../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';

export class RegisterDto {
  @ApiProperty({
      description: 'Email del usuario',
      example: 'user@example.com'
    })
  @IsEmail({}, { message: 'El email debe ser válido' })
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'password123'
  })
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @MaxLength(50, { message: 'La contraseña no puede exceder los 50 caracteres' })
  password: string;

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'John Doe'
  })
  @IsString()
  name: string;

  /* @ApiProperty({
    description: 'Rol del usuario',
    example: 'CUSTOMER',
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  @IsEnum(UserRole, { message: 'El rol debe ser ADMIN, SELLER o CUSTOMER' })
  @IsOptional()
  role?: UserRole; */

  @ApiProperty({
    description: 'idRol del usuario',
    example: '8a7146bb-be52-4655-b1d0-079933834a6c',
  })
  @IsString()
  roleId: string;
}