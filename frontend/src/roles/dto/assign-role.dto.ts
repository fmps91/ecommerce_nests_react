// src/roles/dto/assign-role.dto.ts
import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { IsUUID, IsString } from 'class-validator';

export class AssignRoleDto {

  @ApiProperty({
      description: 'UUID of the user',
      example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'ID of the role',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  roleId: string;
}