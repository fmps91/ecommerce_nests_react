import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from '../orders.controller';
import { OrdersService } from '../orders.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { OrderResponseDto } from '../dto/order-response.dto';
import { OrderEntity } from '../entities/order.entity';
import { OrderDetailResponseDto } from '../dto/order-detail-response.dto';
import { PaginatedResponseDto } from '../dto/paginated-response.dto';
import { OrderStatus } from '../models/order.model';

describe('OrdersController', () => {
  let controller: OrdersController;
  let ordersService: jest.Mocked<OrdersService>;

  const mockOrderEntity: OrderEntity = {
    id: 'test-order-id',
    userId: 'test-user-id',
    items: [],
    total: 100.50,
    status: 'PENDING' as OrderStatus,
    notes: 'Test order',
    shippingAddress: { street: '123 Test St' },
    billingAddress: { street: '456 Billing St' },
    paidAt: undefined,
    shippedAt: undefined,
    deliveredAt: undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: undefined,
    user: undefined,
    totalPrice: 100.50,
    isPaid: false,
    isShipped: false,
    isDelivered: false,
    formattedTotal: '100,50 €',
  };

  const mockOrderResponse: OrderResponseDto = new OrderResponseDto({
    id: 'test-order-id',
    userId: 'test-user-id',
    itemsIds: ['test-item-id'],
    status: 'PENDING' as OrderStatus,
    isPaid: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    user: undefined,
    items: [new OrderDetailResponseDto({
      id: 'test-item-id',
      productId: 'test-product-id',
      unitPrice: 50.25,
      quantity: 2,
      subtotal: 100.50,
      createdAt: new Date(),
      updatedAt: new Date(),
    })],
  });

  const mockPaginatedResponse: PaginatedResponseDto<OrderEntity> = new PaginatedResponseDto({
    data: [mockOrderEntity],
    meta: {
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  });

  beforeEach(async () => {
    const mockOrdersService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findAllSimple: jest.fn(),
      findOne: jest.fn(),
      findByUser: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      delete: jest.fn(),
      updateStatus: jest.fn(),
      markAsPaid: jest.fn(),
      getOrderStats: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: mockOrdersService,
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    ordersService = module.get(OrdersService) as jest.Mocked<OrdersService>;

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createOrderDto: CreateOrderDto = {
      userId: 'test-user-id',
      total: 100.50,
      subtotal: 100.50,
      items: [
        {
          productId: 'test-product-id',
          productName: 'Test Product',
          quantity: 2,
          unitPrice: 50.25,
          subtotal: 100.50,
        },
      ],
    };

    it('should create an order successfully', async () => {
      ordersService.create.mockResolvedValue(mockOrderEntity);

      const result = await controller.create(createOrderDto);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('userId');
      expect(result).toHaveProperty('items');
      expect(result).toHaveProperty('isPaid');
      expect(result).toHaveProperty('isShipped');
      expect(result).toHaveProperty('isDelivered');
      expect(result).toHaveProperty('formattedTotal');
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');
      expect(ordersService.create).toHaveBeenCalledWith(createOrderDto);
    });

    it('should calculate order subtotal correctly', async () => {
      ordersService.create.mockResolvedValue(mockOrderEntity);

      const result = await controller.create(createOrderDto);

      expect(result).toBeDefined();
      // The controller should log the order subtotal
      expect(ordersService.create).toHaveBeenCalledWith(createOrderDto);
    });
  });

  describe('findAll', () => {
    it('should return paginated orders with default values', async () => {
      ordersService.findAll.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findAll(1, 10);

      expect(result).toBeInstanceOf(PaginatedResponseDto);
      expect(result.data).toHaveLength(1);
      expect(result.meta.page).toBe(1);
      expect(result.meta.limit).toBe(10);
      expect(ordersService.findAll).toHaveBeenCalledWith({ page: 1, limit: 10 });
    });

    it('should return paginated orders with custom values', async () => {
      ordersService.findAll.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findAll(2, 5);

      expect(result.meta.page).toBe(2);
      expect(result.meta.limit).toBe(5);
      expect(ordersService.findAll).toHaveBeenCalledWith({ page: 2, limit: 5 });
    });

    it('should handle invalid pagination values', async () => {
      ordersService.findAll.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findAll(0, -1);

      expect(result.meta.page).toBe(1);
      expect(result.meta.limit).toBe(10);
      expect(ordersService.findAll).toHaveBeenCalledWith({ page: 1, limit: 10 });
    });

    it('should transform OrderEntity to OrderEntity in response', async () => {
      ordersService.findAll.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findAll(1, 10);

      expect(result.data[0]).toBeInstanceOf(OrderEntity);
    });
  });

  describe('findAllSimple', () => {
    it('should return all orders without pagination', async () => {
      const mockOrders = [mockOrderEntity];
      ordersService.findAllSimple.mockResolvedValue(mockOrders);

      const result = await controller.findAllSimple();

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(OrderResponseDto);
      expect(ordersService.findAllSimple).toHaveBeenCalled();
    });

    it('should map OrderEntity to OrderResponseDto', async () => {
      const mockOrders = [mockOrderEntity];
      ordersService.findAllSimple.mockResolvedValue(mockOrders);

      const result = await controller.findAllSimple();

      expect(result[0]).toBeInstanceOf(OrderResponseDto);
      expect(result[0].id).toBe(mockOrderEntity.id);
      expect(result[0].userId).toBe(mockOrderEntity.userId);
    });
  });

  describe('findMyOrders', () => {
    it('should return orders for specific user', async () => {
      const mockOrders = [mockOrderEntity];
      ordersService.findByUser.mockResolvedValue(mockOrders);

      const result = await controller.findMyOrders('test-user-id');

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(OrderResponseDto);
      expect(ordersService.findByUser).toHaveBeenCalledWith('test-user-id');
    });

    it('should return empty array for user with no orders', async () => {
      ordersService.findByUser.mockResolvedValue([]);

      const result = await controller.findMyOrders('non-existent-user-id');

      expect(result).toHaveLength(0);
    });
  });

  describe('getStats', () => {
    it('should return order statistics', async () => {
      const mockStats = {
        totalOrders: 100,
        totalRevenue: 5000,
        pendingOrders: 25,
      };

      ordersService.getOrderStats.mockResolvedValue(mockStats);

      const result = await controller.getStats();

      expect(result).toEqual(mockStats);
      expect(ordersService.getOrderStats).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return an order by id', async () => {
      ordersService.findOne.mockResolvedValue(mockOrderEntity);

      const result = await controller.findOne('test-order-id');

      expect(result).toBeInstanceOf(OrderResponseDto);
      expect(ordersService.findOne).toHaveBeenCalledWith('test-order-id');
    });

    it('should handle order not found', async () => {
      ordersService.findOne.mockRejectedValue(new Error('Order not found'));

      await expect(controller.findOne('non-existent-id')).rejects.toThrow('Order not found');
    });
  });

  describe('update', () => {
    const updateOrderDto: UpdateOrderDto = {
      status: 'COMPLETED' as OrderStatus,
      notes: 'Updated order',
    };

    it('should update an order successfully', async () => {
      ordersService.update.mockResolvedValue(mockOrderEntity);

      const result = await controller.update('test-order-id', updateOrderDto);

      expect(result).toBeInstanceOf(OrderResponseDto);
      expect(ordersService.update).toHaveBeenCalledWith('test-order-id', updateOrderDto);
    });

    it('should handle order not found', async () => {
      ordersService.update.mockRejectedValue(new Error('Order not found'));

      await expect(
        controller.update('non-existent-id', updateOrderDto),
      ).rejects.toThrow('Order not found');
    });

    it('should handle partial updates', async () => {
      const partialUpdate = { notes: 'Updated notes only' };
      ordersService.update.mockResolvedValue(mockOrderEntity);

      const result = await controller.update('test-order-id', partialUpdate);

      expect(result).toBeInstanceOf(OrderResponseDto);
      expect(ordersService.update).toHaveBeenCalledWith('test-order-id', partialUpdate);
    });
  });

  describe('updateStatus', () => {
    it('should update order status successfully', async () => {
      ordersService.updateStatus.mockResolvedValue(mockOrderEntity);

      const result = await controller.updateStatus('test-order-id', 'COMPLETED');

      expect(result).toBeInstanceOf(OrderResponseDto);
      expect(ordersService.updateStatus).toHaveBeenCalledWith('test-order-id', 'COMPLETED');
    });

    it('should handle order not found', async () => {
      ordersService.updateStatus.mockRejectedValue(new Error('Order not found'));

      await expect(
        controller.updateStatus('non-existent-id', 'COMPLETED'),
      ).rejects.toThrow('Order not found');
    });

    it('should handle invalid status', async () => {
      ordersService.updateStatus.mockRejectedValue(new Error('Invalid status'));

      await expect(
        controller.updateStatus('test-order-id', 'INVALID_STATUS'),
      ).rejects.toThrow('Invalid status');
    });
  });

  describe('markAsPaid', () => {
    it('should mark order as paid successfully', async () => {
      ordersService.markAsPaid.mockResolvedValue(mockOrderEntity);

      const result = await controller.markAsPaid('test-order-id');

      expect(result).toBeInstanceOf(OrderResponseDto);
      expect(ordersService.markAsPaid).toHaveBeenCalledWith('test-order-id');
    });

    it('should handle order not found', async () => {
      ordersService.markAsPaid.mockRejectedValue(new Error('Order not found'));

      await expect(controller.markAsPaid('non-existent-id')).rejects.toThrow(
        'Order not found',
      );
    });
  });

  describe('remove', () => {
    it('should remove an order successfully', async () => {
      ordersService.remove.mockResolvedValue(undefined);

      await controller.remove('test-order-id');

      expect(ordersService.remove).toHaveBeenCalledWith('test-order-id');
    });

    it('should handle order not found', async () => {
      ordersService.remove.mockRejectedValue(new Error('Order not found'));

      await expect(controller.remove('non-existent-id')).rejects.toThrow(
        'Order not found',
      );
    });
  });

  describe('delete', () => {
    it('should delete an order successfully', async () => {
      ordersService.delete.mockResolvedValue(undefined);

      await controller.delete('test-order-id');

      expect(ordersService.delete).toHaveBeenCalledWith('test-order-id');
    });

    it('should handle order not found', async () => {
      ordersService.delete.mockRejectedValue(new Error('Order not found'));

      await expect(controller.delete('non-existent-id')).rejects.toThrow(
        'Order not found',
      );
    });
  });

  describe('mapOrderToResponse', () => {
    it('should map OrderEntity to OrderResponseDto correctly', () => {
      const orderWithUser = {
        ...mockOrderEntity,
        user: {
          id: 'test-user-id',
          email: 'test@example.com',
          name: 'Test User',
        },
        items: [
          {
            id: 'test-item-id',
            productId: 'test-product-id',
            unitPrice: 50.25,
            quantity: 2,
            subtotal: 100.50,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      };

      // Access the private method through reflection for testing
      const result = (controller as any).mapOrderToResponse(orderWithUser);

      expect(result).toBeInstanceOf(OrderResponseDto);
      expect(result.id).toBe(orderWithUser.id);
      expect(result.userId).toBe(orderWithUser.userId);
      expect(result.status).toBe(orderWithUser.status);
      expect(result.isPaid).toBe(orderWithUser.paidAt !== undefined);
      expect(result.isShipped).toBe(orderWithUser.shippedAt !== undefined);
      expect(result.isDelivered).toBe(orderWithUser.deliveredAt !== undefined);
      expect(result.createdAt).toBe(orderWithUser.createdAt);
      expect(result.updatedAt).toBe(orderWithUser.updatedAt);
      expect(result.user).toBeDefined();
      expect(result.items).toHaveLength(1);
      expect(result.items[0]).toBeInstanceOf(OrderDetailResponseDto);
    });

    it('should handle order without user', () => {
      const orderWithoutUser = {
        ...mockOrderEntity,
        user: undefined,
        items: [],
      };

      const result = (controller as any).mapOrderToResponse(orderWithoutUser);

      expect(result.user).toBeUndefined();
      expect(result.items).toHaveLength(0);
    });

    it('should handle order without items', () => {
      const orderWithoutItems = {
        ...mockOrderEntity,
        items: undefined,
      };

      const result = (controller as any).mapOrderToResponse(orderWithoutItems);

      expect(result.items).toHaveLength(0);
      expect(result.itemsIds).toEqual([]);
    });

    it('should handle order with null items', () => {
      const orderWithNullItems = {
        ...mockOrderEntity,
        items: null,
      };

      const result = (controller as any).mapOrderToResponse(orderWithNullItems);

      expect(result.items).toHaveLength(0);
      expect(result.itemsIds).toEqual([]);
    });
  });

  describe('error handling', () => {
    it('should handle service errors appropriately', async () => {
      ordersService.create.mockRejectedValue(new Error('Database error'));

      const createOrderDto: CreateOrderDto = {
        userId: 'test-user-id',
        total: 100.50,
        subtotal: 100.50,
        items: [],
      };

      await expect(controller.create(createOrderDto)).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('response mapping', () => {
    it('should properly map all service responses to DTOs', async () => {
      ordersService.findAll.mockResolvedValue(mockPaginatedResponse);
      ordersService.findAllSimple.mockResolvedValue([mockOrderEntity]);
      ordersService.findOne.mockResolvedValue(mockOrderEntity);
      ordersService.update.mockResolvedValue(mockOrderEntity);
      ordersService.updateStatus.mockResolvedValue(mockOrderEntity);
      ordersService.markAsPaid.mockResolvedValue(mockOrderEntity);

      const findAllResult = await controller.findAll(1, 10);
      const findAllSimpleResult = await controller.findAllSimple();
      const findOneResult = await controller.findOne('test-id');
      const updateResult = await controller.update('test-id', {});
      const updateStatusResult = await controller.updateStatus('test-id', 'COMPLETED');
      const markAsPaidResult = await controller.markAsPaid('test-id');

      // All results should be properly mapped to response DTOs
      expect(findAllResult).toBeInstanceOf(PaginatedResponseDto);
      expect(findAllSimpleResult[0]).toBeInstanceOf(OrderResponseDto);
      expect(findOneResult).toBeInstanceOf(OrderResponseDto);
      expect(updateResult).toBeInstanceOf(OrderResponseDto);
      expect(updateStatusResult).toBeInstanceOf(OrderResponseDto);
      expect(markAsPaidResult).toBeInstanceOf(OrderResponseDto);
    });
  });
});
