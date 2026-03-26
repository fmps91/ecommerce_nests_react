// src/orders/dto/order-detail-response.dto.ts
import { Expose, Type } from 'class-transformer';
import { ProductResponseDto } from '../../products/dto/product-response.dto';

export class OrderDetailResponseDto {
  @Expose()
  id: string;

  @Expose()
  productId: string;

  @Expose()
  @Type(() => ProductResponseDto)
  product?: ProductResponseDto;

  @Expose()
  productName: string;

  @Expose()
  unitPrice: number;

  @Expose()
  quantity: number;

  @Expose()
  subtotal: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  get formattedUnitPrice(): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(this.unitPrice);
  }

  @Expose()
  get formattedSubtotal(): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(this.subtotal);
  }

  constructor(partial: Partial<OrderDetailResponseDto>) {
    const { formattedUnitPrice, formattedSubtotal, ...assignableData } = partial as any;
    Object.assign(this, assignableData);
  }
}