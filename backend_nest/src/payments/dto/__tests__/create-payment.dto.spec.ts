import { validate } from 'class-validator';
import { CreatePaymentDto } from '../create-payment.dto';
import { PaymentMethod, PaymentStatus } from '../../models/payments.model';
import { plainToInstance } from 'class-transformer';

describe('CreatePaymentDto', () => {
  const validPaymentData = {
    order_id: '123e4567-e89b-12d3-a456-426614174000',
    user_id: '123e4567-e89b-12d3-a456-426614174001',
    amount: 100.50,
    payment_method: PaymentMethod.CREDIT_CARD,
    status: PaymentStatus.PENDING,
    transaction_id: 'txn_123456',
    metadata: { gateway: 'stripe' },
    paid_at: new Date(),
    notes: 'Test payment',
  };

  describe('validation', () => {
    it('should validate a complete payment', async () => {
      const dto = plainToInstance(CreatePaymentDto, validPaymentData);
      const errors = await validate(dto);

      expect(errors.length).toBe(0);
    });

    it('should validate with only required fields', async () => {
      const requiredOnly = {
        order_id: '123e4567-e89b-12d3-a456-426614174000',
        user_id: '123e4567-e89b-12d3-a456-426614174001',
        amount: 100.50,
        payment_method: PaymentMethod.CREDIT_CARD,
      };

      const dto = plainToInstance(CreatePaymentDto, requiredOnly);
      const errors = await validate(dto);

      expect(errors.length).toBe(0);
    });

    it('should require order_id', async () => {
      const dto = plainToInstance(CreatePaymentDto, { ...validPaymentData, order_id: '' });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('order_id');
    });

    it('should validate order_id UUID format', async () => {
      const dto = plainToInstance(CreatePaymentDto, { ...validPaymentData, order_id: 'invalid-uuid' });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('order_id');
    });

    it('should require user_id', async () => {
      const dto = plainToInstance(CreatePaymentDto, { ...validPaymentData, user_id: '' });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('user_id');
    });

    it('should validate user_id UUID format', async () => {
      const dto = plainToInstance(CreatePaymentDto, { ...validPaymentData, user_id: 'invalid-uuid' });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('user_id');
    });

    it('should require amount', async () => {
      const dto = plainToInstance(CreatePaymentDto, { ...validPaymentData, amount: undefined as any });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('amount');
    });

    it('should validate amount is number', async () => {
      const dto = plainToInstance(CreatePaymentDto, { ...validPaymentData, amount: 'not-a-number' as any });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('amount');
    });

    it('should validate amount minimum value', async () => {
      const dto = plainToInstance(CreatePaymentDto, { ...validPaymentData, amount: -10 });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('amount');
    });

    it('should validate amount maximum value', async () => {
      const dto = plainToInstance(CreatePaymentDto, { ...validPaymentData, amount: 1000000 });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('amount');
    });

    it('should require payment_method', async () => {
      const dto = plainToInstance(CreatePaymentDto, { ...validPaymentData, payment_method: undefined as any });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('payment_method');
    });

    it('should validate payment_method enum', async () => {
      const dto = plainToInstance(CreatePaymentDto, { ...validPaymentData, payment_method: 'invalid-method' as any });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('payment_method');
    });

    it('should validate status enum when provided', async () => {
      const dto = plainToInstance(CreatePaymentDto, { ...validPaymentData, status: 'invalid-status' as any });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('status');
    });

    it('should accept valid payment methods', async () => {
      const validMethods = Object.values(PaymentMethod);
      
      for (const method of validMethods) {
        const dto = plainToInstance(CreatePaymentDto, { ...validPaymentData, payment_method: method });
        const errors = await validate(dto);
        expect(errors.filter(e => e.property === 'payment_method')).toHaveLength(0);
      }
    });

    it('should accept valid payment statuses', async () => {
      const validStatuses = Object.values(PaymentStatus);
      
      for (const status of validStatuses) {
        const dto = plainToInstance(CreatePaymentDto, { ...validPaymentData, status });
        const errors = await validate(dto);
        expect(errors.filter(e => e.property === 'status')).toHaveLength(0);
      }
    });

    it('should validate transaction_id format when provided', async () => {
      const dto = plainToInstance(CreatePaymentDto, { ...validPaymentData, transaction_id: 123 as any });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.property === 'transaction_id')).toBe(true);
    });

    it('should validate metadata is object when provided', async () => {
      const dto = plainToInstance(CreatePaymentDto, { ...validPaymentData, metadata: 'not-an-object' as any });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.property === 'metadata')).toBe(true);
    });

    it('should validate paid_at date format when provided', async () => {
      const dto = plainToInstance(CreatePaymentDto, { ...validPaymentData, paid_at: 'invalid-date' as any });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.property === 'paid_at')).toBe(true);
    });

    it('should validate notes format when provided', async () => {
      const dto = plainToInstance(CreatePaymentDto, { ...validPaymentData, notes: 123 as any });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.property === 'notes')).toBe(true);
    });
  });

  describe('constructor', () => {
    it('should create instance with partial data', () => {
      const partialData = {
        order_id: 'test-order-id',
        amount: 100,
      };

      const dto = new CreatePaymentDto();
      Object.assign(dto, partialData);

      expect(dto.order_id).toBe('test-order-id');
      expect(dto.amount).toBe(100);
    });
  });

  describe('edge cases', () => {
    it('should handle zero amount', async () => {
      const dto = plainToInstance(CreatePaymentDto, { ...validPaymentData, amount: 0 });
      const errors = await validate(dto);

      expect(errors.filter(e => e.property === 'amount')).toHaveLength(0);
    });

    it('should handle decimal amounts', async () => {
      const dto = plainToInstance(CreatePaymentDto, { ...validPaymentData, amount: 99.99 });
      const errors = await validate(dto);

      expect(errors.filter(e => e.property === 'amount')).toHaveLength(0);
    });

    it('should handle empty metadata object', async () => {
      const dto = plainToInstance(CreatePaymentDto, { ...validPaymentData, metadata: {} });
      const errors = await validate(dto);

      expect(errors.filter(e => e.property === 'metadata')).toHaveLength(0);
    });

    it('should handle complex metadata object', async () => {
      const complexMetadata = {
        gateway: 'stripe',
        customer: {
          id: 'cust_123',
          email: 'test@example.com',
        },
        payment_intent: 'pi_123456',
        charges: [
          { id: 'ch_1', amount: 50 },
          { id: 'ch_2', amount: 50 },
        ],
      };

      const dto = plainToInstance(CreatePaymentDto, { ...validPaymentData, metadata: complexMetadata });
      const errors = await validate(dto);

      expect(errors.filter(e => e.property === 'metadata')).toHaveLength(0);
    });
  });
});
