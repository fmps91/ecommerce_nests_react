import { PartialType } from '@nestjs/mapped-types';
import { CreatePaymentDto } from './create-payment.dto';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentStatus } from '../models/payments.model';

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {
  @ApiProperty({ enum: PaymentStatus, required: false })
  @IsEnum(PaymentStatus)
  @IsOptional()
  status?: PaymentStatus;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  transaction_id?: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  order_id?: string;
}