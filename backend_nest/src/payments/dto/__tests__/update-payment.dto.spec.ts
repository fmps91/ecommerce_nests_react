import { validate } from 'class-validator';
import { UpdatePaymentDto } from '../update-payment.dto';
import { PaymentStatus, PaymentMethod } from '../../models/payments.model';
import { plainToInstance } from 'class-transformer';

describe('UpdatePaymentDto', () => {
  const validUpdateData = {
    status: PaymentStatus.COMPLETED,
    transaction_id: 'txn_updated_123',
    order_id: '123e4567-e89b-12d3-a456-426614174999',
    amount: 150.75,
    payment_method: PaymentMethod.PAYPAL,
    user_id: '123e4567-e89b-12d3-a456-426614174888',
    metadata: { updated: true },
    paid_at: new Date(),
    notes: 'Updated payment',
  };

  describe('validation', () => {
    it('should validate with all fields', async () => {
      const dto = plainToInstance(UpdatePaymentDto, validUpdateData);
      const errors = await validate(dto);

      expect(errors.length).toBe(0);
    });

    it('should validate with partial data', async () => {
      const partialData = {
        status: PaymentStatus.COMPLETED,
        notes: 'Updated notes only',
      };

      const dto = plainToInstance(UpdatePaymentDto, partialData);
      const errors = await validate(dto);

      expect(errors.length).toBe(0);
    });

    it('should validate with single field', async () => {
      const singleField = {
        status: PaymentStatus.FAILED,
      };

      const dto = plainToInstance(UpdatePaymentDto, singleField);
      const errors = await validate(dto);

      expect(errors.length).toBe(0);
    });

    it('should validate empty object', async () => {
      const dto = plainToInstance(UpdatePaymentDto, {});
      const errors = await validate(dto);

      expect(errors.length).toBe(0);
    });

    it('should validate status enum when provided', async () => {
      const dto = plainToInstance(UpdatePaymentDto, {
        status: 'invalid-status' as any,
      });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('status');
    });

    it('should accept valid payment statuses', async () => {
      const validStatuses = Object.values(PaymentStatus);
      
      for (const status of validStatuses) {
        const dto = plainToInstance(UpdatePaymentDto, { status });
        const errors = await validate(dto);
        expect(errors.filter(e => e.property === 'status')).toHaveLength(0);
      }
    });

    it('should validate transaction_id format when provided', async () => {
      const dto = plainToInstance(UpdatePaymentDto, {
        transaction_id: 123 as any,
      });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.property === 'transaction_id')).toBe(true);
    });

    it('should validate order_id UUID when provided', async () => {
      const dto = plainToInstance(UpdatePaymentDto, {
        order_id: 'invalid-uuid',
      });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.property === 'order_id')).toBe(true);
    });

    it('should validate notes format when provided', async () => {
      const dto = plainToInstance(UpdatePaymentDto, {
        notes: 123 as any,
      });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.property === 'notes')).toBe(true);
    });
  });

  describe('inheritance', () => {
    it('should inherit validation rules from CreatePaymentDto', async () => {
      // Test that it inherits validation rules for all fields
      const invalidDto = plainToInstance(UpdatePaymentDto, {
        order_id: 'invalid-uuid',
        user_id: 'invalid-uuid',
        amount: -100,
        payment_method: 'invalid-method' as any,
        status: 'invalid-status' as any,
        transaction_id: 123 as any,
        metadata: 'not-object' as any,
        paid_at: 'invalid-date' as any,
        notes: 123 as any,
      });
      const errors = await validate(invalidDto);

      expect(errors.length).toBeGreaterThan(0);
      
      const errorProperties = errors.map(error => error.property);
      expect(errorProperties).toContain('order_id');
      expect(errorProperties).toContain('user_id');
      expect(errorProperties).toContain('amount');
      expect(errorProperties).toContain('payment_method');
      expect(errorProperties).toContain('status');
    });

    it('should allow all CreatePaymentDto fields to be optional', async () => {
      // Test that all fields that are required in CreatePaymentDto are now optional
      const dto = plainToInstance(UpdatePaymentDto, {});
      const errors = await validate(dto);

      expect(errors.length).toBe(0);
    });
  });

  describe('constructor', () => {
    it('should create instance with partial data', () => {
      const partialData = {
        status: PaymentStatus.COMPLETED,
        notes: 'Updated',
      };

      const dto = new UpdatePaymentDto();
      Object.assign(dto, partialData);

      expect(dto.status).toBe(PaymentStatus.COMPLETED);
      expect(dto.notes).toBe('Updated');
    });

    it('should initialize with undefined for missing fields', () => {
      const dto = new UpdatePaymentDto();

      expect(dto.status).toBeUndefined();
      expect(dto.transaction_id).toBeUndefined();
      expect(dto.order_id).toBeUndefined();
      expect(dto.notes).toBeUndefined();
    });
  });

  describe('use cases', () => {
    it('should handle status-only update', async () => {
      const statusUpdate = {
        status: PaymentStatus.COMPLETED,
      };

      const dto = plainToInstance(UpdatePaymentDto, statusUpdate);
      const errors = await validate(dto);

      expect(errors.length).toBe(0);
      expect(dto.status).toBe(PaymentStatus.COMPLETED);
    });

    it('should handle notes-only update', async () => {
      const notesUpdate = {
        notes: 'Payment processed successfully',
      };

      const dto = plainToInstance(UpdatePaymentDto, notesUpdate);
      const errors = await validate(dto);

      expect(errors.length).toBe(0);
      expect(dto.notes).toBe('Payment processed successfully');
    });

    it('should handle transaction_id update', async () => {
      const transactionUpdate = {
        transaction_id: 'txn_new_123456',
      };

      const dto = plainToInstance(UpdatePaymentDto, transactionUpdate);
      const errors = await validate(dto);

      expect(errors.length).toBe(0);
      expect(dto.transaction_id).toBe('txn_new_123456');
    });

    it('should handle multiple field updates', async () => {
      const multipleUpdate = {
        status: PaymentStatus.FAILED,
        notes: 'Payment failed due to insufficient funds',
        transaction_id: 'txn_failed_789',
      };

      const dto = plainToInstance(UpdatePaymentDto, multipleUpdate);
      const errors = await validate(dto);

      expect(errors.length).toBe(0);
      expect(dto.status).toBe(PaymentStatus.FAILED);
      expect(dto.notes).toBe('Payment failed due to insufficient funds');
      expect(dto.transaction_id).toBe('txn_failed_789');
    });
  });

  describe('edge cases', () => {
    it('should handle null values', async () => {
      const dto = plainToInstance(UpdatePaymentDto, {
        status: null as any,
        transaction_id: null as any,
        notes: null as any,
      });
      const errors = await validate(dto);

      // null should be valid for optional fields
      expect(errors.filter(e => e.property === 'status')).toHaveLength(0);
      expect(errors.filter(e => e.property === 'transaction_id')).toHaveLength(0);
      expect(errors.filter(e => e.property === 'notes')).toHaveLength(0);
    });

    it('should handle empty strings', async () => {
      const dto = plainToInstance(UpdatePaymentDto, {
        transaction_id: '',
        notes: '',
      });
      const errors = await validate(dto);

      // Empty strings should be valid for optional string fields
      expect(errors.filter(e => e.property === 'transaction_id')).toHaveLength(0);
      expect(errors.filter(e => e.property === 'notes')).toHaveLength(0);
    });

    it('should handle whitespace-only strings', async () => {
      const dto = plainToInstance(UpdatePaymentDto, {
        transaction_id: '   ',
        notes: '   ',
      });
      const errors = await validate(dto);

      // Whitespace-only strings should be valid for optional string fields
      expect(errors.filter(e => e.property === 'transaction_id')).toHaveLength(0);
      expect(errors.filter(e => e.property === 'notes')).toHaveLength(0);
    });
  });
});
