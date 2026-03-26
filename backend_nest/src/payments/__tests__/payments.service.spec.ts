import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from '../payments.service';
import { Sequelize } from 'sequelize-typescript';
import { Payment } from '../models/payments.model';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { UpdatePaymentDto } from '../dto/update-payment.dto';
import { PaymentEntity } from '../entities/payment.entity';
import { PaymentStatus, PaymentMethod } from '../models/payments.model';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Order } from '../../orders/models/order.model';
import { User } from '../../users/models/user.model';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let sequelize: Sequelize;
  let paymentRepository: any;
  let orderRepository: any;
  let userRepository: any;

  const mockPayment = {
    id: 'test-payment-id',
    order_id: 'test-order-id',
    user_id: 'test-user-id',
    amount: 100.50,
    payment_method: PaymentMethod.CREDIT_CARD,
    status: PaymentStatus.PENDING,
    transaction_id: 'txn_123456',
    metadata: { gateway: 'stripe' },
    paid_at: null,
    notes: 'Test payment',
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
    toJSON: jest.fn().mockReturnValue({
      id: 'test-payment-id',
      order_id: 'test-order-id',
      user_id: 'test-user-id',
      amount: 100.50,
      payment_method: PaymentMethod.CREDIT_CARD,
      status: PaymentStatus.PENDING,
      transaction_id: 'txn_123456',
      metadata: { gateway: 'stripe' },
      paid_at: null,
      notes: 'Test payment',
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    }),
    update: jest.fn(),
    destroy: jest.fn(),
  };

  const mockOrder = {
    id: 'test-order-id',
    total: 100.50,
    status: 'pending',
  };

  const mockUser = {
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
  };

  beforeEach(async () => {
    const mockSequelize = {
      getRepository: jest.fn(),
      transaction: jest.fn(),
      fn: jest.fn(),
      col: jest.fn(),
    };

    paymentRepository = {
      create: jest.fn(),
      findOne: jest.fn(),
      findByPk: jest.fn(),
      findAll: jest.fn(),
      findAndCountAll: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
    };

    orderRepository = {
      findAll: jest.fn(),
    };

    userRepository = {
      findAll: jest.fn(),
    };

    mockSequelize.getRepository.mockImplementation((model) => {
      if (model === Payment) return paymentRepository;
      if (model === Order) return orderRepository;
      if (model === User) return userRepository;
      return null;
    });

    mockSequelize.transaction.mockImplementation(async (callback) => {
      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
      };
      return await callback(mockTransaction);
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: 'SEQUELIZE',
          useValue: mockSequelize,
        },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    sequelize = module.get<Sequelize>('SEQUELIZE');

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createPaymentDto: CreatePaymentDto = {
      order_id: 'test-order-id',
      user_id: 'test-user-id',
      amount: 100.50,
      payment_method: PaymentMethod.CREDIT_CARD,
      transaction_id: 'txn_123456',
      metadata: { gateway: 'stripe' },
      notes: 'Test payment',
    };

    it('should create a payment successfully', async () => {
      paymentRepository.findOne.mockResolvedValue(null);
      paymentRepository.create.mockResolvedValue(mockPayment);

      const result = await service.create(createPaymentDto);

      expect(result).toBeInstanceOf(PaymentEntity);
      expect(paymentRepository.findOne).toHaveBeenCalledWith({
        where: { order_id: createPaymentDto.order_id },
        transaction: expect.any(Object),
      });
      expect(paymentRepository.create).toHaveBeenCalled();
    });

    it('should create a completed payment with paid_at', async () => {
      const completedDto = {
        ...createPaymentDto,
        status: PaymentStatus.COMPLETED,
        paid_at: new Date(),
      };

      paymentRepository.findOne.mockResolvedValue(null);
      paymentRepository.create.mockResolvedValue({
        ...mockPayment,
        status: PaymentStatus.COMPLETED,
        paid_at: new Date(),
      });

      const result = await service.create(completedDto);

      expect(result.status).toBe(PaymentStatus.COMPLETED);
      expect(result.paid_at).toBeDefined();
    });

    it('should throw BadRequestException if payment already exists for order', async () => {
      paymentRepository.findOne.mockResolvedValue({
        ...mockPayment,
        status: PaymentStatus.COMPLETED,
      });

      await expect(service.create(createPaymentDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should allow creating payment for order with failed payment', async () => {
      paymentRepository.findOne.mockResolvedValue({
        ...mockPayment,
        status: PaymentStatus.FAILED,
      });
      paymentRepository.create.mockResolvedValue(mockPayment);

      const result = await service.create(createPaymentDto);

      expect(result).toBeInstanceOf(PaymentEntity);
    });

    it('should handle transaction rollback on error', async () => {
      paymentRepository.findOne.mockRejectedValue(new Error('Database error'));

      await expect(service.create(createPaymentDto)).rejects.toThrow('Database error');
    });
  });

  describe('findAll', () => {
    it('should return paginated payments with default values', async () => {
      const mockPayments = [mockPayment];
      const mockCount = 1;

      paymentRepository.findAndCountAll.mockResolvedValue({
        rows: mockPayments,
        count: mockCount,
      });

      const result = await service.findAll();

      expect(result.data).toHaveLength(1);
      expect(result.meta.page).toBe(1);
      expect(result.meta.limit).toBe(10);
      expect(result.meta.total_items).toBe(1);
      expect(result.meta.total_pages).toBe(1);
      expect(result.meta.has_next_page).toBe(false);
      expect(result.meta.has_previous_page).toBe(false);
    });

    it('should return paginated payments with custom values', async () => {
      const mockPayments = [mockPayment];
      const mockCount = 25;

      paymentRepository.findAndCountAll.mockResolvedValue({
        rows: mockPayments,
        count: mockCount,
      });

      const result = await service.findAll({ page: 2, limit: 5 });

      expect(result.meta.page).toBe(2);
      expect(result.meta.limit).toBe(5);
      expect(result.meta.total_pages).toBe(5);
      expect(result.meta.has_next_page).toBe(true);
      expect(result.meta.has_previous_page).toBe(true);
    });

    it('should handle invalid pagination values', async () => {
      paymentRepository.findAndCountAll.mockResolvedValue({
        rows: [],
        count: 0,
      });

      const result = await service.findAll({ page: 0, limit: -1 });

      expect(result.meta.page).toBe(1);
      expect(result.meta.limit).toBe(10);
    });

    it('should include Order and User in query', async () => {
      paymentRepository.findAndCountAll.mockResolvedValue({
        rows: [mockPayment],
        count: 1,
      });

      await service.findAll();

      expect(paymentRepository.findAndCountAll).toHaveBeenCalledWith({
        order: [['createdAt', 'DESC']],
        include: [Order, User],
        limit: 10,
        offset: 0,
        distinct: true,
      });
    });
  });

  describe('findOne', () => {
    it('should return a payment by id', async () => {
      paymentRepository.findByPk.mockResolvedValue(mockPayment);

      const result = await service.findOne('test-payment-id');

      expect(result).toBeInstanceOf(PaymentEntity);
      expect(paymentRepository.findByPk).toHaveBeenCalledWith('test-payment-id');
    });

    it('should throw NotFoundException if payment not found', async () => {
      paymentRepository.findByPk.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByOrderId', () => {
    it('should return payments by order id', async () => {
      const mockPayments = [mockPayment];
      paymentRepository.findAll.mockResolvedValue(mockPayments);

      const result = await service.findByOrderId('test-order-id');

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(PaymentEntity);
      expect(paymentRepository.findAll).toHaveBeenCalledWith({
        where: { order_id: 'test-order-id' },
        order: [['created_at', 'DESC']],
      });
    });

    it('should return empty array if no payments found for order', async () => {
      paymentRepository.findAll.mockResolvedValue([]);

      const result = await service.findByOrderId('non-existent-order-id');

      expect(result).toHaveLength(0);
    });
  });

  describe('update', () => {
    const updatePaymentDto: UpdatePaymentDto = {
      status: PaymentStatus.COMPLETED,
      notes: 'Updated payment',
    };

    it('should update a payment successfully', async () => {
      paymentRepository.findByPk.mockResolvedValue(mockPayment);
      mockPayment.update.mockResolvedValue(mockPayment);

      const result = await service.update('test-payment-id', updatePaymentDto);

      expect(result).toBeInstanceOf(PaymentEntity);
      expect(paymentRepository.findByPk).toHaveBeenCalledWith('test-payment-id', {
        transaction: expect.any(Object),
      });
      expect(mockPayment.update).toHaveBeenCalledWith(updatePaymentDto, {
        transaction: expect.any(Object),
      });
    });

    it('should set paid_at when status changes to COMPLETED', async () => {
      const pendingPayment = { ...mockPayment, status: PaymentStatus.PENDING };
      paymentRepository.findByPk.mockResolvedValue(pendingPayment);
      pendingPayment.update.mockResolvedValue({
        ...pendingPayment,
        status: PaymentStatus.COMPLETED,
        paid_at: new Date(),
      });

      const result = await service.update('test-payment-id', updatePaymentDto);

      expect(updatePaymentDto.paid_at).toBeDefined();
      expect(updatePaymentDto.paid_at).toBeInstanceOf(Date);
    });

    it('should not set paid_at if status was already COMPLETED', async () => {
      const completedPayment = { ...mockPayment, status: PaymentStatus.COMPLETED };
      paymentRepository.findByPk.mockResolvedValue(completedPayment);
      completedPayment.update.mockResolvedValue(completedPayment);

      await service.update('test-payment-id', {
        status: PaymentStatus.COMPLETED,
        notes: 'Updated',
      });

      expect(updatePaymentDto.paid_at).toBeUndefined();
    });

    it('should throw NotFoundException if payment not found', async () => {
      paymentRepository.findByPk.mockResolvedValue(null);

      await expect(
        service.update('non-existent-id', updatePaymentDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should handle transaction rollback on error', async () => {
      paymentRepository.findByPk.mockRejectedValue(new Error('Database error'));

      await expect(
        service.update('test-payment-id', updatePaymentDto),
      ).rejects.toThrow('Database error');
    });
  });

  describe('remove', () => {
    it('should remove a payment successfully', async () => {
      paymentRepository.findByPk.mockResolvedValue(mockPayment);
      mockPayment.destroy.mockResolvedValue(mockPayment);

      await service.remove('test-payment-id');

      expect(paymentRepository.findByPk).toHaveBeenCalledWith('test-payment-id', {
        transaction: expect.any(Object),
      });
      expect(mockPayment.destroy).toHaveBeenCalledWith({
        transaction: expect.any(Object),
      });
    });

    it('should throw NotFoundException if payment not found', async () => {
      paymentRepository.findByPk.mockResolvedValue(null);

      await expect(service.remove('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if payment is completed', async () => {
      const completedPayment = { ...mockPayment, status: PaymentStatus.COMPLETED };
      paymentRepository.findByPk.mockResolvedValue(completedPayment);

      await expect(service.remove('test-payment-id')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should allow removal of non-completed payments', async () => {
      const pendingPayment = { ...mockPayment, status: PaymentStatus.PENDING };
      paymentRepository.findByPk.mockResolvedValue(pendingPayment);
      pendingPayment.destroy.mockResolvedValue(pendingPayment);

      await expect(service.remove('test-payment-id')).resolves.not.toThrow();
    });
  });

  describe('processRefund', () => {
    it('should refund a completed payment successfully', async () => {
      const completedPayment = { ...mockPayment, status: PaymentStatus.COMPLETED };
      paymentRepository.findByPk.mockResolvedValue(completedPayment);
      completedPayment.update.mockResolvedValue({
        ...completedPayment,
        status: PaymentStatus.REFUNDED,
        notes: 'Reembolsado: Customer request',
      });

      const result = await service.processRefund('test-payment-id', 'Customer request');

      expect(result).toBeDefined();
      expect(paymentRepository.findByPk).toHaveBeenCalledWith('test-payment-id', {
        transaction: expect.any(Object),
      });
      expect(completedPayment.update).toHaveBeenCalledWith(
        {
          status: PaymentStatus.REFUNDED,
          notes: 'Reembolsado: Customer request',
        },
        { transaction: expect.any(Object) },
      );
    });

    it('should refund without reason', async () => {
      const completedPayment = { ...mockPayment, status: PaymentStatus.COMPLETED };
      paymentRepository.findByPk.mockResolvedValue(completedPayment);
      completedPayment.update.mockResolvedValue({
        ...completedPayment,
        status: PaymentStatus.REFUNDED,
      });

      const result = await service.processRefund('test-payment-id');

      expect(result).toBeDefined();
      expect(completedPayment.update).toHaveBeenCalledWith(
        {
          status: PaymentStatus.REFUNDED,
          notes: completedPayment.notes,
        },
        { transaction: expect.any(Object) },
      );
    });

    it('should throw NotFoundException if payment not found', async () => {
      paymentRepository.findByPk.mockResolvedValue(null);

      await expect(
        service.processRefund('non-existent-id'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if payment is not completed', async () => {
      const pendingPayment = { ...mockPayment, status: PaymentStatus.PENDING };
      paymentRepository.findByPk.mockResolvedValue(pendingPayment);

      await expect(
        service.processRefund('test-payment-id'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getPaymentStats', () => {
    it('should return payment stats for all users', async () => {
      const mockStats = [
        {
          status: PaymentStatus.COMPLETED,
          count: 10,
          total_amount: 1000,
        },
        {
          status: PaymentStatus.PENDING,
          count: 5,
          total_amount: 500,
        },
      ];

      paymentRepository.findAll.mockResolvedValue(mockStats);

      const result = await service.getPaymentStats();

      expect(result).toHaveLength(2);
      expect(result[0].status).toBe(PaymentStatus.COMPLETED);
      expect(result[0].count).toBe(10);
      expect(result[0].total_amount).toBe(1000);
      expect(paymentRepository.findAll).toHaveBeenCalledWith({
        where: {},
        attributes: [
          'status',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
          [sequelize.fn('SUM', sequelize.col('amount')), 'total_amount'],
        ],
        group: ['status'],
      });
    });

    it('should return payment stats for specific user', async () => {
      const mockStats = [
        {
          status: PaymentStatus.COMPLETED,
          count: 3,
          total_amount: 300,
        },
      ];

      paymentRepository.findAll.mockResolvedValue(mockStats);

      const result = await service.getPaymentStats('test-user-id');

      expect(result).toHaveLength(1);
      expect(paymentRepository.findAll).toHaveBeenCalledWith({
        where: { user_id: 'test-user-id' },
        attributes: [
          'status',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
          [sequelize.fn('SUM', sequelize.col('amount')), 'total_amount'],
        ],
        group: ['status'],
      });
    });

    it('should return empty array if no stats found', async () => {
      paymentRepository.findAll.mockResolvedValue([]);

      const result = await service.getPaymentStats();

      expect(result).toHaveLength(0);
    });
  });
});
