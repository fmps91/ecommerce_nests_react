// src/roles/dto/create-role.dto.ts
import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { 
  IsString, 
  IsOptional, 
  IsArray, 
  ArrayUnique,
  MinLength,
  MaxLength 
} from 'class-validator';

export class CreateRoleDto {

  @ApiProperty({
      description: 'Name of the role',
      example: 'ADMIN',
    })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @ApiProperty({
    description: 'Description of the role',
    example: 'Administrator role with full permissions',
  })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  description?: string;

  @ApiProperty({
    description: 'Permissions for the role',
    example: ['view_products', 'create_orders'],
  })
  @IsArray()
  @IsString({ each: true }) // Valida que cada elemento del array sea string
  @IsOptional()
  permissions?: string[];
}