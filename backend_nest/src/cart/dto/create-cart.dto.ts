import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class CreateCartDto {
  @ApiProperty({
    description: 'ID del usuario (opcional, para carritos de usuarios autenticados)',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  user_id?: string;
}
