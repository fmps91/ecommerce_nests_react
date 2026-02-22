import { IsEmail, IsString, MinLength, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { UserRole } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';

export class CreateUserDto {

  @ApiProperty({
    description: 'Email del usuario',
    example: 'f@ejemplo.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password del usuario',
    example: 'password123'
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez'
  })
  @IsString()
  @MinLength(2)
  name: string;

  /* @ApiProperty({
    description: 'Rol del usuario',
    example: 'ADMIN'
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole; */

   @ApiProperty({
    description: 'idRol del usuario',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsString()
  @IsOptional()
  roleId?: string;
  

  @ApiProperty({
    description: 'Estado activo del usuario',
    example: true
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}