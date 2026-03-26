import { Payment, PaymentStatus, PaymentMethod } from '../payments.model';

describe('Payment Model', () => {
  const mockOrderData = {
    id: '123e4567-e89b-12d3-a456-426614174002',
    total: 1299.99,
    status: 'PENDING',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
  };

  const mockUserData = {
    id: '123e4567-e89b-12d3-a456-426614174001',
    email: 'user@example.com',
    name: 'Test User',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
  };

  const mockPaymentData = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    order_id: '123e4567-e89b-12d3-a456-426614174002',
    user_id: '123e4567-e89b-12d3-a456-426614174001',
    amount: 1299.99,
    payment_method: PaymentMethod.CREDIT_CARD,
    status: PaymentStatus.PENDING,
    transaction_id: 'txn_1234567890',
    metadata: { gateway: 'stripe', response_code: '200' },
    paid_at: null,
    notes: 'Payment for order #123',
    created_at: new Date('2024-01-01T00:00:00.000Z'),
    updated_at: new Date('2024-01-01T00:00:00.000Z'),
    deleted_at: undefined,
    order: mockOrderData,
    user: mockUserData,
  };

  describe('model structure', () => {
    it('should have correct table configuration', () => {
      // Test that the Payment model extends Sequelize Model
      expect(Payment.prototype.constructor.name).toBe('Payment');
    });

    it('should have all required fields', () => {
      const payment = new Payment(mockPaymentData as any);

      expect(payment.id).toBeDefined();
      expect(payment.order_id).toBeDefined();
      expect(payment.user_id).toBeDefined();
      expect(payment.amount).toBeDefined();
      expect(payment.payment_method).toBeDefined();
      expect(payment.status).toBeDefined();
      expect(payment.transaction_id).toBeDefined();
      expect(payment.metadata).toBeDefined();
      expect(payment.paid_at).toBeDefined();
      expect(payment.notes).toBeDefined();
      expect(payment.created_at).toBeDefined();
      expect(payment.updated_at).toBeDefined();
      expect(payment.deleted_at).toBeDefined();
    });
  });

  describe('field types and validation', () => {
    it('should handle correct field types', () => {
      const payment = new Payment(mockPaymentData as any);

      expect(typeof payment.id).toBe('string');
      expect(typeof payment.order_id).toBe('string');
      expect(typeof payment.user_id).toBe('string');
      expect(typeof payment.amount).toBe('number');
      expect(typeof payment.payment_method).toBe('string');
      expect(typeof payment.status).toBe('string');
      expect(typeof payment.transaction_id).toBe('string');
      expect(typeof payment.metadata).toBe('object');
      expect(typeof payment.notes).toBe('string');
      expect(payment.created_at instanceof Date).toBe(true);
      expect(payment.updated_at instanceof Date).toBe(true);
    });

    it('should handle UUID format for id', () => {
      const payment = new Payment(mockPaymentData as any);

      expect(payment.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should handle UUID format for order_id', () => {
      const payment = new Payment(mockPaymentData as any);

      expect(payment.order_id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should handle UUID format for user_id', () => {
      const payment = new Payment(mockPaymentData as any);

      expect(payment.user_id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should handle amount validation', () => {
      const payment = new Payment(mockPaymentData as any);

      expect(payment.amount).toBe(1299.99);
      expect(payment.amount).toBeGreaterThanOrEqual(0);
      expect(typeof payment.amount).toBe('number');
    });
  });

  describe('PaymentMethod enum', () => {
    it('should handle all payment methods', () => {
      const paymentMethods = [
        PaymentMethod.CREDIT_CARD,
        PaymentMethod.DEBIT_CARD,
        PaymentMethod.PAYPAL,
        PaymentMethod.BANK_TRANSFER,
        PaymentMethod.CASH,
        PaymentMethod.OTHER,
      ];

      paymentMethods.forEach(method => {
        const payment = new Payment({ ...mockPaymentData, payment_method: method } as any);
        expect(payment.payment_method).toBe(method);
        expect(Object.values(PaymentMethod)).toContain(payment.payment_method);
      });
    });

    it('should validate payment method values', () => {
      const validMethods = ['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'cash', 'other'];
      
      validMethods.forEach(method => {
        expect(Object.values(PaymentMethod)).toContain(method);
      });
    });
  });

  describe('PaymentStatus enum', () => {
    it('should handle all payment statuses', () => {
      const paymentStatuses = [
        PaymentStatus.PENDING,
        PaymentStatus.COMPLETED,
        PaymentStatus.FAILED,
        PaymentStatus.REFUNDED,
        PaymentStatus.CANCELLED,
      ];

      paymentStatuses.forEach(status => {
        const payment = new Payment({ ...mockPaymentData, status } as any);
        expect(payment.status).toBe(status);
        expect(Object.values(PaymentStatus)).toContain(payment.status);
      });
    });

    it('should validate payment status values', () => {
      const validStatuses = ['pending', 'completed', 'failed', 'refunded', 'cancelled'];
      
      validStatuses.forEach(status => {
        expect(Object.values(PaymentStatus)).toContain(status);
      });
    });

    it('should have default status as PENDING', () => {
      const payment = new Payment({
        id: 'test-id',
        order_id: 'test-order-id',
        user_id: 'test-user-id',
        amount: 100,
        payment_method: PaymentMethod.CREDIT_CARD,
      } as any);

      expect(payment.status).toBe(PaymentStatus.PENDING);
    });
  });

  describe('date handling', () => {
    it('should handle Date objects correctly', () => {
      const testDate = new Date('2024-12-25T15:30:00.000Z');
      const paymentWithDates = {
        ...mockPaymentData,
        created_at: testDate,
        updated_at: testDate,
      };

      const payment = new Payment(paymentWithDates as any);

      expect(payment.created_at).toBe(testDate);
      expect(payment.updated_at).toBe(testDate);
      expect(payment.created_at instanceof Date).toBe(true);
      expect(payment.updated_at instanceof Date).toBe(true);
    });

    it('should handle null paid_at', () => {
      const paymentWithNullPaidAt = {
        ...mockPaymentData,
        paid_at: null,
      };

      const payment = new Payment(paymentWithNullPaidAt as any);

      expect(payment.paid_at).toBeNull();
    });

    it('should handle undefined paid_at', () => {
      const paymentWithUndefinedPaidAt = {
        ...mockPaymentData,
        paid_at: undefined,
      };

      const payment = new Payment(paymentWithUndefinedPaidAt as any);

      expect(payment.paid_at).toBeUndefined();
    });

    it('should handle paid_at as Date', () => {
      const paidDate = new Date('2024-06-01T00:00:00.000Z');
      const paymentWithPaidAt = {
        ...mockPaymentData,
        paid_at: paidDate,
      };

      const payment = new Payment(paymentWithPaidAt as any);

      expect(payment.paid_at).toBe(paidDate);
      expect(payment.paid_at instanceof Date).toBe(true);
    });

    it('should handle null deleted_at', () => {
      const paymentWithNullDeletedAt = {
        ...mockPaymentData,
        deleted_at: null,
      };

      const payment = new Payment(paymentWithNullDeletedAt as any);

      expect(payment.deleted_at).toBeNull();
    });

    it('should handle undefined deleted_at', () => {
      const paymentWithUndefinedDeletedAt = {
        ...mockPaymentData,
        deleted_at: undefined,
      };

      const payment = new Payment(paymentWithUndefinedDeletedAt as any);

      expect(payment.deleted_at).toBeUndefined();
    });
  });

  describe('amount handling', () => {
    it('should handle zero amount', () => {
      const paymentWithZeroAmount = {
        ...mockPaymentData,
        amount: 0,
      };

      const payment = new Payment(paymentWithZeroAmount as any);

      expect(payment.amount).toBe(0);
      expect(typeof payment.amount).toBe('number');
    });

    it('should handle decimal amount', () => {
      const paymentWithDecimalAmount = {
        ...mockPaymentData,
        amount: 99.99,
      };

      const payment = new Payment(paymentWithDecimalAmount as any);

      expect(payment.amount).toBe(99.99);
      expect(typeof payment.amount).toBe('number');
    });

    it('should handle very large amount', () => {
      const paymentWithLargeAmount = {
        ...mockPaymentData,
        amount: 99999999.99,
      };

      const payment = new Payment(paymentWithLargeAmount as any);

      expect(payment.amount).toBe(99999999.99);
      expect(typeof payment.amount).toBe('number');
    });

    it('should handle amount with decimal precision', () => {
      const paymentWithPrecision = {
        ...mockPaymentData,
        amount: 1234.56,
      };

      const payment = new Payment(paymentWithPrecision as any);

      expect(payment.amount).toBe(1234.56);
      expect(payment.amount.toFixed(2)).toBe('1234.56');
    });
  });

  describe('transaction_id handling', () => {
    it('should handle null transaction_id', () => {
      const paymentWithNullTransactionId = {
        ...mockPaymentData,
        transaction_id: null,
      };

      const payment = new Payment(paymentWithNullTransactionId as any);

      expect(payment.transaction_id).toBeNull();
    });

    it('should handle undefined transaction_id', () => {
      const paymentWithUndefinedTransactionId = {
        ...mockPaymentData,
        transaction_id: undefined,
      };

      const payment = new Payment(paymentWithUndefinedTransactionId as any);

      expect(payment.transaction_id).toBeUndefined();
    });

    it('should handle empty transaction_id', () => {
      const paymentWithEmptyTransactionId = {
        ...mockPaymentData,
        transaction_id: '',
      };

      const payment = new Payment(paymentWithEmptyTransactionId as any);

      expect(payment.transaction_id).toBe('');
      expect(typeof payment.transaction_id).toBe('string');
    });

    it('should handle long transaction_id', () => {
      const longTransactionId = 'txn_' + 'a'.repeat(100);
      const paymentWithLongTransactionId = {
        ...mockPaymentData,
        transaction_id: longTransactionId,
      };

      const payment = new Payment(paymentWithLongTransactionId as any);

      expect(payment.transaction_id).toBe(longTransactionId);
      expect(typeof payment.transaction_id).toBe('string');
    });
  });

  describe('metadata handling', () => {
    it('should handle null metadata', () => {
      const paymentWithNullMetadata = {
        ...mockPaymentData,
        metadata: null,
      };

      const payment = new Payment(paymentWithNullMetadata as any);

      expect(payment.metadata).toBeNull();
    });

    it('should handle undefined metadata', () => {
      const paymentWithUndefinedMetadata = {
        ...mockPaymentData,
        metadata: undefined,
      };

      const payment = new Payment(paymentWithUndefinedMetadata as any);

      expect(payment.metadata).toBeUndefined();
    });

    it('should handle empty metadata object', () => {
      const paymentWithEmptyMetadata = {
        ...mockPaymentData,
        metadata: {},
      };

      const payment = new Payment(paymentWithEmptyMetadata as any);

      expect(payment.metadata).toEqual({});
      expect(typeof payment.metadata).toBe('object');
    });

    it('should handle complex metadata', () => {
      const complexMetadata = {
        gateway: 'stripe',
        response_code: '200',
        auth_code: '123456',
        avs_result: 'Y',
        cvv_result: 'M',
        risk_score: 0.1,
        fraud_check: {
          ip_address: '192.168.1.1',
          device_fingerprint: 'abc123',
          risk_level: 'low',
        },
        billing_address: {
          street: '123 Test St',
          city: 'Test City',
          country: 'US',
        },
      };

      const paymentWithComplexMetadata = {
        ...mockPaymentData,
        metadata: complexMetadata,
      };

      const payment = new Payment(paymentWithComplexMetadata as any);

      expect(payment.metadata).toEqual(complexMetadata);
      expect(typeof payment.metadata).toBe('object');
    });
  });

  describe('notes handling', () => {
    it('should handle null notes', () => {
      const paymentWithNullNotes = {
        ...mockPaymentData,
        notes: null,
      };

      const payment = new Payment(paymentWithNullNotes as any);

      expect(payment.notes).toBeNull();
    });

    it('should handle undefined notes', () => {
      const paymentWithUndefinedNotes = {
        ...mockPaymentData,
        notes: undefined,
      };

      const payment = new Payment(paymentWithUndefinedNotes as any);

      expect(payment.notes).toBeUndefined();
    });

    it('should handle empty notes', () => {
      const paymentWithEmptyNotes = {
        ...mockPaymentData,
        notes: '',
      };

      const payment = new Payment(paymentWithEmptyNotes as any);

      expect(payment.notes).toBe('');
      expect(typeof payment.notes).toBe('string');
    });

    it('should handle very long notes', () => {
      const longNotes = 'a'.repeat(1000);
      const paymentWithLongNotes = {
        ...mockPaymentData,
        notes: longNotes,
      };

      const payment = new Payment(paymentWithLongNotes as any);

      expect(payment.notes).toBe(longNotes);
      expect(typeof payment.notes).toBe('string');
    });

    it('should handle special characters in notes', () => {
      const specialChars = 'Payment notes with émojis 🎉 and special chars: @#$%^&*()';
      const paymentWithSpecialChars = {
        ...mockPaymentData,
        notes: specialChars,
      };

      const payment = new Payment(paymentWithSpecialChars as any);

      expect(payment.notes).toBe(specialChars);
      expect(typeof payment.notes).toBe('string');
    });
  });

  describe('relationships', () => {
    it('should handle order relationship correctly', () => {
      const payment = new Payment(mockPaymentData as any);

      expect(payment.order).toBeDefined();
      expect(payment.order.id).toBe(mockOrderData.id);
      expect(payment.order.total).toBe(mockOrderData.total);
    });

    it('should handle null order', () => {
      const paymentWithNullOrder = {
        ...mockPaymentData,
        order: null,
      };

      const payment = new Payment(paymentWithNullOrder as any);

      expect(payment.order).toBeNull();
    });

    it('should handle undefined order', () => {
      const paymentWithUndefinedOrder = {
        ...mockPaymentData,
        order: undefined,
      };

      const payment = new Payment(paymentWithUndefinedOrder as any);

      expect(payment.order).toBeUndefined();
    });

    it('should handle user relationship correctly', () => {
      const payment = new Payment(mockPaymentData as any);

      expect(payment.user).toBeDefined();
      expect(payment.user.id).toBe(mockUserData.id);
      expect(payment.user.email).toBe(mockUserData.email);
    });

    it('should handle null user', () => {
      const paymentWithNullUser = {
        ...mockPaymentData,
        user: null,
      };

      const payment = new Payment(paymentWithNullUser as any);

      expect(payment.user).toBeNull();
    });

    it('should handle undefined user', () => {
      const paymentWithUndefinedUser = {
        ...mockPaymentData,
        user: undefined,
      };

      const payment = new Payment(paymentWithUndefinedUser as any);

      expect(payment.user).toBeUndefined();
    });
  });

  describe('serialization', () => {
    it('should be serializable to JSON', () => {
      const payment = new Payment(mockPaymentData as any);
      const jsonString = JSON.stringify(payment);
      const parsed = JSON.parse(jsonString);

      expect(parsed.id).toBe(mockPaymentData.id);
      expect(parsed.order_id).toBe(mockPaymentData.order_id);
      expect(parsed.user_id).toBe(mockPaymentData.user_id);
      expect(parsed.amount).toBe(mockPaymentData.amount);
      expect(parsed.payment_method).toBe(mockPaymentData.payment_method);
      expect(parsed.status).toBe(mockPaymentData.status);
      expect(parsed.transaction_id).toBe(mockPaymentData.transaction_id);
      expect(parsed.metadata).toEqual(mockPaymentData.metadata);
      expect(parsed.paid_at).toBeNull();
      expect(parsed.notes).toBe(mockPaymentData.notes);
      expect(parsed.created_at).toBe(mockPaymentData.created_at.toISOString());
      expect(parsed.updated_at).toBe(mockPaymentData.updated_at.toISOString());
      expect(parsed.deleted_at).toBeUndefined();
    });

    it('should serialize partial data correctly', () => {
      const partialPayment = Payment.build({
        id: 'test-id',
        order_id: 'test-order-id',
        user_id: 'test-user-id',
        amount: 100,
        payment_method: PaymentMethod.PAYPAL,
        status: PaymentStatus.PENDING,
      } as any, { isNewRecord: true });

      const jsonString = JSON.stringify(partialPayment);
      const parsed = JSON.parse(jsonString);

      expect(parsed.id).toBe('test-id');
      expect(parsed.order_id).toBe('test-order-id');
      expect(parsed.user_id).toBe('test-user-id');
      expect(parsed.amount).toBe(100);
      expect(parsed.payment_method).toBe('paypal');
      expect(parsed.status).toBe('pending'); // Default value
    });

    it('should handle null values in serialization', () => {
      const paymentWithNulls = new Payment({
        id: 'test-id',
        order_id: 'test-order-id',
        user_id: 'test-user-id',
        amount: 100,
        payment_method: PaymentMethod.CASH,
        transaction_id: null,
        metadata: null,
        paid_at: null,
        notes: null,
      } as any);

      const jsonString = JSON.stringify(paymentWithNulls);
      const parsed = JSON.parse(jsonString);

      expect(parsed.id).toBe('test-id');
      expect(parsed.transaction_id).toBe(null);
      expect(parsed.metadata).toBe(null);
      expect(parsed.paid_at).toBe(null);
      expect(parsed.notes).toBe(null);
    });
  });

  describe('edge cases', () => {
    it('should handle minimal data', () => {
      const minimalPayment = new Payment({
        id: 'minimal-id',
        order_id: 'minimal-order-id',
        user_id: 'minimal-user-id',
        amount: 1,
        payment_method: PaymentMethod.OTHER,
      } as any);

      expect(minimalPayment.id).toBe('minimal-id');
      expect(minimalPayment.order_id).toBe('minimal-order-id');
      expect(minimalPayment.user_id).toBe('minimal-user-id');
      expect(minimalPayment.amount).toBe(1);
      expect(minimalPayment.payment_method).toBe('other');
      expect(minimalPayment.status).toBe(PaymentStatus.PENDING); // Default
    });

    it('should handle maximum decimal precision', () => {
      const paymentWithMaxPrecision = {
        ...mockPaymentData,
        amount: 99999999.99,
      };

      const payment = new Payment(paymentWithMaxPrecision as any);

      expect(payment.amount).toBe(99999999.99);
      expect(typeof payment.amount).toBe('number');
    });
  });

  describe('model methods and behavior', () => {
    it('should handle Sequelize model methods', () => {
      const payment = new Payment(mockPaymentData as any);

      // Test that it's a Sequelize Model instance
      expect(typeof payment.save).toBe('function');
      expect(typeof payment.reload).toBe('function');
      expect(typeof payment.destroy).toBe('function');
      expect(typeof payment.update).toBe('function');
    });

    it('should handle dataValues property', () => {
      const payment = new Payment(mockPaymentData as any);

      // Sequelize models have dataValues property
      expect(payment.dataValues).toBeDefined();
      expect(typeof payment.dataValues).toBe('object');
    });

    it('should handle isNewRecord property', () => {
      const payment = new Payment(mockPaymentData as any);

      // Sequelize models have isNewRecord property
      expect(typeof payment.isNewRecord).toBe('boolean');
    });
  });
});
