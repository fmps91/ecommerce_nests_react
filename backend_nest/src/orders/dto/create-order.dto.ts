// src/orders/dto/create-order.dto.ts

import { 
  IsUUID, 
  IsNumber, 
  IsEnum, 
  IsOptional, 
  IsString, 
  IsObject, 
  IsArray,
  Min,
  ValidateNested,
  IsPositive,
  IsDateString
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../models/order.model';
import { ApiProperty } from '@nestjs/swagger';

class OrderItemDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  productId: string;

  @ApiProperty({ example: 'Classic Burger' })
  @IsString()
  productName: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @IsPositive()
  @Min(1)
  quantity: number;

  @ApiProperty({ example: 9.99 })
  @IsNumber()
  @IsPositive()
  unitPrice: number;

  @ApiProperty({ example: 19.98 })
  @IsNumber()
  @IsPositive()
  subtotal: number;
}

class AddressDto {
  @ApiProperty({ example: '123 Main St' })
  @IsString()
  street: string;

  @ApiProperty({ example: 'New York' })
  @IsString()
  city: string;

  @ApiProperty({ example: 'NY' })
  @IsString()
  state: string;

  @ApiProperty({ example: '10001' })
  @IsString()
  zipCode: string;

  @ApiProperty({ example: 'USA' })
  @IsString()
  country: string;

  @ApiProperty({ example: 'Apt 4B', required: false })
  @IsString()
  @IsOptional()
  additionalInfo?: string;
}

export class CreateOrderDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  userId: string;

  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ example: 25.97 })
  @IsNumber()
  @Min(0)
  subtotal: number;


  @ApiProperty({ example: 3.99 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  shippingCost?: number;

  @ApiProperty({ example: 34.12 })
  @IsNumber()
  @Min(0)
  total: number;

  @ApiProperty({ enum: OrderStatus, default: OrderStatus.PENDING })
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  @ApiProperty({ example: 'Please deliver to back door', required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ type: AddressDto, required: false })
  @IsObject()
  @ValidateNested()
  @Type(() => AddressDto)
  @IsOptional()
  shippingAddress?: AddressDto;

  @ApiProperty({ type: AddressDto, required: false })
  @IsObject()
  @ValidateNested()
  @Type(() => AddressDto)
  @IsOptional()
  billingAddress?: AddressDto;

/*   @ApiProperty({ example: 'credit_card' })
  @IsString()
  paymentMethod: string; 

  @ApiProperty({ example: '2023-01-01T12:00:00Z', required: false })
  @IsDateString()
  @IsOptional()
  paidAt?: Date;*/

  @ApiProperty({ example: '2023-01-01T13:00:00Z', required: false })
  @IsDateString()
  @IsOptional()
  shippedAt?: Date;

  @ApiProperty({ example: '2023-01-01T14:00:00Z', required: false })
  @IsDateString()
  @IsOptional()
  deliveredAt?: Date;
}