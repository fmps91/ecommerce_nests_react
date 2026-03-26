// src/orders/dto/create-order-detail.dto.ts
import { IsUUID, IsNumber, IsString, Min, IsOptional, IsObject, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @IsUUID()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  unitPrice?: number;

  @IsString()
  @IsOptional()
  productName?: string;
}

export class CreateOrderDetailDto {
  @IsUUID()
  orderId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}

