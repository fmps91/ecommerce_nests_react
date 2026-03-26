import { Cart } from '../models/cart.model';
import { CartItemEntity } from './cart-item.entity';

export class CartEntity {
  id: string;
  user_id?: string;
  total: number;
  status: 'active' | 'abandoned' | 'completed';
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
  items?: CartItemEntity[];

  constructor(partial: Partial<CartEntity>) {
    Object.assign(this, partial);
  }

  static fromModel(cart: Cart, includeItems = true): CartEntity {
    return new CartEntity({
      id: cart.id,
      user_id: cart.user_id,
      total: Number(cart.total),
      status: cart.status,
      created_at: cart.created_at,
      updated_at: cart.updated_at,
      deleted_at: cart.deleted_at,
      items: includeItems && cart.items 
        ? cart.items.map(item => CartItemEntity.fromModel(item))
        : [],
    });
  }
}
