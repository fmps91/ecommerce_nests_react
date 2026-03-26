// src/orders/dto/update-order.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  paidAt?: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  shippedAt?: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  deliveredAt?: Date;
}