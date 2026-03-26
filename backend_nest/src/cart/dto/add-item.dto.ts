import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNumber, IsPositive, Min } from 'class-validator';

export class AddItemDto {
  @ApiProperty({
    description: 'ID del producto a agregar',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  product_id: string;

  @ApiProperty({
    description: 'Cantidad del producto',
    example: 2,
    minimum: 1,
  })
  @IsNumber()
  @IsPositive()
  @Min(1)
  quantity: number;
}
