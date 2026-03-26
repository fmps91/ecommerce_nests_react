import { CartItem } from '../models/cart-item.model';

export class CartItemEntity {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;

  // Additional properties for response
  product?: {
    id: string;
    nombre: string;
    precio: number;
    imagen?: string;
  };

  constructor(partial: Partial<CartItemEntity>) {
    Object.assign(this, partial);
  }

  static fromModel(cartItem: CartItem): CartItemEntity {
    return new CartItemEntity({
      id: cartItem.id,
      cart_id: cartItem.cart_id,
      product_id: cartItem.product_id,
      quantity: cartItem.quantity,
      unit_price: Number(cartItem.unit_price),
      subtotal: Number(cartItem.subtotal),
      created_at: cartItem.created_at,
      updated_at: cartItem.updated_at,
      deleted_at: cartItem.deleted_at,
      product: cartItem.product ? {
        id: cartItem.product.id,
        nombre: cartItem.product.nombre,
        precio: Number(cartItem.product.precio),
        imagen: cartItem.product.imagen,
      } : undefined,
    });
  }
}
