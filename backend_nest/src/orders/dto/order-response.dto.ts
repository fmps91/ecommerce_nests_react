// src/orders/dto/order-response.dto.ts
import { Exclude, Expose, Type } from 'class-transformer';
import { OrderStatus } from '../models/order.model';
import { UserResponseDto } from '../../users/dto/user-response.dto';
import { OrderDetailResponseDto } from './order-detail-response.dto';

export class OrderResponseDto {
  @Expose()
  id: string;

  @Expose()
  userId: string;

  @Expose()
  itemsIds: string[]; // Puedes incluir solo los IDs de los items o detalles del pedido

  @Expose()
  total: number;

  @Expose()
  status: OrderStatus;

  @Expose()
  notes?: string;

  @Expose()
  shippingAddress?: object;

  @Expose()
  billingAddress?: object;

  @Expose()
  paidAt?: Date | null;

  @Expose()
  shippedAt?: Date | null;

  @Expose()
  deliveredAt?: Date | null;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Exclude()
  deletedAt?: Date;

  @Expose()
  @Type(() => UserResponseDto)
  user?: UserResponseDto;

  @Expose()
  @Type(() => OrderDetailResponseDto)
  items?: OrderDetailResponseDto[];

  @Expose()
    get isPaid(): boolean {
        return !!this.paidAt; // Convierte a boolean (true si existe, false si null/undefined)
    }

  @Expose()
  get isShipped(): boolean {
    return !!this.shippedAt;
  }

  @Expose()
  get isDelivered(): boolean {
    return !!this.deliveredAt;
  }

  @Expose()
  get formattedTotal(): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(this.total);
  }

  constructor(partial: Partial<OrderResponseDto>) {
    // Excluir propiedades que son getters calculados
    const { isPaid, isShipped, isDelivered, formattedTotal, ...assignableData } = partial as any;
    Object.assign(this, assignableData);
   
  }
}