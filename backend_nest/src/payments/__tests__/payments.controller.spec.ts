import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from '../payments.controller';
import { PaymentsService } from '../payments.service';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { UpdatePaymentDto } from '../dto/update-payment.dto';
import { PaymentResponseDto } from '../dto/payment-response.dto';
import { PaginatedPaymentResponseDto } from '../dto/paginated-payments.dto';
import { PaymentEntity } from '../entities/payment.entity';
import { PaymentStatus, PaymentMethod } from '../models/payments.model';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('PaymentsController', () => {
  let controller: PaymentsController;
  let paymentsService: jest.Mocked<PaymentsService>;

  const mockPaymentEntity: PaymentEntity = {
    id: 'test-payment-id',
    order_id: 'test-order-id',
    user_id: 'test-user-id',
    amount: 100.50,
    payment_method: PaymentMethod.CREDIT_CARD,
    status: PaymentStatus.PENDING,
    transaction_id: 'txn_123456',
    metadata: { gateway: 'stripe' },
    paid_at: undefined,
    notes: 'Test payment',
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: undefined,
  };

  const mockPaymentResponse: PaymentResponseDto = new PaymentResponseDto(mockPaymentEntity);

  const mockPaginatedResponse: PaginatedPaymentResponseDto = {
    data: [mockPaymentResponse],
    meta: {
      page: 1,
      limit: 10,
      total_items: 1,
      total_pages: 1,
      has_next_page: false,
      has_previous_page: false,
    },
  };

  beforeEach(async () => {
    const mockPaymentsService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      findByOrderId: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      processRefund: jest.fn(),
      getPaymentStats: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [
        {
          provide: PaymentsService,
          useValue: mockPaymentsService,
        },
      ],
    }).compile();

    controller = module.get<PaymentsController>(PaymentsController);
    paymentsService = module.get(PaymentsService) as jest.Mocked<PaymentsService>;

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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
      paymentsService.create.mockResolvedValue(mockPaymentEntity);

      const result = await controller.create(createPaymentDto);

      expect(result).toBeInstanceOf(PaymentResponseDto);
      expect(paymentsService.create).toHaveBeenCalledWith(createPaymentDto);
      expect(result.id).toBe(mockPaymentEntity.id);
    });

    it('should throw BadRequestException for duplicate order payment', async () => {
      paymentsService.create.mockRejectedValue(
        new BadRequestException('Ya existe un pago para esta orden'),
      );

      await expect(controller.create(createPaymentDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated payments with default values', async () => {
      paymentsService.findAll.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findAll();

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result.data).toHaveLength(1);
      expect(result.meta.page).toBe(1);
      expect(result.meta.limit).toBe(10);
      expect(paymentsService.findAll).toHaveBeenCalledWith({ page: 1, limit: 10 });
    });

    it('should return paginated payments with custom values', async () => {
      paymentsService.findAll.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findAll(2, 5);

      expect(result.meta.page).toBe(2);
      expect(result.meta.limit).toBe(5);
      expect(paymentsService.findAll).toHaveBeenCalledWith({ page: 2, limit: 5 });
    });

    it('should handle zero page and limit', async () => {
      paymentsService.findAll.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findAll(0, 0);

      expect(paymentsService.findAll).toHaveBeenCalledWith({ page: 1, limit: 10 });
    });
  });

  describe('getStats', () => {
    it('should return payment stats', async () => {
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

      paymentsService.getPaymentStats.mockResolvedValue(mockStats);

      const result = await controller.getStats();

      expect(result).toEqual(mockStats);
      expect(paymentsService.getPaymentStats).toHaveBeenCalledWith(undefined);
    });

    it('should return payment stats for specific user', async () => {
      const mockStats = [
        {
          status: PaymentStatus.COMPLETED,
          count: 3,
          total_amount: 300,
        },
      ];

      paymentsService.getPaymentStats.mockResolvedValue(mockStats);

      const result = await controller.getStats('test-user-id');

      expect(result).toEqual(mockStats);
      expect(paymentsService.getPaymentStats).toHaveBeenCalledWith('test-user-id');
    });
  });

  describe('findOne', () => {
    it('should return a payment by id', async () => {
      paymentsService.findOne.mockResolvedValue(mockPaymentEntity);

      const result = await controller.findOne('test-payment-id');

      expect(result).toBeInstanceOf(PaymentResponseDto);
      expect(paymentsService.findOne).toHaveBeenCalledWith('test-payment-id');
      expect(result.id).toBe(mockPaymentEntity.id);
    });

    it('should throw NotFoundException if payment not found', async () => {
      paymentsService.findOne.mockRejectedValue(
        new NotFoundException('Pago con ID test-payment-id no encontrado'),
      );

      await expect(controller.findOne('test-payment-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByOrderId', () => {
    it('should return payments by order id', async () => {
      const mockPayments = [mockPaymentEntity];
      const mockResponses = [mockPaymentResponse];
      paymentsService.findByOrderId.mockResolvedValue(mockPayments);

      const result = await controller.findByOrderId('test-order-id');

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(PaymentResponseDto);
      expect(paymentsService.findByOrderId).toHaveBeenCalledWith('test-order-id');
    });

    it('should return empty array if no payments found for order', async () => {
      paymentsService.findByOrderId.mockResolvedValue([]);

      const result = await controller.findByOrderId('non-existent-order-id');

      expect(result).toHaveLength(0);
    });
  });

  describe('update', () => {
    const updatePaymentDto: UpdatePaymentDto = {
      status: PaymentStatus.COMPLETED,
      notes: 'Updated payment',
    };

    it('should update a payment successfully', async () => {
      paymentsService.update.mockResolvedValue(mockPaymentEntity);

      const result = await controller.update('test-payment-id', updatePaymentDto);

      expect(result).toBeInstanceOf(PaymentResponseDto);
      expect(paymentsService.update).toHaveBeenCalledWith(
        'test-payment-id',
        updatePaymentDto,
      );
      expect(result.id).toBe(mockPaymentEntity.id);
    });

    it('should throw NotFoundException if payment not found', async () => {
      paymentsService.update.mockRejectedValue(
        new NotFoundException('Pago con ID test-payment-id no encontrado'),
      );

      await expect(
        controller.update('test-payment-id', updatePaymentDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should handle partial updates', async () => {
      const partialUpdate = { status: PaymentStatus.FAILED };
      paymentsService.update.mockResolvedValue(mockPaymentEntity);

      const result = await controller.update('test-payment-id', partialUpdate);

      expect(result).toBeInstanceOf(PaymentResponseDto);
      expect(paymentsService.update).toHaveBeenCalledWith(
        'test-payment-id',
        partialUpdate,
      );
    });
  });

  describe('remove', () => {
    it('should remove a payment successfully', async () => {
      paymentsService.remove.mockResolvedValue(undefined);

      await controller.remove('test-payment-id');

      expect(paymentsService.remove).toHaveBeenCalledWith('test-payment-id');
    });

    it('should throw NotFoundException if payment not found', async () => {
      paymentsService.remove.mockRejectedValue(
        new NotFoundException('Pago con ID test-payment-id no encontrado'),
      );

      await expect(controller.remove('test-payment-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if payment is completed', async () => {
      paymentsService.remove.mockRejectedValue(
        new BadRequestException('No se puede eliminar un pago completado'),
      );

      await expect(controller.remove('test-payment-id')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('refund', () => {
    it('should refund a payment successfully', async () => {
      paymentsService.processRefund.mockResolvedValue(mockPaymentResponse);

      const result = await controller.refund('test-payment-id', 'Customer request');

      expect(result).toBeInstanceOf(PaymentResponseDto);
      expect(paymentsService.processRefund).toHaveBeenCalledWith(
        'test-payment-id',
        'Customer request',
      );
    });

    it('should refund a payment without reason', async () => {
      paymentsService.processRefund.mockResolvedValue(mockPaymentResponse);

      const result = await controller.refund('test-payment-id');

      expect(result).toBeInstanceOf(PaymentResponseDto);
      expect(paymentsService.processRefund).toHaveBeenCalledWith(
        'test-payment-id',
        undefined,
      );
    });

    it('should throw NotFoundException if payment not found', async () => {
      paymentsService.processRefund.mockRejectedValue(
        new NotFoundException('Pago con ID test-payment-id no encontrado'),
      );

      await expect(controller.refund('test-payment-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if payment cannot be refunded', async () => {
      paymentsService.processRefund.mockRejectedValue(
        new BadRequestException('Solo se pueden reembolsar pagos completados'),
      );

      await expect(controller.refund('test-payment-id')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('error handling', () => {
    it('should handle service errors appropriately', async () => {
      paymentsService.create.mockRejectedValue(new Error('Database error'));

      const createPaymentDto: CreatePaymentDto = {
        order_id: 'test-order-id',
        user_id: 'test-user-id',
        amount: 100.50,
        payment_method: PaymentMethod.CREDIT_CARD,
      };

      await expect(controller.create(createPaymentDto)).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('response mapping', () => {
    it('should properly map PaymentEntity to PaymentResponseDto in all methods', async () => {
      paymentsService.findAll.mockResolvedValue(mockPaginatedResponse);
      paymentsService.findOne.mockResolvedValue(mockPaymentEntity);
      paymentsService.findByOrderId.mockResolvedValue([mockPaymentEntity]);
      paymentsService.create.mockResolvedValue(mockPaymentEntity);
      paymentsService.update.mockResolvedValue(mockPaymentEntity);
      paymentsService.processRefund.mockResolvedValue(mockPaymentResponse);

      const findAllResult = await controller.findAll();
      const findOneResult = await controller.findOne('test-id');
      const findByOrderIdResult = await controller.findByOrderId('test-order-id');
      const createResult = await controller.create({
        order_id: 'test-order-id',
        user_id: 'test-user-id',
        amount: 100.50,
        payment_method: PaymentMethod.CREDIT_CARD,
      });
      const updateResult = await controller.update('test-id', { status: PaymentStatus.COMPLETED });
      const refundResult = await controller.refund('test-id');

      // All results should be instances of PaymentResponseDto
      expect(findAllResult.data[0]).toBeInstanceOf(PaymentResponseDto);
      expect(findOneResult).toBeInstanceOf(PaymentResponseDto);
      expect(findByOrderIdResult[0]).toBeInstanceOf(PaymentResponseDto);
      expect(createResult).toBeInstanceOf(PaymentResponseDto);
      expect(updateResult).toBeInstanceOf(PaymentResponseDto);
      expect(refundResult).toBeInstanceOf(PaymentResponseDto);
    });
  });

  describe('parameter validation', () => {
    it('should handle UUID parameter validation', async () => {
      paymentsService.findOne.mockResolvedValue(mockPaymentEntity);

      const result = await controller.findOne('valid-uuid-format');

      expect(result).toBeInstanceOf(PaymentResponseDto);
      expect(paymentsService.findOne).toHaveBeenCalledWith('valid-uuid-format');
    });
  });
});
