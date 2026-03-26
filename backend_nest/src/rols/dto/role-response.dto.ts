// src/roles/dto/role-response.dto.ts
import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { Exclude, Expose } from 'class-transformer';

export class RoleResponseDto {
  @ApiProperty({
      description: 'ID of the role',
      example: '123e4567-e89b-12d3-a456-426614174000',
    })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Name of the role',
    example: 'name of the role',
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'Description of the role',
    example: 'Administrator role with full permissions',
  })
  @Expose()
  description?: string;

  @ApiProperty({
    description: 'Permissions for the role',
    example: ['view_products', 'create_orders'],
  })
  @Expose()
  permissions: string[];

  @ApiProperty({
    description: 'Creation date of the role',
    example: '2023-01-01T00:00:00.000Z',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date of the role',
    example: '2023-01-01T00:00:00.000Z',
  })
  @Expose()
  updatedAt: Date;

  @ApiProperty({
    description: 'Deletion date of the role (if deleted)',
    example: '2023-01-01T00:00:00.000Z',
  })
  @Exclude()
  deletedAt?: Date;

  @ApiProperty({
    description: 'Number of permissions for the role',
    example: 2,
  })
  @Expose()
  get permissionsCount(): number {
    return this.permissions?.length || 0;
  }

  constructor(partial: Partial<RoleResponseDto>) {
    Object.assign(this, partial);
  }
}