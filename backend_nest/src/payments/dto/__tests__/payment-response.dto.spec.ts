import { PaymentResponseDto } from '../payment-response.dto';
import { PaymentEntity } from '../../entities/payment.entity';
import { PaymentMethod, PaymentStatus } from '../../models/payments.model';

describe('PaymentResponseDto', () => {
  const mockPaymentEntity: PaymentEntity = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    order_id: '123e4567-e89b-12d3-a456-426614174001',
    user_id: '123e4567-e89b-12d3-a456-426614174002',
    amount: 100.50,
    payment_method: PaymentMethod.CREDIT_CARD,
    status: PaymentStatus.COMPLETED,
    transaction_id: 'txn_123456',
    metadata: { gateway: 'stripe', customer_id: 'cust_789' },
    paid_at: new Date('2024-01-15T10:30:00.000Z'),
    notes: 'Payment completed successfully',
    created_at: new Date('2024-01-15T10:00:00.000Z'),
    updated_at: new Date('2024-01-15T10:30:00.000Z'),
    deleted_at: undefined,
  };

  describe('constructor', () => {
    it('should create instance with complete PaymentEntity data', () => {
      const dto = new PaymentResponseDto(mockPaymentEntity);

      expect(dto.id).toBe(mockPaymentEntity.id);
      expect(dto.order_id).toBe(mockPaymentEntity.order_id);
      expect(dto.user_id).toBe(mockPaymentEntity.user_id);
      expect(dto.amount).toBe(mockPaymentEntity.amount);
      expect(dto.payment_method).toBe(mockPaymentEntity.payment_method);
      expect(dto.status).toBe(mockPaymentEntity.status);
      expect(dto.transaction_id).toBe(mockPaymentEntity.transaction_id);
      expect(dto.metadata).toBe(mockPaymentEntity.metadata);
      expect(dto.paid_at).toBe(mockPaymentEntity.paid_at);
      expect(dto.notes).toBe(mockPaymentEntity.notes);
      expect(dto.created_at).toBe(mockPaymentEntity.created_at);
      expect(dto.updated_at).toBe(mockPaymentEntity.updated_at);
    });

    it('should create instance with partial data', () => {
      const partialData = {
        id: 'test-id',
        order_id: 'test-order-id',
        amount: 50,
      };

      const dto = new PaymentResponseDto(partialData);

      expect(dto.id).toBe('test-id');
      expect(dto.order_id).toBe('test-order-id');
      expect(dto.amount).toBe(50);
      expect(dto.user_id).toBeUndefined();
      expect(dto.status).toBeUndefined();
    });

    it('should handle empty constructor', () => {
      const dto = new PaymentResponseDto({});

      expect(dto.id).toBeUndefined();
      expect(dto.order_id).toBeUndefined();
      expect(dto.user_id).toBeUndefined();
      expect(dto.amount).toBeUndefined();
      expect(dto.payment_method).toBeUndefined();
      expect(dto.status).toBeUndefined();
    });
  });

  describe('field types', () => {
    it('should handle correct field types', () => {
      const dto = new PaymentResponseDto(mockPaymentEntity);

      expect(typeof dto.id).toBe('string');
      expect(typeof dto.order_id).toBe('string');
      expect(typeof dto.user_id).toBe('string');
      expect(typeof dto.amount).toBe('number');
      expect(typeof dto.payment_method).toBe('string');
      expect(typeof dto.status).toBe('string');
      expect(typeof dto.transaction_id).toBe('string');
      expect(typeof dto.metadata).toBe('object');
      expect(dto.paid_at instanceof Date).toBe(true);
      expect(typeof dto.notes).toBe('string');
      expect(dto.created_at instanceof Date).toBe(true);
      expect(dto.updated_at instanceof Date).toBe(true);
    });

    it('should handle UUID format for id', () => {
      const dto = new PaymentResponseDto(mockPaymentEntity);

      expect(dto.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should handle UUID format for order_id', () => {
      const dto = new PaymentResponseDto(mockPaymentEntity);

      expect(dto.order_id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should handle UUID format for user_id', () => {
      const dto = new PaymentResponseDto(mockPaymentEntity);

      expect(dto.user_id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should handle numeric amount', () => {
      const dto = new PaymentResponseDto(mockPaymentEntity);

      expect(dto.amount).toBe(100.50);
      expect(typeof dto.amount).toBe('number');
      expect(Number.isFinite(dto.amount)).toBe(true);
    });

    it('should handle payment_method enum', () => {
      const dto = new PaymentResponseDto(mockPaymentEntity);

      expect(dto.payment_method).toBe(PaymentMethod.CREDIT_CARD);
      expect(Object.values(PaymentMethod)).toContain(dto.payment_method);
    });

    it('should handle status enum', () => {
      const dto = new PaymentResponseDto(mockPaymentEntity);

      expect(dto.status).toBe(PaymentStatus.COMPLETED);
      expect(Object.values(PaymentStatus)).toContain(dto.status);
    });
  });

  describe('date handling', () => {
    it('should handle Date objects correctly', () => {
      const testDate = new Date('2024-12-25T15:30:00.000Z');
      const entityWithDates = {
        ...mockPaymentEntity,
        paid_at: testDate,
        created_at: testDate,
        updated_at: testDate,
      };

      const dto = new PaymentResponseDto(entityWithDates);

      expect(dto.paid_at).toBe(testDate);
      expect(dto.created_at).toBe(testDate);
      expect(dto.updated_at).toBe(testDate);
      expect(dto.paid_at instanceof Date).toBe(true);
      expect(dto.created_at instanceof Date).toBe(true);
      expect(dto.updated_at instanceof Date).toBe(true);
    });

    it('should handle null dates', () => {
      const entityWithNullDates = {
        ...mockPaymentEntity,
        paid_at: null,
        deleted_at: null,
      };

      const dto = new PaymentResponseDto(entityWithNullDates as any);

      expect(dto.paid_at).toBeNull();
      // Note: deleted_at is not a property of PaymentResponseDto
    });

    it('should handle undefined dates', () => {
      const entityWithUndefinedDates = {
        ...mockPaymentEntity,
        paid_at: undefined,
        deleted_at: undefined,
      };

      const dto = new PaymentResponseDto(entityWithUndefinedDates);

      expect(dto.paid_at).toBeUndefined();
      // Note: deleted_at is not a property of PaymentResponseDto
    });
  });

  describe('metadata handling', () => {
    it('should handle complex metadata objects', () => {
      const complexMetadata = {
        gateway: 'stripe',
        customer: {
          id: 'cust_123456',
          email: 'customer@example.com',
          name: 'John Doe',
        },
        payment_intent: {
          id: 'pi_123456789',
          status: 'succeeded',
          amount: 10050,
          currency: 'usd',
        },
        charges: [
          {
            id: 'ch_1',
            amount: 6000,
            currency: 'usd',
            status: 'succeeded',
          },
          {
            id: 'ch_2',
            amount: 4050,
            currency: 'usd',
            status: 'succeeded',
          },
        ],
        refunds: [],
      };

      const entityWithComplexMetadata = {
        ...mockPaymentEntity,
        metadata: complexMetadata,
      };

      const dto = new PaymentResponseDto(entityWithComplexMetadata);

      expect(dto.metadata).toEqual(complexMetadata);
      expect(typeof dto.metadata).toBe('object');
      expect(dto.metadata.gateway).toBe('stripe');
      expect(dto.metadata.customer.id).toBe('cust_123456');
      expect(dto.metadata.charges).toHaveLength(2);
    });

    it('should handle empty metadata object', () => {
      const entityWithEmptyMetadata = {
        ...mockPaymentEntity,
        metadata: {},
      };

      const dto = new PaymentResponseDto(entityWithEmptyMetadata);

      expect(dto.metadata).toEqual({});
      expect(typeof dto.metadata).toBe('object');
      expect(Object.keys(dto.metadata)).toHaveLength(0);
    });

    it('should handle null metadata', () => {
      const entityWithNullMetadata = {
        ...mockPaymentEntity,
        metadata: null,
      };

      const dto = new PaymentResponseDto(entityWithNullMetadata as any);

      expect(dto.metadata).toBeNull();
    });

    it('should handle undefined metadata', () => {
      const entityWithUndefinedMetadata = {
        ...mockPaymentEntity,
        metadata: undefined,
      };

      const dto = new PaymentResponseDto(entityWithUndefinedMetadata);

      expect(dto.metadata).toBeUndefined();
    });
  });

  describe('serialization', () => {
    it('should be serializable to JSON', () => {
      const dto = new PaymentResponseDto(mockPaymentEntity);
      const jsonString = JSON.stringify(dto);
      const parsed = JSON.parse(jsonString);

      expect(parsed.id).toBe(mockPaymentEntity.id);
      expect(parsed.order_id).toBe(mockPaymentEntity.order_id);
      expect(parsed.user_id).toBe(mockPaymentEntity.user_id);
      expect(parsed.amount).toBe(mockPaymentEntity.amount);
      expect(parsed.payment_method).toBe(mockPaymentEntity.payment_method);
      expect(parsed.status).toBe(mockPaymentEntity.status);
      expect(parsed.transaction_id).toBe(mockPaymentEntity.transaction_id);
      expect(parsed.metadata).toEqual(mockPaymentEntity.metadata);
      expect(parsed.paid_at).toBe(mockPaymentEntity.paid_at?.toISOString());
      expect(parsed.notes).toBe(mockPaymentEntity.notes);
      expect(parsed.created_at).toBe(mockPaymentEntity.created_at.toISOString());
      expect(parsed.updated_at).toBe(mockPaymentEntity.updated_at.toISOString());
    });

    it('should serialize partial data correctly', () => {
      const partialDto = new PaymentResponseDto({
        id: 'test-id',
        amount: 50,
      });

      const jsonString = JSON.stringify(partialDto);
      const parsed = JSON.parse(jsonString);

      expect(parsed.id).toBe('test-id');
      expect(parsed.amount).toBe(50);
      expect(parsed.order_id).toBeUndefined();
      expect(parsed.user_id).toBeUndefined();
    });

    it('should handle null values in serialization', () => {
      const dtoWithNulls = new PaymentResponseDto({
        id: 'test-id',
        paid_at: null,
        deleted_at: null,
        metadata: null,
      } as any);

      const jsonString = JSON.stringify(dtoWithNulls);
      const parsed = JSON.parse(jsonString);

      expect(parsed.id).toBe('test-id');
      expect(parsed.paid_at).toBe(null);
      // Note: deleted_at is not a property of PaymentResponseDto
      expect(parsed.metadata).toBe(null);
    });
  });

  describe('edge cases', () => {
    it('should handle very long strings', () => {
      const longString = 'a'.repeat(1000);
      const entityWithLongStrings = {
        ...mockPaymentEntity,
        transaction_id: longString,
        notes: longString,
      };

      const dto = new PaymentResponseDto(entityWithLongStrings);

      expect(dto.transaction_id).toBe(longString);
      expect(dto.notes).toBe(longString);
    });

    it('should handle special characters in strings', () => {
      const specialChars = 'Payment with émojis 🎉 and special chars: @#$%^&*()';
      const entityWithSpecialChars = {
        ...mockPaymentEntity,
        notes: specialChars,
        transaction_id: 'special_@#$%',
      };

      const dto = new PaymentResponseDto(entityWithSpecialChars);

      expect(dto.notes).toBe(specialChars);
      expect(dto.transaction_id).toBe('special_@#$%');
    });

    it('should handle zero amount', () => {
      const entityWithZeroAmount = {
        ...mockPaymentEntity,
        amount: 0,
      };

      const dto = new PaymentResponseDto(entityWithZeroAmount);

      expect(dto.amount).toBe(0);
      expect(typeof dto.amount).toBe('number');
    });

    it('should handle negative amount', () => {
      const entityWithNegativeAmount = {
        ...mockPaymentEntity,
        amount: -50,
      };

      const dto = new PaymentResponseDto(entityWithNegativeAmount);

      expect(dto.amount).toBe(-50);
      expect(typeof dto.amount).toBe('number');
    });

    it('should handle decimal amounts', () => {
      const entityWithDecimalAmount = {
        ...mockPaymentEntity,
        amount: 99.999,
      };

      const dto = new PaymentResponseDto(entityWithDecimalAmount);

      expect(dto.amount).toBe(99.999);
      expect(typeof dto.amount).toBe('number');
    });
  });

  describe('Object.assign behavior', () => {
    it('should merge properties correctly using Object.assign', () => {
      const dto = new PaymentResponseDto({});
      Object.assign(dto, mockPaymentEntity);

      expect(dto.id).toBe(mockPaymentEntity.id);
      expect(dto.order_id).toBe(mockPaymentEntity.order_id);
      expect(dto.amount).toBe(mockPaymentEntity.amount);
    });

    it('should overwrite existing properties with Object.assign', () => {
      const dto = new PaymentResponseDto(mockPaymentEntity);
      const newData = {
        status: PaymentStatus.REFUNDED,
        notes: 'Updated notes',
      };

      Object.assign(dto, newData);

      expect(dto.id).toBe(mockPaymentEntity.id); // Should remain unchanged
      expect(dto.status).toBe(PaymentStatus.REFUNDED); // Should be updated
      expect(dto.notes).toBe('Updated notes'); // Should be updated
    });
  });
});
