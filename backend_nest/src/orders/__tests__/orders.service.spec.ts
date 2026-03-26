import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from '../orders.service';
import { Sequelize } from 'sequelize-typescript';
import { Order } from '../models/order.model';
import { OrderDetail } from '../models/order-detail.model';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { OrderEntity } from '../entities/order.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { User } from '../../users/models/user.model';
import { OrderStatus } from '../models/order.model';

describe('OrdersService', () => {
  let service: OrdersService;
  let sequelize: Sequelize;
  let orderRepository: any;
  let orderDetailRepository: any;
  let userRepository: any;

  const mockOrder = {
    id: 'test-order-id',
    userId: 'test-user-id',
    total: 100.50,
    status: 'PENDING',
    notes: 'Test order',
    shippingAddress: { street: '123 Test St' },
    billingAddress: { street: '456 Billing St' },
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    toJSON: jest.fn().mockReturnValue({
      id: 'test-order-id',
      userId: 'test-user-id',
      total: 100.50,
      status: 'PENDING',
      notes: 'Test order',
      shippingAddress: { street: '123 Test St' },
      billingAddress: { street: '456 Billing St' },
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    }),
    update: jest.fn(),
    destroy: jest.fn(),
    reload: jest.fn(),
  };

  const mockOrderDetail = {
    id: 'test-detail-id',
    orderId: 'test-order-id',
    productId: 'test-product-id',
    productName: 'Test Product',
    quantity: 2,
    unitPrice: 50.25,
    subtotal: 100.50,
    createdAt: new Date(),
    updatedAt: new Date(),
    toJSON: jest.fn().mockReturnValue({
      id: 'test-detail-id',
      orderId: 'test-order-id',
      productId: 'test-product-id',
      productName: 'Test Product',
      quantity: 2,
      unitPrice: 50.25,
      subtotal: 100.50,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
  };

  const mockUser = {
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
  };

  beforeEach(async () => {
    const mockSequelize = {
      getRepository: jest.fn(),
    };

    orderRepository = {
      create: jest.fn(),
      findByPk: jest.fn(),
      findAll: jest.fn(),
      findAndCountAll: jest.fn(),
      count: jest.fn(),
      sum: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
    };

    orderDetailRepository = {
      create: jest.fn(),
    };

    userRepository = {
      findAll: jest.fn(),
    };

    mockSequelize.getRepository.mockImplementation((model) => {
      if (model === Order) return orderRepository;
      if (model === OrderDetail) return orderDetailRepository;
      if (model === User) return userRepository;
      return null;
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: 'SEQUELIZE',
          useValue: mockSequelize,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    sequelize = module.get<Sequelize>('SEQUELIZE');

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
      orderRepository.create.mockResolvedValue(mockOrder);
      orderDetailRepository.create.mockResolvedValue(mockOrderDetail);

      const result = await service.create(createOrderDto);

      expect(result).toBeInstanceOf(OrderEntity);
      expect(orderRepository.create).toHaveBeenCalledWith(createOrderDto);
      expect(orderDetailRepository.create).toHaveBeenCalledTimes(1);
    });

    it('should create order with multiple items', async () => {
      const multiItemDto: CreateOrderDto = {
        userId: 'test-user-id',
        total: 200.00,
        subtotal: 200.00,
        items: [
          {
            productId: 'product-1',
            productName: 'Product 1',
            quantity: 1,
            unitPrice: 100.00,
            subtotal: 100.00,
          },
          {
            productId: 'product-2',
            productName: 'Product 2',
            quantity: 2,
            unitPrice: 50.00,
            subtotal: 100.00,
          },
        ],
      };

      orderRepository.create.mockResolvedValue(mockOrder);
      orderDetailRepository.create.mockResolvedValue(mockOrderDetail);

      await service.create(multiItemDto);

      expect(orderDetailRepository.create).toHaveBeenCalledTimes(2);
    });

    it('should handle database error during order creation', async () => {
      orderRepository.create.mockRejectedValue(new Error('Database error'));

      await expect(service.create(createOrderDto)).rejects.toThrow('Database error');
    });
  });

  describe('findAll', () => {
    it('should return paginated orders with default values', async () => {
      const mockOrders = [mockOrder];
      const mockCount = 1;

      orderRepository.findAndCountAll.mockResolvedValue({
        rows: mockOrders,
        count: mockCount,
      });

      const result = await service.findAll();

      expect(result.data).toHaveLength(1);
      expect(result.meta.page).toBe(1);
      expect(result.meta.limit).toBe(10);
      expect(result.meta.total).toBe(1);
      expect(result.meta.totalPages).toBe(1);
      expect(result.meta.hasNextPage).toBe(false);
      expect(result.meta.hasPreviousPage).toBe(false);
    });

    it('should return paginated orders with custom values', async () => {
      const mockOrders = [mockOrder];
      const mockCount = 25;

      orderRepository.findAndCountAll.mockResolvedValue({
        rows: mockOrders,
        count: mockCount,
      });

      const result = await service.findAll({ page: 2, limit: 5 });

      expect(result.meta.page).toBe(2);
      expect(result.meta.limit).toBe(5);
      expect(result.meta.totalPages).toBe(5);
      expect(result.meta.hasNextPage).toBe(true);
      expect(result.meta.hasPreviousPage).toBe(true);
    });

    it('should handle invalid pagination values', async () => {
      orderRepository.findAndCountAll.mockResolvedValue({
        rows: [],
        count: 0,
      });

      const result = await service.findAll({ page: 0, limit: -1 });

      expect(result.meta.page).toBe(1);
      expect(result.meta.limit).toBe(10);
    });

    it('should include User and OrderDetail in query', async () => {
      orderRepository.findAndCountAll.mockResolvedValue({
        rows: [mockOrder],
        count: 1,
      });

      await service.findAll();

      expect(orderRepository.findAndCountAll).toHaveBeenCalledWith({
        order: [['createdAt', 'DESC']],
        include: [User, OrderDetail],
        limit: 10,
        offset: 0,
        distinct: true,
      });
    });
  });

  describe('findAllSimple', () => {
    it('should return all orders without pagination', async () => {
      const mockOrders = [mockOrder];
      orderRepository.findAll.mockResolvedValue(mockOrders);

      const result = await service.findAllSimple();

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(OrderEntity);
    });

    it('should include User and OrderDetail in query', async () => {
      orderRepository.findAll.mockResolvedValue([mockOrder]);

      await service.findAllSimple();

      expect(orderRepository.findAll).toHaveBeenCalledWith({
        include: [User, OrderDetail],
        order: [['createdAt', 'DESC']],
      });
    });

    it('should return empty array when no orders exist', async () => {
      orderRepository.findAll.mockResolvedValue([]);

      const result = await service.findAllSimple();

      expect(result).toHaveLength(0);
    });
  });

  describe('findOne', () => {
    it('should return an order by id', async () => {
      orderRepository.findByPk.mockResolvedValue(mockOrder);

      const result = await service.findOne('test-order-id');

      expect(result).toBeInstanceOf(OrderEntity);
      expect(orderRepository.findByPk).toHaveBeenCalledWith('test-order-id', {
        include: [User, OrderDetail],
      });
    });

    it('should throw NotFoundException if order not found', async () => {
      orderRepository.findByPk.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByUser', () => {
    it('should return orders by user id', async () => {
      const mockOrders = [mockOrder];
      orderRepository.findAll.mockResolvedValue(mockOrders);

      const result = await service.findByUser('test-user-id');

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(OrderEntity);
      expect(orderRepository.findAll).toHaveBeenCalledWith({
        where: { userId: 'test-user-id' },
        include: [User, OrderDetail],
        order: [['createdAt', 'DESC']],
      });
    });

    it('should return empty array if user has no orders', async () => {
      orderRepository.findAll.mockResolvedValue([]);

      const result = await service.findByUser('non-existent-user-id');

      expect(result).toHaveLength(0);
    });
  });

  describe('update', () => {
    const updateOrderDto: UpdateOrderDto = {
      status: OrderStatus.COMPLETED,
      notes: 'Updated order',
    };

    it('should update an order successfully', async () => {
      orderRepository.findByPk.mockResolvedValue(mockOrder);
      mockOrder.reload.mockResolvedValue({ ...mockOrder, ...updateOrderDto });

      const result = await service.update('test-order-id', updateOrderDto);

      expect(result).toBeInstanceOf(OrderEntity);
      expect(orderRepository.findByPk).toHaveBeenCalledWith('test-order-id', {
        include: [User, OrderDetail],
      });
      expect(mockOrder.update).toHaveBeenCalledWith(updateOrderDto);
      expect(mockOrder.reload).toHaveBeenCalledWith({
        include: [User, OrderDetail],
      });
    });

    it('should throw NotFoundException if order not found', async () => {
      orderRepository.findByPk.mockResolvedValue(null);

      await expect(
        service.update('non-existent-id', updateOrderDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should handle partial updates', async () => {
      const partialUpdate = { status: OrderStatus.PROCESSING };
      orderRepository.findByPk.mockResolvedValue(mockOrder);
      mockOrder.reload.mockResolvedValue({ ...mockOrder, ...partialUpdate });

      const result = await service.update('test-order-id', partialUpdate);

      expect(result).toBeInstanceOf(OrderEntity);
      expect(mockOrder.update).toHaveBeenCalledWith(partialUpdate);
    });
  });

  describe('remove', () => {
    it('should remove an order successfully', async () => {
      orderRepository.findByPk.mockResolvedValue(mockOrder);

      await service.remove('test-order-id');

      expect(orderRepository.findByPk).toHaveBeenCalledWith('test-order-id');
      expect(mockOrder.destroy).toHaveBeenCalled();
    });

    it('should throw NotFoundException if order not found', async () => {
      orderRepository.findByPk.mockResolvedValue(null);

      await expect(service.remove('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should perform soft delete', async () => {
      orderRepository.findByPk.mockResolvedValue(mockOrder);

      await service.remove('test-order-id');

      expect(mockOrder.destroy).toHaveBeenCalledWith(); // Should be soft delete by default
    });
  });

  describe('delete', () => {
    it('should hard delete an order successfully', async () => {
      orderRepository.findByPk.mockResolvedValue(mockOrder);

      await service.delete('test-order-id');

      expect(orderRepository.findByPk).toHaveBeenCalledWith('test-order-id', {
        paranoid: false,
      });
      expect(mockOrder.destroy).toHaveBeenCalledWith({ force: true });
    });

    it('should throw NotFoundException if order not found', async () => {
      orderRepository.findByPk.mockResolvedValue(null);

      await expect(service.delete('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateStatus', () => {
    it('should update order status successfully', async () => {
      orderRepository.findByPk.mockResolvedValue(mockOrder);
      mockOrder.reload.mockResolvedValue({ ...mockOrder, status: 'COMPLETED' });

      const result = await service.updateStatus('test-order-id', 'COMPLETED');

      expect(result).toBeInstanceOf(OrderEntity);
      expect(orderRepository.findByPk).toHaveBeenCalledWith('test-order-id');
      expect(mockOrder.update).toHaveBeenCalledWith({ status: 'COMPLETED' });
      expect(mockOrder.reload).toHaveBeenCalledWith({ include: [User] });
    });

    it('should throw NotFoundException if order not found', async () => {
      orderRepository.findByPk.mockResolvedValue(null);

      await expect(
        service.updateStatus('non-existent-id', 'COMPLETED'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for invalid status', async () => {
      orderRepository.findByPk.mockResolvedValue(mockOrder);

      await expect(
        service.updateStatus('test-order-id', 'INVALID_STATUS'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should accept all valid statuses', async () => {
      const validStatuses = ['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED', 'REFUNDED'];
      
      for (const status of validStatuses) {
        orderRepository.findByPk.mockResolvedValue(mockOrder);
        mockOrder.reload.mockResolvedValue({ ...mockOrder, status });

        const result = await service.updateStatus('test-order-id', status);

        expect(result).toBeInstanceOf(OrderEntity);
        expect(mockOrder.update).toHaveBeenCalledWith({ status });
      }
    });
  });

  describe('markAsPaid', () => {
    it('should mark order as paid successfully', async () => {
      orderRepository.findByPk.mockResolvedValue(mockOrder);
      mockOrder.reload.mockResolvedValue({
        ...mockOrder,
        status: 'PROCESSING',
        paidAt: new Date(),
      });

      const result = await service.markAsPaid('test-order-id');

      expect(result).toBeInstanceOf(OrderEntity);
      expect(orderRepository.findByPk).toHaveBeenCalledWith('test-order-id');
      expect(mockOrder.update).toHaveBeenCalledWith({
        status: 'PROCESSING',
        paidAt: expect.any(Date),
      });
      expect(mockOrder.reload).toHaveBeenCalledWith({ include: [User] });
    });

    it('should throw NotFoundException if order not found', async () => {
      orderRepository.findByPk.mockResolvedValue(null);

      await expect(service.markAsPaid('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getOrderStats', () => {
    it('should return order statistics', async () => {
      orderRepository.count.mockResolvedValue(100);
      orderRepository.sum.mockResolvedValue(5000);
      orderRepository.count.mockResolvedValue(25);

      const result = await service.getOrderStats();

      expect(result).toEqual({
        totalOrders: 100,
        totalRevenue: 5000,
        pendingOrders: 25,
      });
      expect(orderRepository.count).toHaveBeenCalledWith({});
      expect(orderRepository.sum).toHaveBeenCalledWith('total');
      expect(orderRepository.count).toHaveBeenCalledWith({
        where: { status: 'PENDING' },
      });
    });

    it('should handle empty statistics', async () => {
      orderRepository.count.mockResolvedValue(0);
      orderRepository.sum.mockResolvedValue(0);
      orderRepository.count.mockResolvedValue(0);

      const result = await service.getOrderStats();

      expect(result).toEqual({
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
      });
    });
  });
});
