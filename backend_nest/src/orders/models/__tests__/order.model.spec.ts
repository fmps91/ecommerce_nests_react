import { Order, OrderStatus } from '../order.model';

describe('Order Model', () => {
  const mockUserData = {
    id: '123e4567-e89b-12d3-a456-426614174001',
    email: 'customer@example.com',
    name: 'Test Customer',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
  };

  const mockOrderDetailData = {
    id: '123e4567-e89b-12d3-a456-426614174003',
    orderId: '123e4567-e89b-12d3-a456-426614174000',
    productId: '123e4567-e89b-12d3-a456-426614174004',
    productName: 'Test Product',
    unitPrice: 50.25,
    quantity: 2,
    subtotal: 100.50,
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
  };

  const mockOrderData = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    userId: '123e4567-e89b-12d3-a456-426614174001',
    total: 100.50,
    status: OrderStatus.PENDING,
    isPaid: false,
    notes: 'Test order notes',
    shippingAddress: { street: '123 Test St', city: 'Test City', zipCode: '12345' },
    billingAddress: { street: '456 Billing St', city: 'Billing City', zipCode: '67890' },
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
    deletedAt: undefined,
    paidAt: undefined,
    shippedAt: undefined,
    deliveredAt: undefined,
    user: mockUserData,
    items: [mockOrderDetailData],
  };

  describe('model structure', () => {
    it('should have correct table configuration', () => {
      // Test that Order model extends Sequelize Model
      expect(Order.prototype.constructor.name).toBe('Order');
    });

    it('should have all required fields', () => {
      const order = new Order(mockOrderData as any);

      expect(order.id).toBeDefined();
      expect(order.userId).toBeDefined();
      expect(order.total).toBeDefined();
      expect(order.status).toBeDefined();
      expect(order.isPaid).toBeDefined();
      expect(order.notes).toBeDefined();
      expect(order.shippingAddress).toBeDefined();
      expect(order.billingAddress).toBeDefined();
      expect(order.createdAt).toBeDefined();
      expect(order.updatedAt).toBeDefined();
      expect(order.deletedAt).toBeDefined();
      expect(order.paidAt).toBeDefined();
      expect(order.shippedAt).toBeDefined();
      expect(order.deliveredAt).toBeDefined();
    });
  });

  describe('field types and validation', () => {
    it('should handle correct field types', () => {
      const order = new Order(mockOrderData as any);

      expect(typeof order.id).toBe('string');
      expect(typeof order.userId).toBe('string');
      expect(typeof order.total).toBe('number');
      expect(typeof order.status).toBe('string');
      expect(typeof order.isPaid).toBe('boolean');
      expect(typeof order.notes).toBe('string');
      expect(typeof order.shippingAddress).toBe('object');
      expect(typeof order.billingAddress).toBe('object');
      expect(order.createdAt instanceof Date).toBe(true);
      expect(order.updatedAt instanceof Date).toBe(true);
    });

    it('should handle UUID format for id', () => {
      const order = new Order(mockOrderData as any);

      expect(order.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should handle UUID format for userId', () => {
      const order = new Order(mockOrderData as any);

      expect(order.userId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should handle total validation', () => {
      const order = new Order(mockOrderData as any);

      expect(order.total).toBe(100.50);
      expect(typeof order.total).toBe('number');
    });

    it('should handle isPaid boolean field', () => {
      const order = new Order(mockOrderData as any);

      expect(order.isPaid).toBe(false);
      expect(typeof order.isPaid).toBe('boolean');
    });
  });

  describe('OrderStatus enum', () => {
    it('should handle all order statuses', () => {
      const orderStatuses = [
        OrderStatus.PENDING,
        OrderStatus.PROCESSING,
        OrderStatus.COMPLETED,
        OrderStatus.CANCELLED,
        OrderStatus.REFUNDED,
      ];

      orderStatuses.forEach(status => {
        const order = new Order({ ...mockOrderData, status } as any);
        expect(order.status).toBe(status);
        expect(Object.values(OrderStatus)).toContain(order.status);
      });
    });

    it('should validate order status values', () => {
      const validStatuses = ['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED', 'REFUNDED'];
      
      validStatuses.forEach(status => {
        expect(Object.values(OrderStatus)).toContain(status);
      });
    });

    it('should have default status as PENDING', () => {
      const order = new Order({
        id: 'test-id',
        userId: 'test-user-id',
        total: 100,
      } as any);

      expect(order.status).toBe(OrderStatus.PENDING);
    });
  });

  describe('date handling', () => {
    it('should handle Date objects correctly', () => {
      const testDate = new Date('2024-12-25T15:30:00.000Z');
      const orderWithDates = {
        ...mockOrderData,
        createdAt: testDate,
        updatedAt: testDate,
      };

      const order = new Order(orderWithDates as any);

      expect(order.createdAt).toBe(testDate);
      expect(order.updatedAt).toBe(testDate);
      expect(order.createdAt instanceof Date).toBe(true);
      expect(order.updatedAt instanceof Date).toBe(true);
    });

    it('should handle null deletedAt', () => {
      const orderWithNullDeletedAt = {
        ...mockOrderData,
        deletedAt: null,
      };

      const order = new Order(orderWithNullDeletedAt as any);

      expect(order.deletedAt).toBeNull();
    });

    it('should handle undefined deletedAt', () => {
      const orderWithUndefinedDeletedAt = {
        ...mockOrderData,
        deletedAt: undefined,
      };

      const order = new Order(orderWithUndefinedDeletedAt as any);

      expect(order.deletedAt).toBeUndefined();
    });

    it('should handle deletedAt as Date', () => {
      const deletedDate = new Date('2024-06-01T00:00:00.000Z');
      const orderWithDeletedAt = {
        ...mockOrderData,
        deletedAt: deletedDate,
      };

      const order = new Order(orderWithDeletedAt as any);

      expect(order.deletedAt).toBe(deletedDate);
      expect(order.deletedAt instanceof Date).toBe(true);
    });

    it('should handle null paidAt', () => {
      const orderWithNullPaidAt = {
        ...mockOrderData,
        paidAt: null,
      };

      const order = new Order(orderWithNullPaidAt as any);

      expect(order.paidAt).toBeNull();
    });

    it('should handle undefined paidAt', () => {
      const orderWithUndefinedPaidAt = {
        ...mockOrderData,
        paidAt: undefined,
      };

      const order = new Order(orderWithUndefinedPaidAt as any);

      expect(order.paidAt).toBeUndefined();
    });

    it('should handle paidAt as Date', () => {
      const paidDate = new Date('2024-06-01T00:00:00.000Z');
      const orderWithPaidAt = {
        ...mockOrderData,
        paidAt: paidDate,
      };

      const order = new Order(orderWithPaidAt as any);

      expect(order.paidAt).toBe(paidDate);
      expect(order.paidAt instanceof Date).toBe(true);
    });

    it('should handle null shippedAt', () => {
      const orderWithNullShippedAt = {
        ...mockOrderData,
        shippedAt: null,
      };

      const order = new Order(orderWithNullShippedAt as any);

      expect(order.shippedAt).toBeNull();
    });

    it('should handle undefined shippedAt', () => {
      const orderWithUndefinedShippedAt = {
        ...mockOrderData,
        shippedAt: undefined,
      };

      const order = new Order(orderWithUndefinedShippedAt as any);

      expect(order.shippedAt).toBeUndefined();
    });

    it('should handle shippedAt as Date', () => {
      const shippedDate = new Date('2024-06-02T00:00:00.000Z');
      const orderWithShippedAt = {
        ...mockOrderData,
        shippedAt: shippedDate,
      };

      const order = new Order(orderWithShippedAt as any);

      expect(order.shippedAt).toBe(shippedDate);
      expect(order.shippedAt instanceof Date).toBe(true);
    });

    it('should handle null deliveredAt', () => {
      const orderWithNullDeliveredAt = {
        ...mockOrderData,
        deliveredAt: null,
      };

      const order = new Order(orderWithNullDeliveredAt as any);

      expect(order.deliveredAt).toBeNull();
    });

    it('should handle undefined deliveredAt', () => {
      const orderWithUndefinedDeliveredAt = {
        ...mockOrderData,
        deliveredAt: undefined,
      };

      const order = new Order(orderWithUndefinedDeliveredAt as any);

      expect(order.deliveredAt).toBeUndefined();
    });

    it('should handle deliveredAt as Date', () => {
      const deliveredDate = new Date('2024-06-03T00:00:00.000Z');
      const orderWithDeliveredAt = {
        ...mockOrderData,
        deliveredAt: deliveredDate,
      };

      const order = new Order(orderWithDeliveredAt as any);

      expect(order.deliveredAt).toBe(deliveredDate);
      expect(order.deliveredAt instanceof Date).toBe(true);
    });
  });

  describe('total handling', () => {
    it('should handle zero total', () => {
      const orderWithZeroTotal = {
        ...mockOrderData,
        total: 0,
      };

      const order = new Order(orderWithZeroTotal as any);

      expect(order.total).toBe(0);
      expect(typeof order.total).toBe('number');
    });

    it('should handle negative total', () => {
      const orderWithNegativeTotal = {
        ...mockOrderData,
        total: -50,
      };

      const order = new Order(orderWithNegativeTotal as any);

      expect(order.total).toBe(-50);
      expect(typeof order.total).toBe('number');
    });

    it('should handle decimal total', () => {
      const orderWithDecimalTotal = {
        ...mockOrderData,
        total: 99.999,
      };

      const order = new Order(orderWithDecimalTotal as any);

      expect(order.total).toBe(99.999);
      expect(typeof order.total).toBe('number');
    });

    it('should handle very large total', () => {
      const orderWithLargeTotal = {
        ...mockOrderData,
        total: 999999.99,
      };

      const order = new Order(orderWithLargeTotal as any);

      expect(order.total).toBe(999999.99);
      expect(typeof order.total).toBe('number');
    });

    it('should handle total with decimal precision', () => {
      const orderWithPrecision = {
        ...mockOrderData,
        total: 1234.56,
      };

      const order = new Order(orderWithPrecision as any);

      expect(order.total).toBe(1234.56);
      expect(order.total.toFixed(2)).toBe('1234.56');
    });
  });

  describe('isPaid handling', () => {
    it('should handle true isPaid', () => {
      const orderWithPaid = {
        ...mockOrderData,
        isPaid: true,
      };

      const order = new Order(orderWithPaid as any);

      expect(order.isPaid).toBe(true);
      expect(typeof order.isPaid).toBe('boolean');
    });

    it('should handle false isPaid', () => {
      const orderWithUnpaid = {
        ...mockOrderData,
        isPaid: false,
      };

      const order = new Order(orderWithUnpaid as any);

      expect(order.isPaid).toBe(false);
      expect(typeof order.isPaid).toBe('boolean');
    });
  });

  describe('notes handling', () => {
    it('should handle null notes', () => {
      const orderWithNullNotes = {
        ...mockOrderData,
        notes: null,
      };

      const order = new Order(orderWithNullNotes as any);

      expect(order.notes).toBeNull();
    });

    it('should handle undefined notes', () => {
      const orderWithUndefinedNotes = {
        ...mockOrderData,
        notes: undefined,
      };

      const order = new Order(orderWithUndefinedNotes as any);

      expect(order.notes).toBeUndefined();
    });

    it('should handle empty notes', () => {
      const orderWithEmptyNotes = {
        ...mockOrderData,
        notes: '',
      };

      const order = new Order(orderWithEmptyNotes as any);

      expect(order.notes).toBe('');
      expect(typeof order.notes).toBe('string');
    });

    it('should handle very long notes', () => {
      const longNotes = 'a'.repeat(1000);
      const orderWithLongNotes = {
        ...mockOrderData,
        notes: longNotes,
      };

      const order = new Order(orderWithLongNotes as any);

      expect(order.notes).toBe(longNotes);
      expect(typeof order.notes).toBe('string');
    });

    it('should handle special characters in notes', () => {
      const specialChars = 'Order notes with émojis 🎉 and special chars: @#$%^&*()';
      const orderWithSpecialChars = {
        ...mockOrderData,
        notes: specialChars,
      };

      const order = new Order(orderWithSpecialChars as any);

      expect(order.notes).toBe(specialChars);
      expect(typeof order.notes).toBe('string');
    });
  });

  describe('address handling', () => {
    it('should handle complex shipping address', () => {
      const complexShippingAddress = {
        street: '123 Main St',
        city: 'Test City',
        state: 'TS',
        zipCode: '12345',
        country: 'USA',
        additionalInfo: 'Apt 4B',
        coordinates: {
          lat: 40.7128,
          lng: -74.0060,
        },
      };

      const orderWithComplexShipping = {
        ...mockOrderData,
        shippingAddress: complexShippingAddress,
      };

      const order = new Order(orderWithComplexShipping as any);

      expect(order.shippingAddress).toEqual(complexShippingAddress);
      expect(typeof order.shippingAddress).toBe('object');
    });

    it('should handle empty shipping address', () => {
      const orderWithEmptyShipping = {
        ...mockOrderData,
        shippingAddress: {},
      };

      const order = new Order(orderWithEmptyShipping as any);

      expect(order.shippingAddress).toEqual({});
      expect(typeof order.shippingAddress).toBe('object');
    });

    it('should handle null shipping address', () => {
      const orderWithNullShipping = {
        ...mockOrderData,
        shippingAddress: null,
      };

      const order = new Order(orderWithNullShipping as any);

      expect(order.shippingAddress).toBeNull();
    });

    it('should handle complex billing address', () => {
      const complexBillingAddress = {
        street: '456 Billing St',
        city: 'Billing City',
        state: 'BS',
        zipCode: '67890',
        country: 'USA',
        company: 'Test Company',
        taxId: '12-3456789',
      };

      const orderWithComplexBilling = {
        ...mockOrderData,
        billingAddress: complexBillingAddress,
      };

      const order = new Order(orderWithComplexBilling as any);

      expect(order.billingAddress).toEqual(complexBillingAddress);
      expect(typeof order.billingAddress).toBe('object');
    });

    it('should handle empty billing address', () => {
      const orderWithEmptyBilling = {
        ...mockOrderData,
        billingAddress: {},
      };

      const order = new Order(orderWithEmptyBilling as any);

      expect(order.billingAddress).toEqual({});
      expect(typeof order.billingAddress).toBe('object');
    });

    it('should handle null billing address', () => {
      const orderWithNullBilling = {
        ...mockOrderData,
        billingAddress: null,
      };

      const order = new Order(orderWithNullBilling as any);

      expect(order.billingAddress).toBeNull();
    });
  });

  describe('relationships', () => {
    it('should handle user relationship correctly', () => {
      const order = new Order(mockOrderData as any);

      expect(order.user).toBeDefined();
      expect(order.user.id).toBe(mockUserData.id);
      expect(order.user.email).toBe(mockUserData.email);
    });

    it('should handle null user', () => {
      const orderWithNullUser = {
        ...mockOrderData,
        user: null,
      };

      const order = new Order(orderWithNullUser as any);

      expect(order.user).toBeNull();
    });

    it('should handle undefined user', () => {
      const orderWithUndefinedUser = {
        ...mockOrderData,
        user: undefined,
      };

      const order = new Order(orderWithUndefinedUser as any);

      expect(order.user).toBeUndefined();
    });

    it('should handle items relationship correctly', () => {
      const order = new Order(mockOrderData as any);

      expect(order.items).toBeDefined();
      expect(Array.isArray(order.items)).toBe(true);
      expect(order.items).toHaveLength(1);
      expect(order.items[0].id).toBe(mockOrderDetailData.id);
    });

    it('should handle empty items array', () => {
      const orderWithEmptyItems = {
        ...mockOrderData,
        items: [],
      };

      const order = new Order(orderWithEmptyItems as any);

      expect(order.items).toHaveLength(0);
      expect(Array.isArray(order.items)).toBe(true);
    });

    it('should handle null items', () => {
      const orderWithNullItems = {
        ...mockOrderData,
        items: null,
      };

      const order = new Order(orderWithNullItems as any);

      expect(order.items).toBeNull();
    });

    it('should handle undefined items', () => {
      const orderWithUndefinedItems = {
        ...mockOrderData,
        items: undefined,
      };

      const order = new Order(orderWithUndefinedItems as any);

      expect(order.items).toBeUndefined();
    });
  });

  describe('serialization', () => {
    it('should be serializable to JSON', () => {
      const order = new Order(mockOrderData as any);
      const jsonString = JSON.stringify(order);
      const parsed = JSON.parse(jsonString);

      expect(parsed.id).toBe(mockOrderData.id);
      expect(parsed.userId).toBe(mockOrderData.userId);
      expect(parsed.total).toBe(mockOrderData.total);
      expect(parsed.status).toBe(mockOrderData.status);
      expect(parsed.isPaid).toBe(mockOrderData.isPaid);
      expect(parsed.notes).toBe(mockOrderData.notes);
      expect(parsed.shippingAddress).toEqual(mockOrderData.shippingAddress);
      expect(parsed.billingAddress).toEqual(mockOrderData.billingAddress);
      expect(parsed.createdAt).toBe(mockOrderData.createdAt.toISOString());
      expect(parsed.updatedAt).toBe(mockOrderData.updatedAt.toISOString());
      expect(parsed.paidAt).toBeUndefined();
      expect(parsed.shippedAt).toBeUndefined();
      expect(parsed.deliveredAt).toBeUndefined();
    });

    it('should serialize partial data correctly', () => {
      const partialOrder = new Order({
        id: 'test-id',
        userId: 'test-user-id',
        total: 50,
      } as any);

      const jsonString = JSON.stringify(partialOrder);
      const parsed = JSON.parse(jsonString);

      expect(parsed.id).toBe('test-id');
      expect(parsed.userId).toBe('test-user-id');
      expect(parsed.total).toBe(50);
      expect(parsed.status).toBe('PENDING'); // Default value
      expect(parsed.isPaid).toBe(false); // Default value
    });

    it('should handle null values in serialization', () => {
      const orderWithNulls = new Order({
        id: 'test-id',
        userId: 'test-user-id',
        total: 100,
        deletedAt: null,
        paidAt: null,
        shippedAt: null,
        deliveredAt: null,
        user: null,
        items: null,
      } as any);

      const jsonString = JSON.stringify(orderWithNulls);
      const parsed = JSON.parse(jsonString);

      expect(parsed.id).toBe('test-id');
      expect(parsed.deletedAt).toBe(null);
      expect(parsed.paidAt).toBe(null);
      expect(parsed.shippedAt).toBe(null);
      expect(parsed.deliveredAt).toBe(null);
      expect(parsed.user).toBe(null);
      expect(parsed.items).toBe(null);
    });
  });

  describe('edge cases', () => {
    it('should handle minimal data', () => {
      const minimalOrder = new Order({
        id: 'minimal-id',
        userId: 'minimal-user-id',
        total: 1,
      } as any);

      expect(minimalOrder.id).toBe('minimal-id');
      expect(minimalOrder.userId).toBe('minimal-user-id');
      expect(minimalOrder.total).toBe(1);
      expect(minimalOrder.status).toBe(OrderStatus.PENDING); // Default
      expect(minimalOrder.isPaid).toBe(false); // Default
    });

    it('should handle maximum decimal precision', () => {
      const orderWithMaxPrecision = {
        ...mockOrderData,
        total: 99999999.99,
      };

      const order = new Order(orderWithMaxPrecision as any);

      expect(order.total).toBe(99999999.99);
      expect(typeof order.total).toBe('number');
    });
  });

  describe('model methods and behavior', () => {
    it('should handle Sequelize model methods', () => {
      const order = new Order(mockOrderData as any);

      // Test that it's a Sequelize Model instance
      expect(typeof order.save).toBe('function');
      expect(typeof order.reload).toBe('function');
      expect(typeof order.destroy).toBe('function');
      expect(typeof order.update).toBe('function');
    });

    it('should handle dataValues property', () => {
      const order = new Order(mockOrderData as any);

      // Sequelize models have dataValues property
      expect(order.dataValues).toBeDefined();
      expect(typeof order.dataValues).toBe('object');
    });

    it('should handle isNewRecord property', () => {
      const order = new Order(mockOrderData as any);

      // Sequelize models have isNewRecord property
      expect(typeof order.isNewRecord).toBe('boolean');
    });
  });
});
