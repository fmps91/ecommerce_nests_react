import { OrderResponseDto } from '../order-response.dto';
import { OrderStatus } from '../../models/order.model';
import { UserResponseDto } from '../../../users/dto/user-response.dto';
import { UserRole } from '../../../users/entities/user.entity';
import { OrderDetailResponseDto } from '../order-detail-response.dto';

describe('OrderResponseDto', () => {
  const mockOrderResponseData = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    userId: '123e4567-e89b-12d3-a456-426614174001',
    itemsIds: ['item-1', 'item-2'],
    total: 100.50,
    status: 'PENDING' as OrderStatus,
    notes: 'Test order',
    shippingAddress: { street: '123 Test St' },
    billingAddress: { street: '456 Billing St' },
    paidAt: new Date(),
    shippedAt: new Date(),
    deliveredAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    user: new UserResponseDto({
      id: '123e4567-e89b-12d3-a456-426614174001',
      email: 'test@example.com',
      name: 'Test User',
      role: UserRole.ADMIN,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    items: [
      new OrderDetailResponseDto({
        id: 'item-1',
        productId: 'product-1',
        unitPrice: 50.25,
        quantity: 2,
        subtotal: 100.50,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ],
  };

  describe('constructor', () => {
    it('should create instance with complete data', () => {
      const dto = new OrderResponseDto(mockOrderResponseData);

      expect(dto.id).toBe(mockOrderResponseData.id);
      expect(dto.userId).toBe(mockOrderResponseData.userId);
      expect(dto.itemsIds).toEqual(mockOrderResponseData.itemsIds);
      expect(dto.total).toBe(mockOrderResponseData.total);
      expect(dto.status).toBe(mockOrderResponseData.status);
      expect(dto.notes).toBe(mockOrderResponseData.notes);
      expect(dto.shippingAddress).toEqual(mockOrderResponseData.shippingAddress);
      expect(dto.billingAddress).toEqual(mockOrderResponseData.billingAddress);
      expect(dto.paidAt).toBe(mockOrderResponseData.paidAt);
      expect(dto.shippedAt).toBe(mockOrderResponseData.shippedAt);
      expect(dto.deliveredAt).toBe(mockOrderResponseData.deliveredAt);
      expect(dto.createdAt).toBe(mockOrderResponseData.createdAt);
      expect(dto.updatedAt).toBe(mockOrderResponseData.updatedAt);
      expect(dto.user).toBeInstanceOf(UserResponseDto);
      expect(dto.items).toHaveLength(1);
      expect(dto.items?.[0]).toBeInstanceOf(OrderDetailResponseDto);
    });

    it('should create instance with partial data', () => {
      const partialData = {
        id: 'test-id',
        userId: 'test-user-id',
        total: 50,
      };

      const dto = new OrderResponseDto(partialData);

      expect(dto.id).toBe('test-id');
      expect(dto.userId).toBe('test-user-id');
      expect(dto.total).toBe(50);
      expect(dto.status).toBeUndefined();
      expect(dto.notes).toBeUndefined();
    });

    it('should handle empty constructor', () => {
      const dto = new OrderResponseDto({});

      expect(dto.id).toBeUndefined();
      expect(dto.userId).toBeUndefined();
      expect(dto.total).toBeUndefined();
      expect(dto.status).toBeUndefined();
    });
  });

  describe('field types', () => {
    it('should handle correct field types', () => {
      const dto = new OrderResponseDto(mockOrderResponseData);

      expect(typeof dto.id).toBe('string');
      expect(typeof dto.userId).toBe('string');
      expect(Array.isArray(dto.itemsIds)).toBe(true);
      expect(typeof dto.total).toBe('number');
      expect(typeof dto.status).toBe('string');
      expect(typeof dto.notes).toBe('string');
      expect(typeof dto.shippingAddress).toBe('object');
      expect(typeof dto.billingAddress).toBe('object');
      expect(dto.paidAt instanceof Date).toBe(true);
      expect(dto.shippedAt instanceof Date).toBe(true);
      expect(dto.deliveredAt instanceof Date).toBe(true);
      expect(dto.createdAt instanceof Date).toBe(true);
      expect(dto.updatedAt instanceof Date).toBe(true);
    });

    it('should handle UUID format for id', () => {
      const dto = new OrderResponseDto(mockOrderResponseData);

      expect(dto.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should handle UUID format for userId', () => {
      const dto = new OrderResponseDto(mockOrderResponseData);

      expect(dto.userId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should handle status enum', () => {
      const dto = new OrderResponseDto(mockOrderResponseData);

      expect(dto.status).toBe('PENDING');
      expect(['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED', 'REFUNDED']).toContain(dto.status);
    });
  });

  describe('date handling', () => {
    it('should handle Date objects correctly', () => {
      const testDate = new Date('2024-12-25T15:30:00.000Z');
      const orderWithDates = {
        ...mockOrderResponseData,
        paidAt: testDate,
        shippedAt: testDate,
        deliveredAt: testDate,
        createdAt: testDate,
        updatedAt: testDate,
      };

      const dto = new OrderResponseDto(orderWithDates);

      expect(dto.paidAt).toBe(testDate);
      expect(dto.shippedAt).toBe(testDate);
      expect(dto.deliveredAt).toBe(testDate);
      expect(dto.createdAt).toBe(testDate);
      expect(dto.updatedAt).toBe(testDate);
      expect(dto.paidAt instanceof Date).toBe(true);
      expect(dto.shippedAt instanceof Date).toBe(true);
      expect(dto.deliveredAt instanceof Date).toBe(true);
      expect(dto.createdAt instanceof Date).toBe(true);
      expect(dto.updatedAt instanceof Date).toBe(true);
    });

    it('should handle null dates', () => {
      const orderWithNullDates = {
        ...mockOrderResponseData,
        paidAt: null,
        shippedAt: null,
        deliveredAt: null,
      };

      const dto = new OrderResponseDto(orderWithNullDates);

      expect(dto.paidAt).toBeNull();
      expect(dto.shippedAt).toBeNull();
      expect(dto.deliveredAt).toBeNull();
    });

    it('should handle undefined dates', () => {
      const orderWithUndefinedDates = {
        ...mockOrderResponseData,
        paidAt: undefined,
        shippedAt: undefined,
        deliveredAt: undefined,
      };

      const dto = new OrderResponseDto(orderWithUndefinedDates);

      expect(dto.paidAt).toBeUndefined();
      expect(dto.shippedAt).toBeUndefined();
      expect(dto.deliveredAt).toBeUndefined();
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

      const orderWithComplexAddresses = {
        ...mockOrderResponseData,
        shippingAddress: complexShippingAddress,
        billingAddress: complexBillingAddress,
      };

      const dto = new OrderResponseDto(orderWithComplexAddresses);

      expect(dto.shippingAddress).toEqual(complexShippingAddress);
      expect(dto.billingAddress).toEqual(complexBillingAddress);
      expect(typeof dto.shippingAddress).toBe('object');
      expect(typeof dto.billingAddress).toBe('object');
    });

    it('should handle empty address objects', () => {
      const orderWithEmptyAddresses = {
        ...mockOrderResponseData,
        shippingAddress: {},
        billingAddress: {},
      };

      const dto = new OrderResponseDto(orderWithEmptyAddresses);

      expect(dto.shippingAddress).toEqual({});
      expect(dto.billingAddress).toEqual({});
    });

    it('should handle null addresses', () => {
      const orderWithNullAddresses = {
        ...mockOrderResponseData,
        shippingAddress: null,
        billingAddress: null,
      };

      const dto = new OrderResponseDto(orderWithNullAddresses as any);

      expect(dto.shippingAddress).toBeNull();
      expect(dto.billingAddress).toBeNull();
    });
  });

  describe('user relationship', () => {
    it('should handle user object correctly', () => {
      const testUser = {
        id: 'user-123',
        email: 'user@example.com',
        name: 'Test User',
        role: UserRole.CUSTOMER,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const orderWithUser = {
        ...mockOrderResponseData,
        user: testUser,
      };

      const dto = new OrderResponseDto(orderWithUser);

      expect(dto.user!).toBeInstanceOf(UserResponseDto);
      expect(dto.user!.id).toBe(testUser.id);
      expect(dto.user!.email).toBe(testUser.email);
      expect(dto.user!.name).toBe(testUser.name);
    });

    it('should handle null user', () => {
      const orderWithNullUser = {
        ...mockOrderResponseData,
        user: null,
      };

      const dto = new OrderResponseDto(orderWithNullUser as any);

      expect(dto.user).toBeNull();
    });

    it('should handle undefined user', () => {
      const orderWithUndefinedUser = {
        ...mockOrderResponseData,
        user: undefined,
      };

      const dto = new OrderResponseDto(orderWithUndefinedUser);

      expect(dto.user).toBeUndefined();
    });
  });

  describe('items handling', () => {
    it('should handle items array correctly', () => {
      const testItems = [
        new OrderDetailResponseDto({
          id: 'item-1',
          productId: 'product-1',
          unitPrice: 25.00,
          quantity: 2,
          subtotal: 50.00,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
        new OrderDetailResponseDto({
          id: 'item-2',
          productId: 'product-2',
          unitPrice: 75.00,
          quantity: 1,
          subtotal: 75.00,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ];

      const orderWithItems = {
        ...mockOrderResponseData,
        items: testItems,
      };

      const dto = new OrderResponseDto(orderWithItems);

      expect(dto.items).toHaveLength(2);
      expect(dto.items?.[0]).toBeInstanceOf(OrderDetailResponseDto);
      expect(dto.items?.[1]).toBeInstanceOf(OrderDetailResponseDto);
      expect(dto.items?.[0].productId).toBe('product-1');
      expect(dto.items?.[1].productId).toBe('product-2');
    });

    it('should handle empty items array', () => {
      const orderWithEmptyItems = {
        ...mockOrderResponseData,
        items: [],
      };

      const dto = new OrderResponseDto(orderWithEmptyItems);

      expect(dto.items).toHaveLength(0);
      expect(Array.isArray(dto.items)).toBe(true);
    });

    it('should handle null items', () => {
      const orderWithNullItems = {
        ...mockOrderResponseData,
        items: null,
      };

      const dto = new OrderResponseDto(orderWithNullItems as any);

      expect(dto.items).toBeNull();
    });

    it('should handle undefined items', () => {
      const orderWithUndefinedItems = {
        ...mockOrderResponseData,
        items: undefined,
      };

      const dto = new OrderResponseDto(orderWithUndefinedItems);

      expect(dto.items).toBeUndefined();
    });
  });

  describe('serialization', () => {
    it('should be serializable to JSON', () => {
      const dto = new OrderResponseDto(mockOrderResponseData);
      const jsonString = JSON.stringify(dto);
      const parsed = JSON.parse(jsonString);

      expect(parsed.id).toBe(mockOrderResponseData.id);
      expect(parsed.userId).toBe(mockOrderResponseData.userId);
      expect(parsed.total).toBe(mockOrderResponseData.total);
      expect(parsed.status).toBe(mockOrderResponseData.status);
      expect(parsed.paidAt).toBe(mockOrderResponseData.paidAt?.toISOString());
      expect(parsed.shippedAt).toBe(mockOrderResponseData.shippedAt?.toISOString());
      expect(parsed.deliveredAt).toBe(mockOrderResponseData.deliveredAt?.toISOString());
      expect(parsed.createdAt).toBe(mockOrderResponseData.createdAt.toISOString());
      expect(parsed.updatedAt).toBe(mockOrderResponseData.updatedAt.toISOString());
    });

    it('should serialize partial data correctly', () => {
      const partialDto = new OrderResponseDto({
        id: 'test-id',
        total: 50,
      });

      const jsonString = JSON.stringify(partialDto);
      const parsed = JSON.parse(jsonString);

      expect(parsed.id).toBe('test-id');
      expect(parsed.total).toBe(50);
      expect(parsed.userId).toBeUndefined();
      expect(parsed.status).toBeUndefined();
    });

    it('should handle null values in serialization', () => {
      const dtoWithNulls = new OrderResponseDto({
        id: 'test-id',
        paidAt: null,
        shippedAt: null,
        deliveredAt: null,
        user: null,
        items: null,
      } as any);

      const jsonString = JSON.stringify(dtoWithNulls);
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
      const orderWithLongStrings = {
        ...mockOrderResponseData,
        notes: longString,
      };

      const dto = new OrderResponseDto(orderWithLongStrings);

      expect(dto.notes).toBe(longString);
      expect(typeof dto.notes).toBe('string');
    });

    it('should handle special characters in strings', () => {
      const specialChars = 'Order with émojis 🎉 and special chars: @#$%^&*()';
      const orderWithSpecialChars = {
        ...mockOrderResponseData,
        notes: specialChars,
      };

      const dto = new OrderResponseDto(orderWithSpecialChars);

      expect(dto.notes).toBe(specialChars);
      expect(typeof dto.notes).toBe('string');
    });

    it('should handle zero total', () => {
      const orderWithZeroTotal = {
        ...mockOrderResponseData,
        total: 0,
      };

      const dto = new OrderResponseDto(orderWithZeroTotal);

      expect(dto.total).toBe(0);
      expect(typeof dto.total).toBe('number');
    });

    it('should handle negative total', () => {
      const orderWithNegativeTotal = {
        ...mockOrderResponseData,
        total: -50,
      };

      const dto = new OrderResponseDto(orderWithNegativeTotal);

      expect(dto.total).toBe(-50);
      expect(typeof dto.total).toBe('number');
    });

    it('should handle decimal total', () => {
      const orderWithDecimalTotal = {
        ...mockOrderResponseData,
        total: 99.999,
      };

      const dto = new OrderResponseDto(orderWithDecimalTotal);

      expect(dto.total).toBe(99.999);
      expect(typeof dto.total).toBe('number');
    });
  });

  describe('Object.assign behavior', () => {
    it('should merge properties correctly using Object.assign', () => {
      const dto = new OrderResponseDto({});
      Object.assign(dto, mockOrderResponseData);

      expect(dto.id).toBe(mockOrderResponseData.id);
      expect(dto.userId).toBe(mockOrderResponseData.userId);
      expect(dto.total).toBe(mockOrderResponseData.total);
    });

    it('should overwrite existing properties with Object.assign', () => {
      const dto = new OrderResponseDto(mockOrderResponseData);
      const newData = {
        status: 'COMPLETED',
        notes: 'Updated notes',
      };

      Object.assign(dto, newData);

      expect(dto.id).toBe(mockOrderResponseData.id); // Should remain unchanged
      expect(dto.status).toBe('COMPLETED'); // Should be updated
      expect(dto.notes).toBe('Updated notes'); // Should be updated
    });
  });
});
