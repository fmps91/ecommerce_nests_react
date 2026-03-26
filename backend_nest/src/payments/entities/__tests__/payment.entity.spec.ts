import { PaymentEntity } from '../payment.entity';
import { PaymentMethod, PaymentStatus } from '../../models/payments.model';

describe('PaymentEntity', () => {
  const mockPaymentData = {
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
    it('should create instance with complete data', () => {
      const entity = new PaymentEntity(mockPaymentData);

      expect(entity.id).toBe(mockPaymentData.id);
      expect(entity.order_id).toBe(mockPaymentData.order_id);
      expect(entity.user_id).toBe(mockPaymentData.user_id);
      expect(entity.amount).toBe(mockPaymentData.amount);
      expect(entity.payment_method).toBe(mockPaymentData.payment_method);
      expect(entity.status).toBe(mockPaymentData.status);
      expect(entity.transaction_id).toBe(mockPaymentData.transaction_id);
      expect(entity.metadata).toBe(mockPaymentData.metadata);
      expect(entity.paid_at).toBe(mockPaymentData.paid_at);
      expect(entity.notes).toBe(mockPaymentData.notes);
      expect(entity.created_at).toBe(mockPaymentData.created_at);
      expect(entity.updated_at).toBe(mockPaymentData.updated_at);
      expect(entity.deleted_at).toBe(mockPaymentData.deleted_at);
    });

    it('should create instance with partial data', () => {
      const partialData = {
        id: 'test-id',
        order_id: 'test-order-id',
        amount: 50,
      };

      const entity = new PaymentEntity(partialData);

      expect(entity.id).toBe('test-id');
      expect(entity.order_id).toBe('test-order-id');
      expect(entity.amount).toBe(50);
      expect(entity.user_id).toBeUndefined();
      expect(entity.status).toBeUndefined();
    });

    it('should handle empty constructor', () => {
      const entity = new PaymentEntity({});

      expect(entity.id).toBeUndefined();
      expect(entity.order_id).toBeUndefined();
      expect(entity.user_id).toBeUndefined();
      expect(entity.amount).toBeUndefined();
      expect(entity.payment_method).toBeUndefined();
      expect(entity.status).toBeUndefined();
    });
  });

  describe('field types', () => {
    it('should handle correct field types', () => {
      const entity = new PaymentEntity(mockPaymentData);

      expect(typeof entity.id).toBe('string');
      expect(typeof entity.order_id).toBe('string');
      expect(typeof entity.user_id).toBe('string');
      expect(typeof entity.amount).toBe('number');
      expect(typeof entity.payment_method).toBe('string');
      expect(typeof entity.status).toBe('string');
      expect(typeof entity.transaction_id).toBe('string');
      expect(typeof entity.metadata).toBe('object');
      expect(entity.paid_at instanceof Date).toBe(true);
      expect(typeof entity.notes).toBe('string');
      expect(entity.created_at instanceof Date).toBe(true);
      expect(entity.updated_at instanceof Date).toBe(true);
    });

    it('should handle UUID format for id', () => {
      const entity = new PaymentEntity(mockPaymentData);

      expect(entity.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should handle UUID format for order_id', () => {
      const entity = new PaymentEntity(mockPaymentData);

      expect(entity.order_id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should handle UUID format for user_id', () => {
      const entity = new PaymentEntity(mockPaymentData);

      expect(entity.user_id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should handle numeric amount', () => {
      const entity = new PaymentEntity(mockPaymentData);

      expect(entity.amount).toBe(100.50);
      expect(typeof entity.amount).toBe('number');
      expect(Number.isFinite(entity.amount)).toBe(true);
    });

    it('should handle payment_method enum', () => {
      const entity = new PaymentEntity(mockPaymentData);

      expect(entity.payment_method).toBe(PaymentMethod.CREDIT_CARD);
      expect(Object.values(PaymentMethod)).toContain(entity.payment_method);
    });

    it('should handle status enum', () => {
      const entity = new PaymentEntity(mockPaymentData);

      expect(entity.status).toBe(PaymentStatus.COMPLETED);
      expect(Object.values(PaymentStatus)).toContain(entity.status);
    });
  });

  describe('date handling', () => {
    it('should handle Date objects correctly', () => {
      const testDate = new Date('2024-12-25T15:30:00.000Z');
      const entityWithDates = {
        ...mockPaymentData,
        paid_at: testDate,
        created_at: testDate,
        updated_at: testDate,
      };

      const entity = new PaymentEntity(entityWithDates);

      expect(entity.paid_at).toBe(testDate);
      expect(entity.created_at).toBe(testDate);
      expect(entity.updated_at).toBe(testDate);
      expect(entity.paid_at instanceof Date).toBe(true);
      expect(entity.created_at instanceof Date).toBe(true);
      expect(entity.updated_at instanceof Date).toBe(true);
    });

    it('should handle null dates', () => {
      const entityWithNullDates = {
        ...mockPaymentData,
        paid_at: null,
        deleted_at: undefined,
      };

      const entity = new PaymentEntity(entityWithNullDates);

      expect(entity.paid_at).toBeNull();
      expect(entity.deleted_at).toBeNull();
    });

    it('should handle undefined dates', () => {
      const entityWithUndefinedDates = {
        ...mockPaymentData,
        paid_at: undefined,
        deleted_at: undefined,
      };

      const entity = new PaymentEntity(entityWithUndefinedDates);

      expect(entity.paid_at).toBeUndefined();
      expect(entity.deleted_at).toBeUndefined();
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
        ...mockPaymentData,
        metadata: complexMetadata,
      };

      const entity = new PaymentEntity(entityWithComplexMetadata);

      expect(entity.metadata).toEqual(complexMetadata);
      expect(typeof entity.metadata).toBe('object');
      expect(entity.metadata.gateway).toBe('stripe');
      expect(entity.metadata.customer.id).toBe('cust_123456');
      expect(entity.metadata.charges).toHaveLength(2);
    });

    it('should handle empty metadata object', () => {
      const entityWithEmptyMetadata = {
        ...mockPaymentData,
        metadata: {},
      };

      const entity = new PaymentEntity(entityWithEmptyMetadata);

      expect(entity.metadata).toEqual({});
      expect(typeof entity.metadata).toBe('object');
      expect(Object.keys(entity.metadata)).toHaveLength(0);
    });

    it('should handle null metadata', () => {
      const entityWithNullMetadata = {
        ...mockPaymentData,
        metadata: null,
      };

      const entity = new PaymentEntity(entityWithNullMetadata as any);

      expect(entity.metadata).toBeNull();
    });

    it('should handle undefined metadata', () => {
      const entityWithUndefinedMetadata = {
        ...mockPaymentData,
        metadata: undefined,
      };

      const entity = new PaymentEntity(entityWithUndefinedMetadata);

      expect(entity.metadata).toBeUndefined();
    });
  });

  describe('serialization', () => {
    it('should be serializable to JSON', () => {
      const entity = new PaymentEntity(mockPaymentData);
      const jsonString = JSON.stringify(entity);
      const parsed = JSON.parse(jsonString);

      expect(parsed.id).toBe(mockPaymentData.id);
      expect(parsed.order_id).toBe(mockPaymentData.order_id);
      expect(parsed.user_id).toBe(mockPaymentData.user_id);
      expect(parsed.amount).toBe(mockPaymentData.amount);
      expect(parsed.payment_method).toBe(mockPaymentData.payment_method);
      expect(parsed.status).toBe(mockPaymentData.status);
      expect(parsed.transaction_id).toBe(mockPaymentData.transaction_id);
      expect(parsed.metadata).toEqual(mockPaymentData.metadata);
      expect(parsed.paid_at).toBe(mockPaymentData.paid_at?.toISOString());
      expect(parsed.notes).toBe(mockPaymentData.notes);
      expect(parsed.created_at).toBe(mockPaymentData.created_at.toISOString());
      expect(parsed.updated_at).toBe(mockPaymentData.updated_at.toISOString());
    });

    it('should serialize partial data correctly', () => {
      const partialEntity = new PaymentEntity({
        id: 'test-id',
        amount: 50,
      });

      const jsonString = JSON.stringify(partialEntity);
      const parsed = JSON.parse(jsonString);

      expect(parsed.id).toBe('test-id');
      expect(parsed.amount).toBe(50);
      expect(parsed.order_id).toBeUndefined();
      expect(parsed.user_id).toBeUndefined();
    });

    it('should handle null values in serialization', () => {
      const entityWithNulls = new PaymentEntity({
        id: 'test-id',
        paid_at: null,
        deleted_at: undefined,
        metadata: null,
      } as any);

      const jsonString = JSON.stringify(entityWithNulls);
      const parsed = JSON.parse(jsonString);

      expect(parsed.id).toBe('test-id');
      expect(parsed.paid_at).toBe(null);
      expect(parsed.deleted_at).toBe(null);
      expect(parsed.metadata).toBe(null);
    });
  });

  describe('edge cases', () => {
    it('should handle very long strings', () => {
      const longString = 'a'.repeat(1000);
      const entityWithLongStrings = {
        ...mockPaymentData,
        transaction_id: longString,
        notes: longString,
      };

      const entity = new PaymentEntity(entityWithLongStrings);

      expect(entity.transaction_id).toBe(longString);
      expect(entity.notes).toBe(longString);
    });

    it('should handle special characters in strings', () => {
      const specialChars = 'Payment with émojis 🎉 and special chars: @#$%^&*()';
      const entityWithSpecialChars = {
        ...mockPaymentData,
        notes: specialChars,
        transaction_id: 'special_@#$%',
      };

      const entity = new PaymentEntity(entityWithSpecialChars);

      expect(entity.notes).toBe(specialChars);
      expect(entity.transaction_id).toBe('special_@#$%');
    });

    it('should handle zero amount', () => {
      const entityWithZeroAmount = {
        ...mockPaymentData,
        amount: 0,
      };

      const entity = new PaymentEntity(entityWithZeroAmount);

      expect(entity.amount).toBe(0);
      expect(typeof entity.amount).toBe('number');
    });

    it('should handle negative amount', () => {
      const entityWithNegativeAmount = {
        ...mockPaymentData,
        amount: -50,
      };

      const entity = new PaymentEntity(entityWithNegativeAmount);

      expect(entity.amount).toBe(-50);
      expect(typeof entity.amount).toBe('number');
    });

    it('should handle decimal amounts', () => {
      const entityWithDecimalAmount = {
        ...mockPaymentData,
        amount: 99.999,
      };

      const entity = new PaymentEntity(entityWithDecimalAmount);

      expect(entity.amount).toBe(99.999);
      expect(typeof entity.amount).toBe('number');
    });
  });

  describe('Object.assign behavior', () => {
    it('should merge properties correctly using Object.assign', () => {
      const entity = new PaymentEntity({});
      Object.assign(entity, mockPaymentData);

      expect(entity.id).toBe(mockPaymentData.id);
      expect(entity.order_id).toBe(mockPaymentData.order_id);
      expect(entity.amount).toBe(mockPaymentData.amount);
    });

    it('should overwrite existing properties with Object.assign', () => {
      const entity = new PaymentEntity(mockPaymentData);
      const newData = {
        status: PaymentStatus.REFUNDED,
        notes: 'Updated notes',
      };

      Object.assign(entity, newData);

      expect(entity.id).toBe(mockPaymentData.id); // Should remain unchanged
      expect(entity.status).toBe(PaymentStatus.REFUNDED); // Should be updated
      expect(entity.notes).toBe('Updated notes'); // Should be updated
    });
  });

  describe('enum handling', () => {
    it('should handle all payment methods', () => {
      const paymentMethods = Object.values(PaymentMethod);
      
      for (const method of paymentMethods) {
        const entity = new PaymentEntity({
          ...mockPaymentData,
          payment_method: method,
        });

        expect(entity.payment_method).toBe(method);
        expect(typeof entity.payment_method).toBe('string');
      }
    });

    it('should handle all payment statuses', () => {
      const paymentStatuses = Object.values(PaymentStatus);
      
      for (const status of paymentStatuses) {
        const entity = new PaymentEntity({
          ...mockPaymentData,
          status: status,
        });

        expect(entity.status).toBe(status);
        expect(typeof entity.status).toBe('string');
      }
    });

    it('should handle invalid enum values (edge case)', () => {
      const entityWithInvalidEnums = {
        ...mockPaymentData,
        payment_method: 'invalid_method' as any,
        status: 'invalid_status' as any,
      };

      const entity = new PaymentEntity(entityWithInvalidEnums);

      expect(entity.payment_method).toBe('invalid_method');
      expect(entity.status).toBe('invalid_status');
    });
  });
});

describe('PaymentEntity static methods', () => {
  const mockPaymentModel = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    order_id: '123e4567-e89b-12d3-a456-426614174001',
    user_id: '123e4567-e89b-12d3-a456-426614174002',
    amount: 100.50,
    payment_method: PaymentMethod.CREDIT_CARD,
    status: PaymentStatus.COMPLETED,
    transaction_id: 'txn_123456',
    metadata: { gateway: 'stripe' },
    paid_at: new Date('2024-01-15T10:30:00.000Z'),
    notes: 'Payment completed successfully',
    created_at: new Date('2024-01-15T10:00:00.000Z'),
    updated_at: new Date('2024-01-15T10:30:00.000Z'),
    deleted_at: undefined,
  };

  describe('fromModel', () => {
    it('should create PaymentEntity from Payment model', () => {
      const entity = PaymentEntity.fromModel(mockPaymentModel as any);

      expect(entity).toBeInstanceOf(PaymentEntity);
      expect(entity.id).toBe(mockPaymentModel.id);
      expect(entity.order_id).toBe(mockPaymentModel.order_id);
      expect(entity.user_id).toBe(mockPaymentModel.user_id);
      expect(entity.amount).toBe(Number(mockPaymentModel.amount));
      expect(entity.payment_method).toBe(mockPaymentModel.payment_method);
      expect(entity.status).toBe(mockPaymentModel.status);
      expect(entity.transaction_id).toBe(mockPaymentModel.transaction_id);
      expect(entity.metadata).toBe(mockPaymentModel.metadata);
      expect(entity.paid_at).toBe(mockPaymentModel.paid_at);
      expect(entity.notes).toBe(mockPaymentModel.notes);
      expect(entity.created_at).toBe(mockPaymentModel.created_at);
      expect(entity.updated_at).toBe(mockPaymentModel.updated_at);
      expect(entity.deleted_at).toBe(mockPaymentModel.deleted_at);
    });

    it('should handle decimal amounts from model', () => {
      const modelWithDecimalAmount = {
        ...mockPaymentModel,
        amount: '100.50',
      };

      const entity = PaymentEntity.fromModel(modelWithDecimalAmount as any);

      expect(entity.amount).toBe(100.50);
      expect(typeof entity.amount).toBe('number');
    });

    it('should handle string amounts from model', () => {
      const modelWithStringAmount = {
        ...mockPaymentModel,
        amount: '100',
      };

      const entity = PaymentEntity.fromModel(modelWithStringAmount as any);

      expect(entity.amount).toBe(100);
      expect(typeof entity.amount).toBe('number');
    });

    it('should handle null values from model', () => {
      const modelWithNulls = {
        ...mockPaymentModel,
        transaction_id: null,
        metadata: null,
        paid_at: null,
        deleted_at: undefined,
      };

      const entity = PaymentEntity.fromModel(modelWithNulls as any);

      expect(entity.transaction_id).toBeNull();
      expect(entity.metadata).toBeNull();
      expect(entity.paid_at).toBeNull();
      expect(entity.deleted_at).toBeNull();
    });

    it('should handle undefined values from model', () => {
      const modelWithUndefined = {
        ...mockPaymentModel,
        transaction_id: undefined,
        metadata: undefined,
        paid_at: undefined,
        deleted_at: undefined,
      };

      const entity = PaymentEntity.fromModel(modelWithUndefined as any);

      expect(entity.transaction_id).toBeUndefined();
      expect(entity.metadata).toBeUndefined();
      expect(entity.paid_at).toBeUndefined();
      expect(entity.deleted_at).toBeUndefined();
    });
  });
});
