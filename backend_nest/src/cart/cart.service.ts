import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { Cart } from './models/cart.model';
import { CartItem } from './models/cart-item.model';
import { CartEntity } from './entities/cart.entity';
import { CartItemEntity } from './entities/cart-item.entity';
import { CreateCartDto } from './dto/create-cart.dto';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { CartResponseDto } from './dto/cart-response.dto';
import { PaginatedResponseDto } from './dto/paginated-response.dto';
import { ProductService } from '../products/products.service';
import { Product } from '../products/models/product.model';
export interface PaginationParams {
  page?: number;
  limit?: number;
}

@Injectable()
export class CartService {
  constructor(
    @Inject('SEQUELIZE')
    private sequelize: Sequelize,
    @Inject(forwardRef(() => ProductService))
    private productService: ProductService,
  ) {}

  private get cartRepository() {
    return this.sequelize.getRepository(Cart);
  }

  private get cartItemRepository() {
    return this.sequelize.getRepository(CartItem);
  }

  private get productRepository() {
    return this.sequelize.getRepository(Product);
  }

    // Crear un nuevo carrito
  async create(createCartDto?: CreateCartDto): Promise<CartEntity> {
    const transaction = await this.sequelize.transaction();
    
    try {
      const cart = await this.cartRepository.create({
        user_id: createCartDto?.user_id,
        status: 'active',
        total: 0,
      }, { transaction });

      await transaction.commit();
      return CartEntity.fromModel(cart);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async findAll(params?: PaginationParams): Promise<PaginatedResponseDto<CartResponseDto>> {
      const page = params?.page && params.page > 0 ? params.page : 1;
      const limit = params?.limit && params.limit > 0 ? params.limit : 10;
      const offset = (page - 1) * limit;
  
      const { rows, count } = await this.cartRepository.findAndCountAll({
        include: [Product,CartItem],
        order: [['created_at', 'DESC']],
        limit,
        offset,
        distinct: true,
      });
  
      const totalPages = Math.ceil(count / limit);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;
  
      const data = rows.map(item => new CartResponseDto(item.toJSON()));
  
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

    async findAllSimple(): Promise<CartResponseDto[]> {
      const cart = await this.cartRepository.findAll({
        include: [Product,CartItem],
      });
  
      return cart.map(item => new CartResponseDto(item.toJSON()));
    }

  // Obtener carrito por ID
  async findOne(id: string): Promise<CartEntity> {
    const cart = await this.cartRepository.findByPk(id, {
      include: [{
        model: CartItem,
        include: [Product],
      }],
    });

    if (!cart) {
      throw new NotFoundException(`Carrito con ID ${id} no encontrado`);
    }

    return CartEntity.fromModel(cart);
  }

  // Añadir producto al carrito
  async addItem(cartId: string, addItemDto: AddItemDto): Promise<CartEntity> {
    const transaction = await this.sequelize.transaction();
    
    try {
      const { product_id, quantity } = addItemDto;
      
      // Verificar que el producto existe y tiene stock
      const product = await this.productRepository.findByPk(product_id, { transaction });
      if (!product) {
        throw new NotFoundException(`Producto con ID ${product_id} no encontrado`);
      }

      if (product.stock < quantity) {
        throw new BadRequestException(
          `Stock insuficiente. Stock disponible: ${product.stock}`
        );
      }

      // Obtener o crear carrito
      let cart = await this.cartRepository.findByPk(cartId, { 
        include: [CartItem],
        transaction 
      });

      if (!cart) {
        cart = await this.cartRepository.create({
          status: 'active',
          total: 0,
        }, { transaction });
        cartId = cart.id;
      }

      // Verificar si el producto ya está en el carrito
      const existingItem = cart.items?.find(item => item.product_id === product_id);

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        
        // Verificar stock para la nueva cantidad total
        if (product.stock < newQuantity) {
          throw new BadRequestException(
            `No puedes agregar más. Stock disponible: ${product.stock}`
          );
        }
        
        const newSubtotal = newQuantity * product.precio;
        
        await existingItem.update({
          quantity: newQuantity,
          subtotal: newSubtotal,
        }, { transaction });
      } else {
        const subtotal = quantity * product.precio;
        
        await this.cartItemRepository.create({
          cart_id: cartId,
          product_id,
          quantity,
          unit_price: product.precio,
          subtotal,
        }, { transaction });
      }

      // Actualizar stock del producto
      await product.update({
        stock: product.stock - quantity,
      }, { transaction });

      // Recalcular total del carrito
      await this.recalculateCartTotal(cartId, transaction);

      await transaction.commit();
      
      return this.findOne(cartId);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Eliminar producto del carrito
  async removeItem(cartId: string, productId: string): Promise<CartEntity> {
    const transaction = await this.sequelize.transaction();
    
    try {
      const cart = await this.cartRepository.findByPk(cartId, {
        include: [CartItem],
        transaction,
      });

      if (!cart) {
        throw new NotFoundException(`Carrito con ID ${cartId} no encontrado`);
      }
      
      const item = cart.items?.find(item => item.product_id === productId);

      if (!item) {
        throw new NotFoundException(
          `Producto con ID ${productId} no encontrado en el carrito`
        );
      }

      // Devolver stock al producto
      const product = await this.productRepository.findByPk(productId, { transaction });
      if (product) {
        await product.update({
          stock: product.stock + item.quantity,
        }, { transaction });
      }

      // Eliminar item
      await item.destroy({ transaction });
      
      // Recalcular total del carrito
      await this.recalculateCartTotal(cartId, transaction);

      await transaction.commit();
      
      return this.findOne(cartId);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Actualizar cantidad de un producto
  async updateItem(cartId: string, productId: string, updateItemDto: UpdateItemDto): Promise<CartEntity> {
    const transaction = await this.sequelize.transaction();
    
    try {
      const { quantity } = updateItemDto;
      
      const cart = await this.cartRepository.findByPk(cartId, {
        include: [CartItem],
        transaction,
      });

      if (!cart) {
        throw new NotFoundException(`Carrito con ID ${cartId} no encontrado`);
      }
      
      const item = cart.items?.find(item => item.product_id === productId);

      if (!item) {
        throw new NotFoundException(
          `Producto con ID ${productId} no encontrado en el carrito`
        );
      }

      const product = await this.productRepository.findByPk(productId, { transaction });
      if (!product) {
        throw new NotFoundException(`Producto con ID ${productId} no encontrado`);
      }

      // Calcular diferencia de stock
      const stockDifference = quantity - item.quantity;
      
      if (stockDifference > 0 && product.stock < stockDifference) {
        throw new BadRequestException('Stock insuficiente');
      }

      // Actualizar stock del producto
      await product.update({
        stock: product.stock - stockDifference,
      }, { transaction });

      // Actualizar item
      const newSubtotal = quantity * item.unit_price;
      await item.update({
        quantity,
        subtotal: newSubtotal,
      }, { transaction });

      // Recalcular total del carrito
      await this.recalculateCartTotal(cartId, transaction);

      await transaction.commit();
      
      return this.findOne(cartId);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Vaciar carrito
  async clearCart(cartId: string): Promise<CartEntity> {
    const transaction = await this.sequelize.transaction();
    
    try {
      const cart = await this.cartRepository.findByPk(cartId, {
        include: [CartItem],
        transaction,
      });

      if (!cart) {
        throw new NotFoundException(`Carrito con ID ${cartId} no encontrado`);
      }

      // Devolver stock de todos los productos
      if (cart.items && cart.items.length > 0) {
        for (const item of cart.items) {
          const product = await this.productRepository.findByPk(item.product_id, { transaction });
          if (product) {
            await product.update({
              stock: product.stock + item.quantity,
            }, { transaction });
          }
        }

        // Eliminar todos los items
        await this.cartItemRepository.destroy({
          where: { cart_id: cartId },
          transaction,
        });
      }

      // Actualizar total a 0
      await cart.update({
        total: 0,
      }, { transaction });

      await transaction.commit();
      
      return this.findOne(cartId);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Obtener todos los carritos con paginación simplificada
  

  // Recalcular total del carrito
  private async recalculateCartTotal(cartId: string, transaction: any): Promise<void> {
    const items = await this.cartItemRepository.findAll({
      where: { cart_id: cartId },
      transaction,
    });

    const total = items.reduce((sum, item) => sum + Number(item.subtotal), 0);

    await this.cartRepository.update(
      { total },
      { where: { id: cartId }, transaction }
    );
  }
}