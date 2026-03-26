// src/orders/entities/order.entity.ts
import { Exclude, Expose } from 'class-transformer';
import { OrderStatus } from '../models/order.model';
import { UserEntity } from '../../users/entities/user.entity';
import { OrderDetailEntity } from './order-detail.entity';

export enum OrderStatusEnum {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED'
}

export class OrderEntity {
  id: string;
  userId: string;
  items: OrderDetailEntity[]; // Puedes definir un tipo específico para los detalles del pedido
  total: number;
  status: OrderStatus;
  notes?: string;
  shippingAddress?: object;
  billingAddress?: object;
  paidAt?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;

  /* createdAt : Cuándo se hizo el pedido.

shippedAt : Cuándo se envió (salió del origen).

deliveredAt : Cuándo llegó al destino.
 */
  @Exclude()
  deletedAt?: Date;

  // Relaciones
  user?: UserEntity;
  totalPrice: number;

  constructor(partial: Partial<OrderEntity>) {
    // Excluir propiedades que son getters calculados
    const { isPaid, isShipped, isDelivered, formattedTotal, ...assignableData } = partial as any;
    Object.assign(this, assignableData);
    
    // Si hay usuario, convertirlo a entidad
    if (partial.user) {
      this.user = new UserEntity(partial.user);
    }
  }


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
}