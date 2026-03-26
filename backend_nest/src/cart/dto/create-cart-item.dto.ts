export class CreateCartItemItemDto {
  product_id: string;
  quantity: number;
  unit_price: number;
}

export class CreateCartItemDto {
  cart_id: string;
  items: CreateCartItemItemDto[];
}
