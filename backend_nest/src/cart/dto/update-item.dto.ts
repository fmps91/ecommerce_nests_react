import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, Min } from 'class-validator';

export class UpdateItemDto {
  @ApiProperty({
    description: 'Nueva cantidad del producto',
    example: 3,
    minimum: 1,
  })
  @IsNumber()
  @IsPositive()
  @Min(1)
  quantity: number;
}
