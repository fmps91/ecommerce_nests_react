import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { CartItem } from './models/cart-item.model';
import { Product } from '../products/models/product.model';
import { CreateCartItemDto } from './dto/create-cart-item.dto.js';
import { UpdateCartItemDto } from './dto/update-cart-item.dto.js';
import { CartItemResponseDto } from './dto/cart-item-response.dto.js';
import { PaginatedResponseDto } from './dto/paginated-response.dto.js';

export interface PaginationParams {
  page?: number;
  limit?: number;
}

@Injectable()
export class CartItemsService {
  constructor(
    @Inject('SEQUELIZE')
    private sequelize: Sequelize,
  ) {}

  private get cartItemRepository() {
    return this.sequelize.getRepository(CartItem);
  }

  async create(createCartItemDto: CreateCartItemDto): Promise<CartItemResponseDto[]> {
    const createdItems: CartItem[] = [];

    for (const item of createCartItemDto.items) {
      const subtotal = (item.unit_price || 0) * item.quantity;
      const cartItem = await this.cartItemRepository.create({
        cart_id: createCartItemDto.cart_id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        subtotal
      });
      createdItems.push(cartItem);
    }

    return createdItems.map(item => new CartItemResponseDto(item.toJSON()));
  }

  async findAll(params?: PaginationParams): Promise<PaginatedResponseDto<CartItemResponseDto>> {
    const page = params?.page && params.page > 0 ? params.page : 1;
    const limit = params?.limit && params.limit > 0 ? params.limit : 10;
    const offset = (page - 1) * limit;

    const { rows, count } = await this.cartItemRepository.findAndCountAll({
      include: [Product],
      order: [['created_at', 'DESC']],
      limit,
      offset,
      distinct: true,
    });

    const totalPages = Math.ceil(count / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    const data = rows.map(item => new CartItemResponseDto(item.toJSON()));

    return {
      data,
      meta: {
        total: count,
        page,
        limit,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    };
  }

  async findAllSimple(): Promise<CartItemResponseDto[]> {
    const cartItems = await this.cartItemRepository.findAll({
      include: [Product],
    });

    return cartItems.map(item => new CartItemResponseDto(item.toJSON()));
  }

  async findOne(id: string): Promise<CartItemResponseDto> {
    const cartItem = await this.cartItemRepository.findByPk(id, {
      include: [Product],
    });

    if (!cartItem) {
      throw new NotFoundException(`Cart item with ID ${id} not found`);
    }

    return new CartItemResponseDto(cartItem.toJSON());
  }

  async findByCart(cartId: string): Promise<CartItemResponseDto[]> {
    const cartItems = await this.cartItemRepository.findAll({
      where: { cart_id: cartId },
      include: [Product],
      order: [['created_at', 'DESC']],
    });

    return cartItems.map(item => new CartItemResponseDto(item.toJSON()));
  }

  async update(id: string, updateCartItemDto: UpdateCartItemDto): Promise<CartItemResponseDto> {
    const cartItem = await this.cartItemRepository.findByPk(id, {
      include: [Product],
    });

    if (!cartItem) {
      throw new NotFoundException(`Cart item with ID ${id} not found`);
    }

    // Recalculate subtotal if quantity or unit_price changed
    if (updateCartItemDto.quantity || updateCartItemDto.unit_price) {
      const quantity = updateCartItemDto.quantity || cartItem.quantity;
      const unitPrice = updateCartItemDto.unit_price || cartItem.unit_price;
      updateCartItemDto.subtotal = quantity * unitPrice;
    }

    await cartItem.update(updateCartItemDto);
    await cartItem.reload({ include: [Product] });

    return new CartItemResponseDto(cartItem.toJSON());
  }

  async remove(id: string): Promise<void> {
    const cartItem = await this.cartItemRepository.findByPk(id);

    if (!cartItem) {
      throw new NotFoundException(`Cart item with ID ${id} not found`);
    }

    await cartItem.destroy();
  }
}
