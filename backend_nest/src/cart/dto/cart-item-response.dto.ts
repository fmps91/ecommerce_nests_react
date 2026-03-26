export class CartItemResponseDto {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
  
  // Include product information
  product?: {
    id: string;
    nombre: string;
    precio: number;
    imagen?: string;
  };

  constructor(data: Partial<CartItemResponseDto>) {
    Object.assign(this, data);
  }
}
