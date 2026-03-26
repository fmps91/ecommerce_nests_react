import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from '../cart.service';
import { Sequelize } from 'sequelize-typescript';
import { Cart } from '../models/cart.model';
import { CartItem } from '../models/cart-item.model';
import { Product } from '../../products/models/product.model';
import { CreateCartDto } from '../dto/create-cart.dto';
import { AddItemDto } from '../dto/add-item.dto';
import { UpdateItemDto } from '../dto/update-item.dto';
import { CartEntity } from '../entities/cart.entity';
import { CartItemEntity } from '../entities/cart-item.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ProductService } from '../../products/products.service';

describe('CartService', () => {
  let service: CartService;
  let sequelize: Sequelize;
  let cartRepository: any;
  let cartItemRepository: any;
  let productRepository: any;
  let productService: jest.Mocked<ProductService>;

  const mockCart = {
    id: 'test-cart-id',
    user_id: 'test-user-id',
    status: 'active',
    total: 100,
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
    items: [],
    update: jest.fn(),
    destroy: jest.fn(),
    save: jest.fn(),
  };

  const mockCartItem = {
    id: 'test-item-id',
    cart_id: 'test-cart-id',
    product_id: 'test-product-id',
    quantity: 2,
    unit_price: 50,
    subtotal: 100,
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
    update: jest.fn(),
    destroy: jest.fn(),
  };

  const mockProduct = {
    id: 'test-product-id',
    nombre: 'Test Product',
    precio: 50,
    stock: 10,
    imagen: 'test-image.jpg',
    update: jest.fn(),
  };

  beforeEach(async () => {
    const mockSequelize = {
      getRepository: jest.fn(),
      transaction: jest.fn(),
    };

    cartRepository = {
      create: jest.fn(),
      findByPk: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
    };

    cartItemRepository = {
      create: jest.fn(),
      findByPk: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
    };

    productRepository = {
      findByPk: jest.fn(),
      update: jest.fn(),
    };

    const mockTransaction = {
      commit: jest.fn(),
      rollback: jest.fn(),
    };

    mockSequelize.getRepository.mockImplementation((model) => {
      if (model === Cart) return cartRepository;
      if (model === CartItem) return cartItemRepository;
      if (model === Product) return productRepository;
      return null;
    });

    mockSequelize.transaction.mockResolvedValue(mockTransaction);

    const mockProductService = {
      findOne: jest.fn(),
      updateStock: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: 'SEQUELIZE',
          useValue: mockSequelize,
        },
        {
          provide: ProductService,
          useValue: mockProductService,
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    sequelize = module.get<Sequelize>('SEQUELIZE');
    productService = module.get(ProductService) as jest.Mocked<ProductService>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a cart successfully', async () => {
      const createCartDto: CreateCartDto = {
        user_id: 'test-user-id',
      };

      cartRepository.create.mockResolvedValue(mockCart);

      const result = await service.create(createCartDto);

      expect(result).toBeInstanceOf(CartEntity);
      expect(cartRepository.create).toHaveBeenCalledWith({
        user_id: 'test-user-id',
        status: 'active',
        total: 0,
      }, expect.any(Object));
    });

    it('should create a cart without user_id', async () => {
      cartRepository.create.mockResolvedValue(mockCart);

      const result = await service.create();

      expect(result).toBeInstanceOf(CartEntity);
      expect(cartRepository.create).toHaveBeenCalledWith({
        user_id: undefined,
        status: 'active',
        total: 0,
      }, expect.any(Object));
    });

    it('should handle transaction rollback on error', async () => {
      const createCartDto: CreateCartDto = {
        user_id: 'test-user-id',
      };

      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
      };

      // sequelize.transaction is already mocked in beforeEach to return a mock transaction
      cartRepository.create.mockRejectedValue(new Error('Database error'));

      await expect(service.create(createCartDto)).rejects.toThrow('Database error');
      expect(mockTransaction.rollback).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a cart by id', async () => {
      const cartWithItems = {
        ...mockCart,
        items: [mockCartItem],
      };

      cartRepository.findByPk.mockResolvedValue(cartWithItems);

      const result = await service.findOne('test-cart-id');

      expect(result).toBeInstanceOf(CartEntity);
      expect(cartRepository.findByPk).toHaveBeenCalledWith('test-cart-id', {
        include: [{
          model: CartItem,
          include: [Product],
        }],
      });
    });

    it('should throw NotFoundException if cart not found', async () => {
      cartRepository.findByPk.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('addItem', () => {
    const addItemDto: AddItemDto = {
      product_id: 'test-product-id',
      quantity: 2,
    };

    it('should add item to existing cart successfully', async () => {
      const cartWithItems = {
        ...mockCart,
        items: [],
      };

      productRepository.findByPk.mockResolvedValue(mockProduct);
      cartRepository.findByPk.mockResolvedValue(cartWithItems);
      cartItemRepository.create.mockResolvedValue(mockCartItem);
      cartItemRepository.findAll.mockResolvedValue([mockCartItem]);
      cartRepository.update.mockResolvedValue([1]);

      const result = await service.addItem('test-cart-id', addItemDto);

      expect(result).toBeInstanceOf(CartEntity);
      expect(productRepository.findByPk).toHaveBeenCalledWith('test-product-id', expect.any(Object));
      expect(productRepository.update).toHaveBeenCalledWith({
        stock: 8, // 10 - 2
      }, expect.any(Object));
    });

    it('should create new cart if cart does not exist', async () => {
      const newCart = { ...mockCart, id: 'new-cart-id' };
      
      productRepository.findByPk.mockResolvedValue(mockProduct);
      cartRepository.findByPk.mockResolvedValueOnce(null); // First call returns null
      cartRepository.create.mockResolvedValue(newCart);
      cartRepository.findByPk.mockResolvedValueOnce({ ...newCart, items: [] }); // Second call returns new cart
      cartItemRepository.create.mockResolvedValue(mockCartItem);
      cartItemRepository.findAll.mockResolvedValue([mockCartItem]);
      cartRepository.update.mockResolvedValue([1]);

      const result = await service.addItem('non-existent-id', addItemDto);

      expect(result).toBeInstanceOf(CartEntity);
      expect(cartRepository.create).toHaveBeenCalledWith({
        status: 'active',
        total: 0,
      }, expect.any(Object));
    });

    it('should update existing item quantity', async () => {
      const existingItem = { ...mockCartItem, quantity: 1 };
      const cartWithExistingItem = {
        ...mockCart,
        items: [existingItem],
      };

      productRepository.findByPk.mockResolvedValue(mockProduct);
      cartRepository.findByPk.mockResolvedValue(cartWithExistingItem);
      existingItem.update.mockResolvedValue(existingItem);
      cartItemRepository.findAll.mockResolvedValue([existingItem]);
      cartRepository.update.mockResolvedValue([1]);

      const result = await service.addItem('test-cart-id', addItemDto);

      expect(existingItem.update).toHaveBeenCalledWith({
        quantity: 3, // 1 + 2
        subtotal: 150, // 3 * 50
      }, expect.any(Object));
    });

    it('should throw NotFoundException if product not found', async () => {
      productRepository.findByPk.mockResolvedValue(null);

      await expect(service.addItem('test-cart-id', addItemDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if insufficient stock', async () => {
      const lowStockProduct = { ...mockProduct, stock: 1 };
      
      productRepository.findByPk.mockResolvedValue(lowStockProduct);

      await expect(service.addItem('test-cart-id', addItemDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if existing item quantity exceeds stock', async () => {
      const existingItem = { ...mockCartItem, quantity: 9 };
      const cartWithExistingItem = {
        ...mockCart,
        items: [existingItem],
      };

      productRepository.findByPk.mockResolvedValue(mockProduct);
      cartRepository.findByPk.mockResolvedValue(cartWithExistingItem);

      await expect(service.addItem('test-cart-id', addItemDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('removeItem', () => {
    it('should remove item from cart successfully', async () => {
      const cartWithItems = {
        ...mockCart,
        items: [mockCartItem],
      };

      cartRepository.findByPk.mockResolvedValue(cartWithItems);
      productRepository.findByPk.mockResolvedValue(mockProduct);
      cartItemRepository.findAll.mockResolvedValue([]);
      cartRepository.update.mockResolvedValue([1]);

      const result = await service.removeItem('test-cart-id', 'test-product-id');

      expect(result).toBeInstanceOf(CartEntity);
      expect(mockCartItem.destroy).toHaveBeenCalled();
      expect(productRepository.update).toHaveBeenCalledWith({
        stock: 12, // 10 + 2
      }, expect.any(Object));
    });

    it('should throw NotFoundException if cart not found', async () => {
      cartRepository.findByPk.mockResolvedValue(null);

      await expect(service.removeItem('test-cart-id', 'test-product-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if item not found in cart', async () => {
      const emptyCart = { ...mockCart, items: [] };

      cartRepository.findByPk.mockResolvedValue(emptyCart);

      await expect(service.removeItem('test-cart-id', 'test-product-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateItem', () => {
    const updateItemDto: UpdateItemDto = {
      quantity: 3,
    };

    it('should update item quantity successfully', async () => {
      const cartWithItems = {
        ...mockCart,
        items: [mockCartItem],
      };

      cartRepository.findByPk.mockResolvedValue(cartWithItems);
      productRepository.findByPk.mockResolvedValue(mockProduct);
      mockCartItem.update.mockResolvedValue(mockCartItem);
      cartItemRepository.findAll.mockResolvedValue([mockCartItem]);
      cartRepository.update.mockResolvedValue([1]);

      const result = await service.updateItem('test-cart-id', 'test-product-id', updateItemDto);

      expect(result).toBeInstanceOf(CartEntity);
      expect(mockCartItem.update).toHaveBeenCalledWith({
        quantity: 3,
        subtotal: 150, // 3 * 50
      }, expect.any(Object));
      expect(productRepository.update).toHaveBeenCalledWith({
        stock: 9, // 10 - (3 - 2)
      }, expect.any(Object));
    });

    it('should throw NotFoundException if cart not found', async () => {
      cartRepository.findByPk.mockResolvedValue(null);

      await expect(service.updateItem('test-cart-id', 'test-product-id', updateItemDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if item not found in cart', async () => {
      const emptyCart = { ...mockCart, items: [] };

      cartRepository.findByPk.mockResolvedValue(emptyCart);

      await expect(service.updateItem('test-cart-id', 'test-product-id', updateItemDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if product not found', async () => {
      const cartWithItems = {
        ...mockCart,
        items: [mockCartItem],
      };

      cartRepository.findByPk.mockResolvedValue(cartWithItems);
      productRepository.findByPk.mockResolvedValue(null);

      await expect(service.updateItem('test-cart-id', 'test-product-id', updateItemDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if insufficient stock for increase', async () => {
      const cartWithItems = {
        ...mockCart,
        items: [mockCartItem],
      };
      const lowStockProduct = { ...mockProduct, stock: 1 };

      cartRepository.findByPk.mockResolvedValue(cartWithItems);
      productRepository.findByPk.mockResolvedValue(lowStockProduct);

      await expect(service.updateItem('test-cart-id', 'test-product-id', updateItemDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('clearCart', () => {
    it('should clear cart successfully', async () => {
      const cartWithItems = {
        ...mockCart,
        items: [mockCartItem],
      };

      cartRepository.findByPk.mockResolvedValue(cartWithItems);
      productRepository.findByPk.mockResolvedValue(mockProduct);
      cartItemRepository.destroy.mockResolvedValue(1);
      cartRepository.update.mockResolvedValue([1]);

      const result = await service.clearCart('test-cart-id');

      expect(result).toBeInstanceOf(CartEntity);
      expect(cartItemRepository.destroy).toHaveBeenCalledWith({
        where: { cart_id: 'test-cart-id' },
        transaction: expect.any(Object),
      });
      expect(productRepository.update).toHaveBeenCalledWith({
        stock: 12, // 10 + 2
      }, expect.any(Object));
    });

    it('should handle empty cart', async () => {
      const emptyCart = { ...mockCart, items: [] };

      cartRepository.findByPk.mockResolvedValue(emptyCart);
      cartItemRepository.destroy.mockResolvedValue(0);
      cartRepository.update.mockResolvedValue([1]);

      const result = await service.clearCart('test-cart-id');

      expect(result).toBeInstanceOf(CartEntity);
      expect(cartItemRepository.destroy).toHaveBeenCalled();
    });

    it('should throw NotFoundException if cart not found', async () => {
      cartRepository.findByPk.mockResolvedValue(null);

      await expect(service.clearCart('test-cart-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('private methods', () => {
    describe('recalculateCartTotal', () => {
      it('should recalculate cart total correctly', async () => {
        const items = [
          { subtotal: 100 },
          { subtotal: 50 },
          { subtotal: 25 },
        ];

        cartItemRepository.findAll.mockResolvedValue(items);
        cartRepository.update.mockResolvedValue([1]);

        // Access private method through prototype
        const recalculateCartTotal = (service as any).recalculateCartTotal.bind(service);
        await recalculateCartTotal('test-cart-id', {});

        expect(cartItemRepository.findAll).toHaveBeenCalledWith({
          where: { cart_id: 'test-cart-id' },
          transaction: expect.any(Object),
        });
        expect(cartRepository.update).toHaveBeenCalledWith(
          { total: 175 }, // 100 + 50 + 25
          { where: { id: 'test-cart-id' }, transaction: expect.any(Object) }
        );
      });

      it('should handle empty items list', async () => {
        cartItemRepository.findAll.mockResolvedValue([]);
        cartRepository.update.mockResolvedValue([1]);

        const recalculateCartTotal = (service as any).recalculateCartTotal.bind(service);
        await recalculateCartTotal('test-cart-id', {});

        expect(cartRepository.update).toHaveBeenCalledWith(
          { total: 0 },
          { where: { id: 'test-cart-id' }, transaction: expect.any(Object) }
        );
      });
    });
  });

  describe('transaction handling', () => {
    it('should handle transaction rollback on addItem error', async () => {
      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
      };

      // sequelize.transaction is already mocked in beforeEach to return a mock transaction
      productRepository.findByPk.mockRejectedValue(new Error('Database error'));

      await expect(service.addItem('test-cart-id', {
        product_id: 'test-product-id',
        quantity: 2,
      })).rejects.toThrow('Database error');

      expect(mockTransaction.rollback).toHaveBeenCalled();
      expect(mockTransaction.commit).not.toHaveBeenCalled();
    });

    it('should handle transaction rollback on removeItem error', async () => {
      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
      };

      // sequelize.transaction is already mocked in beforeEach to return a mock transaction
      cartRepository.findByPk.mockRejectedValue(new Error('Database error'));

      await expect(service.removeItem('test-cart-id', 'test-product-id')).rejects.toThrow('Database error');

      expect(mockTransaction.rollback).toHaveBeenCalled();
      expect(mockTransaction.commit).not.toHaveBeenCalled();
    });

    it('should handle transaction rollback on updateItem error', async () => {
      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
      };

      // sequelize.transaction is already mocked in beforeEach to return a mock transaction
      cartRepository.findByPk.mockRejectedValue(new Error('Database error'));

      await expect(service.updateItem('test-cart-id', 'test-product-id', {
        quantity: 3,
      })).rejects.toThrow('Database error');

      expect(mockTransaction.rollback).toHaveBeenCalled();
      expect(mockTransaction.commit).not.toHaveBeenCalled();
    });

    it('should handle transaction rollback on clearCart error', async () => {
      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
      };

      // sequelize.transaction is already mocked in beforeEach to return a mock transaction
      cartRepository.findByPk.mockRejectedValue(new Error('Database error'));

      await expect(service.clearCart('test-cart-id')).rejects.toThrow('Database error');

      expect(mockTransaction.rollback).toHaveBeenCalled();
      expect(mockTransaction.commit).not.toHaveBeenCalled();
    });
  });
});
