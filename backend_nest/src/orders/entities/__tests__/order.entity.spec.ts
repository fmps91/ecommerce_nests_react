import { OrderEntity } from '../order.entity';
import { OrderStatus } from '../../models/order.model';
import { UserEntity } from '../../../users/entities/user.entity';
import { OrderDetailEntity } from '../order-detail.entity';

describe('OrderEntity', () => {
  const mockOrderData = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    userId: '123e4567-e89b-12d3-a456-426614174001',
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
  };

  const mockUser = {
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    roleId: 'CUSTOMER',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockItems = [
    new OrderDetailEntity({
      id: 'item-1',
      orderId: 'test-order-id',
      productId: 'product-1',
      unitPrice: 50.25,
      quantity: 2,
      subtotal: 100.50,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
  ];

  describe('constructor', () => {
    it('should create instance with complete data', () => {
      const entity = new OrderEntity(mockOrderData);

      expect(entity.id).toBe(mockOrderData.id);
      expect(entity.userId).toBe(mockOrderData.userId);
      expect(entity.items).toBe(mockOrderData.items);
      expect(entity.total).toBe(mockOrderData.total);
      expect(entity.status).toBe(mockOrderData.status);
      expect(entity.notes).toBe(mockOrderData.notes);
      expect(entity.shippingAddress).toBe(mockOrderData.shippingAddress);
      expect(entity.billingAddress).toBe(mockOrderData.billingAddress);
      expect(entity.paidAt).toBe(mockOrderData.paidAt);
      expect(entity.shippedAt).toBe(mockOrderData.shippedAt);
      expect(entity.deliveredAt).toBe(mockOrderData.deliveredAt);
      expect(entity.createdAt).toBe(mockOrderData.createdAt);
      expect(entity.updatedAt).toBe(mockOrderData.updatedAt);
    });

    it('should create instance with partial data', () => {
      const partialData = {
        id: 'test-id',
        userId: 'test-user-id',
        total: 50,
      };

      const entity = new OrderEntity(partialData);

      expect(entity.id).toBe('test-id');
      expect(entity.userId).toBe('test-user-id');
      expect(entity.total).toBe(50);
      expect(entity.status).toBeUndefined();
      expect(entity.notes).toBeUndefined();
    });

    it('should handle empty constructor', () => {
      const entity = new OrderEntity({});

      expect(entity.id).toBeUndefined();
      expect(entity.userId).toBeUndefined();
      expect(entity.total).toBeUndefined();
      expect(entity.status).toBeUndefined();
    });
  });

  describe('field types', () => {
    it('should handle correct field types', () => {
      const entity = new OrderEntity(mockOrderData);

      expect(typeof entity.id).toBe('string');
      expect(typeof entity.userId).toBe('string');
      expect(Array.isArray(entity.items)).toBe(true);
      expect(typeof entity.total).toBe('number');
      expect(typeof entity.status).toBe('string');
      expect(typeof entity.notes).toBe('string');
      expect(typeof entity.shippingAddress).toBe('object');
      expect(typeof entity.billingAddress).toBe('object');
      expect(entity.paidAt instanceof Date).toBe(true);
      expect(entity.shippedAt instanceof Date).toBe(true);
      expect(entity.deliveredAt instanceof Date).toBe(true);
      expect(entity.createdAt instanceof Date).toBe(true);
      expect(entity.updatedAt instanceof Date).toBe(true);
    });

    it('should handle UUID format for id', () => {
      const entity = new OrderEntity(mockOrderData);

      expect(entity.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should handle UUID format for userId', () => {
      const entity = new OrderEntity(mockOrderData);

      expect(entity.userId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should handle status enum', () => {
      const entity = new OrderEntity(mockOrderData);

      expect(entity.status).toBe('PENDING');
      expect(['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED', 'REFUNDED']).toContain(entity.status);
    });
  });

  describe('date handling', () => {
    it('should handle Date objects correctly', () => {
      const testDate = new Date('2024-12-25T15:30:00.000Z');
      const entityWithDates = {
        ...mockOrderData,
        paidAt: testDate,
        shippedAt: testDate,
        deliveredAt: testDate,
        createdAt: testDate,
        updatedAt: testDate,
      };

      const entity = new OrderEntity(entityWithDates);

      expect(entity.paidAt).toBe(testDate);
      expect(entity.shippedAt).toBe(testDate);
      expect(entity.deliveredAt).toBe(testDate);
      expect(entity.createdAt).toBe(testDate);
      expect(entity.updatedAt).toBe(testDate);
      expect(entity.paidAt instanceof Date).toBe(true);
      expect(entity.shippedAt instanceof Date).toBe(true);
      expect(entity.deliveredAt instanceof Date).toBe(true);
      expect(entity.createdAt instanceof Date).toBe(true);
      expect(entity.updatedAt instanceof Date).toBe(true);
    });

    it('should handle null dates', () => {
      const entityWithNullDates = {
        ...mockOrderData,
        paidAt: null,
        shippedAt: null,
        deliveredAt: null,
      };

      const entity = new OrderEntity(entityWithNullDates as any);

      expect(entity.paidAt).toBeNull();
      expect(entity.shippedAt).toBeNull();
      expect(entity.deliveredAt).toBeNull();
    });

    it('should handle undefined dates', () => {
      const entityWithUndefinedDates = {
        ...mockOrderData,
        paidAt: undefined,
        shippedAt: undefined,
        deliveredAt: undefined,
      };

      const entity = new OrderEntity(entityWithUndefinedDates);

      expect(entity.paidAt).toBeUndefined();
      expect(entity.shippedAt).toBeUndefined();
      expect(entity.deliveredAt).toBeUndefined();
    });
  });

  describe('address handling', () => {
    it('should handle complex address objects', () => {
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

      const complexBillingAddress = {
        street: '456 Billing St',
        city: 'Billing City',
        state: 'BS',
        zipCode: '67890',
        country: 'USA',
        company: 'Test Company',
        taxId: '12-3456789',
      };

      const entityWithComplexAddresses = {
        ...mockOrderData,
        shippingAddress: complexShippingAddress,
        billingAddress: complexBillingAddress,
      };

      const entity = new OrderEntity(entityWithComplexAddresses);

      expect(entity.shippingAddress).toEqual(complexShippingAddress);
      expect(entity.billingAddress).toEqual(complexBillingAddress);
      expect(typeof entity.shippingAddress).toBe('object');
      expect(typeof entity.billingAddress).toBe('object');
    });

    it('should handle empty address objects', () => {
      const entityWithEmptyAddresses = {
        ...mockOrderData,
        shippingAddress: {},
        billingAddress: {},
      };

      const entity = new OrderEntity(entityWithEmptyAddresses);

      expect(entity.shippingAddress).toEqual({});
      expect(entity.billingAddress).toEqual({});
    });

    it('should handle null addresses', () => {
      const entityWithNullAddresses = {
        ...mockOrderData,
        shippingAddress: null,
        billingAddress: null,
      };

      const entity = new OrderEntity(entityWithNullAddresses as any);

      expect(entity.shippingAddress).toBeNull();
      expect(entity.billingAddress).toBeNull();
    });
  });

  describe('user relationship', () => {
    it('should handle user object correctly', () => {
      const entityWithUser = {
        ...mockOrderData,
        user: mockUser,
      };

      const entity = new OrderEntity(entityWithUser);

      expect(entity.user).toBeInstanceOf(UserEntity);
      expect(entity.user?.id).toBe(mockUser.id);
      expect(entity.user?.email).toBe(mockUser.email);
      expect(entity.user?.name).toBe(mockUser.name);
    });

    it('should handle null user', () => {
      const entityWithNullUser = {
        ...mockOrderData,
        user: null,
      };

      const entity = new OrderEntity(entityWithNullUser as any);

      expect(entity.user).toBeNull();
    });

    it('should handle undefined user', () => {
      const entityWithUndefinedUser = {
        ...mockOrderData,
        user: undefined,
      };

      const entity = new OrderEntity(entityWithUndefinedUser);

      expect(entity.user).toBeUndefined();
    });
  });

  describe('items relationship', () => {
    it('should handle items array correctly', () => {
      const entityWithItems = {
        ...mockOrderData,
        items: mockItems,
      };

      const entity = new OrderEntity(entityWithItems);

      expect(entity.items).toHaveLength(1);
      expect(entity.items[0]).toBeInstanceOf(OrderDetailEntity);
      expect(entity.items[0].id).toBe('item-1');
      expect(entity.items[0].productId).toBe('product-1');
    });

    it('should handle empty items array', () => {
      const entityWithEmptyItems = {
        ...mockOrderData,
        items: [],
      };

      const entity = new OrderEntity(entityWithEmptyItems);

      expect(entity.items).toHaveLength(0);
      expect(Array.isArray(entity.items)).toBe(true);
    });

    it('should handle null items', () => {
      const entityWithNullItems = {
        ...mockOrderData,
        items: null,
      };

      const entity = new OrderEntity(entityWithNullItems as any);

      expect(entity.items).toBeNull();
    });

    it('should handle undefined items', () => {
      const entityWithUndefinedItems = {
        ...mockOrderData,
        items: undefined,
      };

      const entity = new OrderEntity(entityWithUndefinedItems);

      expect(entity.items).toBeUndefined();
    });
  });

  describe('serialization', () => {
    it('should be serializable to JSON', () => {
      const entity = new OrderEntity(mockOrderData);
      const jsonString = JSON.stringify(entity);
      const parsed = JSON.parse(jsonString);

      expect(parsed.id).toBe(mockOrderData.id);
      expect(parsed.userId).toBe(mockOrderData.userId);
      expect(parsed.total).toBe(mockOrderData.total);
      expect(parsed.status).toBe(mockOrderData.status);
      expect(parsed.paidAt).toBe(null);
      expect(parsed.shippedAt).toBe(null);
      expect(parsed.deliveredAt).toBe(null);
      expect(parsed.createdAt).toBe(mockOrderData.createdAt.toISOString());
      expect(parsed.updatedAt).toBe(mockOrderData.updatedAt.toISOString());
    });

    it('should serialize partial data correctly', () => {
      const partialEntity = new OrderEntity({
        id: 'test-id',
        total: 50,
      });

      const jsonString = JSON.stringify(partialEntity);
      const parsed = JSON.parse(jsonString);

      expect(parsed.id).toBe('test-id');
      expect(parsed.total).toBe(50);
      expect(parsed.userId).toBeUndefined();
      expect(parsed.status).toBeUndefined();
    });

    it('should handle null values in serialization', () => {
      const entityWithNulls = new OrderEntity({
        id: 'test-id',
        paidAt: null,
        shippedAt: null,
        deliveredAt: null,
        user: null,
        items: null,
      } as any);

      const jsonString = JSON.stringify(entityWithNulls);
      const parsed = JSON.parse(jsonString);

      expect(parsed.id).toBe('test-id');
      expect(parsed.paidAt).toBe(null);
      expect(parsed.shippedAt).toBe(null);
      expect(parsed.deliveredAt).toBe(null);
      expect(parsed.user).toBe(null);
      expect(parsed.items).toBe(null);
    });
  });

  describe('edge cases', () => {
    it('should handle very long strings', () => {
      const longString = 'a'.repeat(1000);
      const entityWithLongStrings = {
        ...mockOrderData,
        notes: longString,
      };

      const entity = new OrderEntity(entityWithLongStrings);

      expect(entity.notes).toBe(longString);
      expect(typeof entity.notes).toBe('string');
    });

    it('should handle special characters in strings', () => {
      const specialChars = 'Order with émojis 🎉 and special chars: @#$%^&*()';
      const entityWithSpecialChars = {
        ...mockOrderData,
        notes: specialChars,
      };

      const entity = new OrderEntity(entityWithSpecialChars);

      expect(entity.notes).toBe(specialChars);
      expect(typeof entity.notes).toBe('string');
    });

    it('should handle zero total', () => {
      const entityWithZeroTotal = {
        ...mockOrderData,
        total: 0,
      };

      const entity = new OrderEntity(entityWithZeroTotal);

      expect(entity.total).toBe(0);
      expect(typeof entity.total).toBe('number');
    });

    it('should handle negative total', () => {
      const entityWithNegativeTotal = {
        ...mockOrderData,
        total: -50,
      };

      const entity = new OrderEntity(entityWithNegativeTotal);

      expect(entity.total).toBe(-50);
      expect(typeof entity.total).toBe('number');
    });

    it('should handle decimal total', () => {
      const entityWithDecimalTotal = {
        ...mockOrderData,
        total: 99.999,
      };

      const entity = new OrderEntity(entityWithDecimalTotal);

      expect(entity.total).toBe(99.999);
      expect(typeof entity.total).toBe('number');
    });
  });

  describe('Object.assign behavior', () => {
    it('should merge properties correctly using Object.assign', () => {
      const entity = new OrderEntity({});
      Object.assign(entity, mockOrderData);

      expect(entity.id).toBe(mockOrderData.id);
      expect(entity.userId).toBe(mockOrderData.userId);
      expect(entity.total).toBe(mockOrderData.total);
    });

    it('should overwrite existing properties with Object.assign', () => {
      const entity = new OrderEntity(mockOrderData);
      const newData = {
        status: 'COMPLETED',
        notes: 'Updated notes',
      };

      Object.assign(entity, newData);

      expect(entity.id).toBe(mockOrderData.id); // Should remain unchanged
      expect(entity.status).toBe('COMPLETED'); // Should be updated
      expect(entity.notes).toBe('Updated notes'); // Should be updated
    });
  });

  describe('calculated properties', () => {
    it('should handle isPaid getter', () => {
      const entity = new OrderEntity(mockOrderData);

      expect(entity.isPaid).toBeDefined();
      expect(typeof entity.isPaid).toBe('boolean');
    });

    it('should return false for unpaid order', () => {
      const unpaidEntity = new OrderEntity({
        ...mockOrderData,
        paidAt: undefined,
      });

      expect(unpaidEntity.isPaid).toBe(false);
    });

    it('should return true for paid order', () => {
      const paidEntity = new OrderEntity({
        ...mockOrderData,
        paidAt: new Date(),
      });

      expect(paidEntity.isPaid).toBe(true);
    });

    it('should handle isShipped getter', () => {
      const entity = new OrderEntity(mockOrderData);

      expect(entity.isShipped).toBeDefined();
      expect(typeof entity.isShipped).toBe('boolean');
    });

    it('should return false for unshipped order', () => {
      const unshippedEntity = new OrderEntity({
        ...mockOrderData,
        shippedAt: undefined,
      });

      expect(unshippedEntity.isShipped).toBe(false);
    });

    it('should return true for shipped order', () => {
      const shippedEntity = new OrderEntity({
        ...mockOrderData,
        shippedAt: new Date(),
      });

      expect(shippedEntity.isShipped).toBe(true);
    });

    it('should handle isDelivered getter', () => {
      const entity = new OrderEntity(mockOrderData);

      expect(entity.isDelivered).toBeDefined();
      expect(typeof entity.isDelivered).toBe('boolean');
    });

    it('should return false for undelivered order', () => {
      const undeliveredEntity = new OrderEntity({
        ...mockOrderData,
        deliveredAt: undefined,
      });

      expect(undeliveredEntity.isDelivered).toBe(false);
    });

    it('should return true for delivered order', () => {
      const deliveredEntity = new OrderEntity({
        ...mockOrderData,
        deliveredAt: new Date(),
      });

      expect(deliveredEntity.isDelivered).toBe(true);
    });

    it('should handle formattedTotal getter', () => {
      const entity = new OrderEntity(mockOrderData);

      expect(entity.formattedTotal).toBeDefined();
      expect(typeof entity.formattedTotal).toBe('string');
    });

    it('should format currency correctly', () => {
      const entity = new OrderEntity({
        ...mockOrderData,
        total: 100.50,
      });

      const formatted = entity.formattedTotal;

      expect(formatted).toBe('100,50 €');
    });

    it('should handle zero total formatting', () => {
      const entity = new OrderEntity({
        ...mockOrderData,
        total: 0,
      });

      const formatted = entity.formattedTotal;

      expect(formatted).toBe('0,00 €');
    });

    it('should handle negative total formatting', () => {
      const entity = new OrderEntity({
        ...mockOrderData,
        total: -50.25,
      });

      const formatted = entity.formattedTotal;

      expect(formatted).toBe('-50,25 €');
    });
  });
});
