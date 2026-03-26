// src/orders/entities/order-detail.entity.ts
import { Exclude, Expose } from 'class-transformer';
import { ProductEntity } from '../../products/entities/product.entity';
import { OrderEntity } from './order.entity';

export class OrderDetailEntity {
  id: string;
  orderId: string;
  productId: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  createdAt: Date;
  updatedAt: Date;

  @Exclude()
  deletedAt?: Date;

  // Relaciones
  order?: OrderEntity;
  product?: ProductEntity;

  constructor(partial: Partial<OrderDetailEntity>) {
    // Excluir propiedades que son getters calculados
    const { formattedSubtotal, ...assignableData } = partial as any;
    Object.assign(this, assignableData);
    
    // Si hay orden, convertirla a entidad
    if (partial.order) {
      this.order = new OrderEntity(partial.order);
    }
    
    // Si hay producto, convertirlo a entidad
    if (partial.product) {
      this.product = new ProductEntity(partial.product);
    }
  }

  @Expose()
  get formattedSubtotal(): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(this.subtotal);
  }

  @Expose()
  get formattedUnitPrice(): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(this.unitPrice);
  }

  @Expose()
  get formattedTotal(): string {
    return this.formattedSubtotal; // Alias para mantener consistencia con OrderEntity
  }

  @Expose()
  get total(): number {
    return this.subtotal; // Alias para mantener consistencia con OrderEntity
  }
}