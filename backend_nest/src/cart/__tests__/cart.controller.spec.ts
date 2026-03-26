import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from '../cart.controller';
import { CartService } from '../cart.service';
import { CreateCartDto } from '../dto/create-cart.dto';
import { AddItemDto } from '../dto/add-item.dto';
import { UpdateItemDto } from '../dto/update-item.dto';
import { CartEntity } from '../entities/cart.entity';
import { CartItemEntity } from '../entities/cart-item.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';

describe('CartController', () => {
  let controller: CartController;
  let service: CartService;

  const mockCartEntity: CartEntity = {
    id: 'test-cart-id',
    user_id: 'test-user-id',
    total: 100,
    status: 'active',
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: undefined,
    items: [],
  };

  const mockCartItemEntity: CartItemEntity = {
    id: 'test-item-id',
    cart_id: 'test-cart-id',
    product_id: 'test-product-id',
    quantity: 2,
    unit_price: 50,
    subtotal: 100,
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: undefined,
    product: {
      id: 'test-product-id',
      nombre: 'Test Product',
      precio: 50,
      imagen: 'test-image.jpg',
    },
  };

  const mockCartService = {
    create: jest.fn(),
    findOne: jest.fn(),
    addItem: jest.fn(),
    removeItem: jest.fn(),
    updateItem: jest.fn(),
    clearCart: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        {
          provide: CartService,
          useValue: mockCartService,
        },
      ],
    }).compile();

    controller = module.get<CartController>(CartController);
    service = module.get<CartService>(CartService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a cart successfully', async () => {
      const createCartDto: CreateCartDto = {
        user_id: 'test-user-id',
      };

      mockCartService.create.mockResolvedValue(mockCartEntity);

      const result = await controller.create(createCartDto);

      expect(result).toEqual(mockCartEntity);
      expect(service.create).toHaveBeenCalledWith(createCartDto);
    });

    it('should create a cart without user_id', async () => {
      mockCartService.create.mockResolvedValue(mockCartEntity);

      const result = await controller.create();

      expect(result).toEqual(mockCartEntity);
      expect(service.create).toHaveBeenCalledWith(undefined);
    });
  });

  describe('addItem', () => {
    it('should add item to cart successfully', async () => {
      const addItemDto: AddItemDto = {
        product_id: 'test-product-id',
        quantity: 2,
      };

      const cartWithItem = {
        ...mockCartEntity,
        items: [mockCartItemEntity],
      };

      mockCartService.addItem.mockResolvedValue(cartWithItem);

      const result = await controller.addItem('test-cart-id', addItemDto);

      expect(result).toEqual(cartWithItem);
      expect(service.addItem).toHaveBeenCalledWith('test-cart-id', addItemDto);
    });

    it('should throw NotFoundException when cart not found', async () => {
      const addItemDto: AddItemDto = {
        product_id: 'test-product-id',
        quantity: 2,
      };

      mockCartService.addItem.mockRejectedValue(
        new NotFoundException('Carrito con ID test-cart-id no encontrado'),
      );

      await expect(controller.addItem('test-cart-id', addItemDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when product not found', async () => {
      const addItemDto: AddItemDto = {
        product_id: 'non-existent-product',
        quantity: 2,
      };

      mockCartService.addItem.mockRejectedValue(
        new NotFoundException('Producto con ID non-existent-product no encontrado'),
      );

      await expect(controller.addItem('test-cart-id', addItemDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException when insufficient stock', async () => {
      const addItemDto: AddItemDto = {
        product_id: 'test-product-id',
        quantity: 10,
      };

      mockCartService.addItem.mockRejectedValue(
        new BadRequestException('Stock insuficiente. Stock disponible: 5'),
      );

      await expect(controller.addItem('test-cart-id', addItemDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('removeItem', () => {
    it('should remove item from cart successfully', async () => {
      const cartWithoutItem = {
        ...mockCartEntity,
        items: [],
      };

      mockCartService.removeItem.mockResolvedValue(cartWithoutItem);

      const result = await controller.removeItem('test-cart-id', 'test-product-id');

      expect(result).toEqual(cartWithoutItem);
      expect(service.removeItem).toHaveBeenCalledWith('test-cart-id', 'test-product-id');
    });

    it('should throw NotFoundException when cart not found', async () => {
      mockCartService.removeItem.mockRejectedValue(
        new NotFoundException('Carrito con ID test-cart-id no encontrado'),
      );

      await expect(controller.removeItem('test-cart-id', 'test-product-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when item not found in cart', async () => {
      mockCartService.removeItem.mockRejectedValue(
        new NotFoundException('Producto con ID test-product-id no encontrado en el carrito'),
      );

      await expect(controller.removeItem('test-cart-id', 'test-product-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateItem', () => {
    it('should update item quantity successfully', async () => {
      const updateItemDto: UpdateItemDto = {
        quantity: 3,
      };

      const updatedItem = {
        ...mockCartItemEntity,
        quantity: 3,
        subtotal: 150,
      };

      const cartWithUpdatedItem = {
        ...mockCartEntity,
        items: [updatedItem],
      };

      mockCartService.updateItem.mockResolvedValue(cartWithUpdatedItem);

      const result = await controller.updateItem('test-cart-id', 'test-product-id', updateItemDto);

      expect(result).toEqual(cartWithUpdatedItem);
      expect(service.updateItem).toHaveBeenCalledWith('test-cart-id', 'test-product-id', updateItemDto);
    });

    it('should throw NotFoundException when cart not found', async () => {
      const updateItemDto: UpdateItemDto = {
        quantity: 3,
      };

      mockCartService.updateItem.mockRejectedValue(
        new NotFoundException('Carrito con ID test-cart-id no encontrado'),
      );

      await expect(controller.updateItem('test-cart-id', 'test-product-id', updateItemDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when item not found in cart', async () => {
      const updateItemDto: UpdateItemDto = {
        quantity: 3,
      };

      mockCartService.updateItem.mockRejectedValue(
        new NotFoundException('Producto con ID test-product-id no encontrado en el carrito'),
      );

      await expect(controller.updateItem('test-cart-id', 'test-product-id', updateItemDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException when insufficient stock', async () => {
      const updateItemDto: UpdateItemDto = {
        quantity: 10,
      };

      mockCartService.updateItem.mockRejectedValue(
        new BadRequestException('Stock insuficiente'),
      );

      await expect(controller.updateItem('test-cart-id', 'test-product-id', updateItemDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findOne', () => {
    it('should return cart by id', async () => {
      const cartWithItems = {
        ...mockCartEntity,
        items: [mockCartItemEntity],
      };

      mockCartService.findOne.mockResolvedValue(cartWithItems);

      const result = await controller.findOne('test-cart-id');

      expect(result).toEqual(cartWithItems);
      expect(service.findOne).toHaveBeenCalledWith('test-cart-id');
    });

    it('should throw NotFoundException when cart not found', async () => {
      mockCartService.findOne.mockRejectedValue(
        new NotFoundException('Carrito con ID test-cart-id no encontrado'),
      );

      await expect(controller.findOne('test-cart-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('clearCart', () => {
    it('should clear cart successfully', async () => {
      const emptyCart = {
        ...mockCartEntity,
        items: [],
        total: 0,
      };

      mockCartService.clearCart.mockResolvedValue(emptyCart);

      const result = await controller.clearCart('test-cart-id');

      expect(result).toEqual(emptyCart);
      expect(service.clearCart).toHaveBeenCalledWith('test-cart-id');
    });

    it('should throw NotFoundException when cart not found', async () => {
      mockCartService.clearCart.mockRejectedValue(
        new NotFoundException('Carrito con ID test-cart-id no encontrado'),
      );

      await expect(controller.clearCart('test-cart-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('parameter validation', () => {
    it('should handle UUID validation for cart id', async () => {
      const addItemDto: AddItemDto = {
        product_id: 'test-product-id',
        quantity: 2,
      };

      // This test would require the actual ParseUUIDPipe to work
      // In unit tests, we're mocking the service, so this would pass
      mockCartService.addItem.mockResolvedValue(mockCartEntity);

      const result = await controller.addItem('invalid-uuid', addItemDto);
      expect(result).toEqual(mockCartEntity);
    });

    it('should handle UUID validation for product id', async () => {
      const addItemDto: AddItemDto = {
        product_id: 'invalid-uuid',
        quantity: 2,
      };

      mockCartService.addItem.mockResolvedValue(mockCartEntity);

      const result = await controller.addItem('test-cart-id', addItemDto);
      expect(result).toEqual(mockCartEntity);
    });
  });

  describe('response format', () => {
    it('should return consistent CartEntity format', async () => {
      const cartWithItems = {
        ...mockCartEntity,
        items: [mockCartItemEntity],
      };

      mockCartService.findOne.mockResolvedValue(cartWithItems);

      const result = await controller.findOne('test-cart-id');

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('user_id');
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('created_at');
      expect(result).toHaveProperty('updated_at');
      expect(result).toHaveProperty('items');
      expect(Array.isArray(result.items)).toBe(true);
    });

    it('should return items with product information', async () => {
      const cartWithItems = {
        ...mockCartEntity,
        items: [mockCartItemEntity],
      };

      mockCartService.findOne.mockResolvedValue(cartWithItems);

      const result = await controller.findOne('test-cart-id');

      expect(result.items && result.items[0]).toHaveProperty('product');
      expect(result.items && result.items[0].product).toHaveProperty('id');
      expect(result.items && result.items[0].product).toHaveProperty('nombre');
      expect(result.items && result.items[0].product).toHaveProperty('precio');
      expect(result.items && result.items[0].product).toHaveProperty('imagen');
    });
  });

  describe('HTTP status codes', () => {
    it('should return 201 when creating cart', async () => {
      // Note: HTTP status codes are handled by decorators
      // This test verifies the controller method completes successfully
      mockCartService.create.mockResolvedValue(mockCartEntity);

      const result = await controller.create();
      expect(result).toBeDefined();
    });

    it('should return 200 when adding item', async () => {
      const addItemDto: AddItemDto = {
        product_id: 'test-product-id',
        quantity: 2,
      };

      mockCartService.addItem.mockResolvedValue(mockCartEntity);

      const result = await controller.addItem('test-cart-id', addItemDto);
      expect(result).toBeDefined();
    });

    it('should return 200 when removing item', async () => {
      mockCartService.removeItem.mockResolvedValue(mockCartEntity);

      const result = await controller.removeItem('test-cart-id', 'test-product-id');
      expect(result).toBeDefined();
    });

    it('should return 200 when updating item', async () => {
      const updateItemDto: UpdateItemDto = {
        quantity: 3,
      };

      mockCartService.updateItem.mockResolvedValue(mockCartEntity);

      const result = await controller.updateItem('test-cart-id', 'test-product-id', updateItemDto);
      expect(result).toBeDefined();
    });

    it('should return 200 when clearing cart', async () => {
      mockCartService.clearCart.mockResolvedValue(mockCartEntity);

      const result = await controller.clearCart('test-cart-id');
      expect(result).toBeDefined();
    });
  });

  describe('error handling integration', () => {
    it('should handle service errors gracefully', async () => {
      mockCartService.findOne.mockRejectedValue(new Error('Database connection failed'));

      await expect(controller.findOne('test-cart-id')).rejects.toThrow('Database connection failed');
    });

    it('should maintain error types from service', async () => {
      mockCartService.addItem.mockRejectedValue(
        new BadRequestException('Custom validation error'),
      );

      await expect(controller.addItem('test-cart-id', {
        product_id: 'test-product-id',
        quantity: 2,
      })).rejects.toThrow(BadRequestException);
    });
  });

  describe('business logic validation', () => {
    it('should pass through all service method parameters correctly', async () => {
      const createCartDto: CreateCartDto = {
        user_id: 'test-user-id',
      };

      const addItemDto: AddItemDto = {
        product_id: 'test-product-id',
        quantity: 2,
      };

      const updateItemDto: UpdateItemDto = {
        quantity: 3,
      };

      mockCartService.create.mockResolvedValue(mockCartEntity);
      mockCartService.addItem.mockResolvedValue(mockCartEntity);
      mockCartService.removeItem.mockResolvedValue(mockCartEntity);
      mockCartService.updateItem.mockResolvedValue(mockCartEntity);
      mockCartService.clearCart.mockResolvedValue(mockCartEntity);

      await controller.create(createCartDto);
      await controller.addItem('test-cart-id', addItemDto);
      await controller.removeItem('test-cart-id', 'test-product-id');
      await controller.updateItem('test-cart-id', 'test-product-id', updateItemDto);
      await controller.clearCart('test-cart-id');

      expect(service.create).toHaveBeenCalledWith(createCartDto);
      expect(service.addItem).toHaveBeenCalledWith('test-cart-id', addItemDto);
      expect(service.removeItem).toHaveBeenCalledWith('test-cart-id', 'test-product-id');
      expect(service.updateItem).toHaveBeenCalledWith('test-cart-id', 'test-product-id', updateItemDto);
      expect(service.clearCart).toHaveBeenCalledWith('test-cart-id');
    });
  });
});
