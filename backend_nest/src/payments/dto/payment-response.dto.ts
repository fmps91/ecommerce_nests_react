import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod, PaymentStatus } from '../models/payments.model';

export class PaymentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  order_id: string;

  @ApiProperty()
  user_id: string;

  @ApiProperty()
  amount: number;

  @ApiProperty({ enum: PaymentMethod })
  payment_method: PaymentMethod;

  @ApiProperty({ enum: PaymentStatus })
  status: PaymentStatus;

  @ApiProperty({ required: false })
  transaction_id?: string | null;

  @ApiProperty({ required: false })
  metadata?: any;

  @ApiProperty({ required: false })
  paid_at?: Date | null;

  @ApiProperty({ required: false })
  notes?: string | null;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  constructor(partial: Partial<PaymentResponseDto>) {
    Object.assign(this, partial);
  }
}