import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { UserRole } from '../entities/user.entity';

@Exclude()
export class UserResponseDto {
  @Expose()
  @ApiProperty({
    description: 'idv4 del usuario',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  id: string;

  @Expose()
  @ApiProperty({
    description: 'Email del usuario',
    example: 'f1@ejemplo.com',
  })
  email: string;

  @Expose()
  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez'
  })
  name: string;

  @Expose()
  @ApiProperty({ 
    description: 'Rol del usuario',
    enum: UserRole, example: UserRole.CUSTOMER })
  role: UserRole;

  @Expose()
  @ApiProperty({ 
    description: 'Estado activo del usuario',
    example: true })
  isActive: boolean;

  @Expose()
  @ApiProperty({ 
    description: 'Fecha de creación del usuario',
    example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @Expose()
  @ApiProperty({ 
    description: 'Fecha de actualización del usuario', 
    example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}