import { ApiProperty } from '@nestjs/swagger';
import { CartItemEntity } from '../entities/cart-item.entity';

export class CartResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ required: false })
  user_id?: string;

  @ApiProperty()
  total: number;

  @ApiProperty({ enum: ['active', 'abandoned', 'completed'] })
  status: 'active' | 'abandoned' | 'completed';

  @ApiProperty({ type: [CartItemEntity] })
  items: CartItemEntity[];

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  constructor(partial: Partial<CartResponseDto>) {
    Object.assign(this, partial);
  }
}
