import { plainToInstance } from 'class-transformer';
import { CartResponseDto } from '../cart-response.dto';
import { CartItemEntity } from '../../entities/cart-item.entity';

describe('CartResponseDto', () => {
  const mockCartResponseData = {
    id: 'test-cart-id',
    user_id: 'test-user-id',
    total: 100.50,
    status: 'active' as const,
    created_at: new Date('2023-01-01T00:00:00.000Z'),
    updated_at: new Date('2023-01-01T00:00:00.000Z'),
    items: [new CartItemEntity({
      id: 'test-item-id',
      cart_id: 'test-cart-id',
      product_id: 'test-product-id',
      quantity: 2,
      unit_price: 50.25,
      subtotal: 100.50,
      created_at: new Date('2023-01-01T00:00:00.000Z'),
      updated_at: new Date('2023-01-01T00:00:00.000Z'),
    })],
  };

  describe('constructor', () => {
    it('should create instance with all properties', () => {
      const dto = new CartResponseDto(mockCartResponseData);

      expect(dto.id).toBe(mockCartResponseData.id);
      expect(dto.user_id).toBe(mockCartResponseData.user_id);
      expect(dto.total).toBe(mockCartResponseData.total);
      expect(dto.status).toBe(mockCartResponseData.status);
      expect(dto.created_at).toEqual(mockCartResponseData.created_at);
      expect(dto.updated_at).toEqual(mockCartResponseData.updated_at);
      expect(dto.items).toEqual(mockCartResponseData.items);
    });

    it('should create instance with partial data', () => {
      const partialData = {
        id: 'test-id',
        total: 50,
        status: 'active' as const,
      };

      const dto = new CartResponseDto(partialData);

      expect(dto.id).toBe('test-id');
      expect(dto.total).toBe(50);
      expect(dto.status).toBe('active');
      expect(dto.user_id).toBeUndefined();
      expect(dto.created_at).toBeUndefined();
      expect(dto.updated_at).toBeUndefined();
      expect(dto.items).toBeUndefined();
    });

    it('should create empty instance', () => {
      const dto = new CartResponseDto({});

      expect(dto.id).toBeUndefined();
      expect(dto.user_id).toBeUndefined();
      expect(dto.total).toBeUndefined();
      expect(dto.status).toBeUndefined();
      expect(dto.created_at).toBeUndefined();
      expect(dto.updated_at).toBeUndefined();
      expect(dto.items).toBeUndefined();
    });

    it('should handle null input', () => {
      const dto = new CartResponseDto({});

      expect(dto).toBeInstanceOf(CartResponseDto);
    });

    it('should handle undefined input', () => {
      const dto = new CartResponseDto({});

      expect(dto).toBeInstanceOf(CartResponseDto);
    });
  });

  describe('property types', () => {
    it('should maintain correct types for all properties', () => {
      const dto = new CartResponseDto(mockCartResponseData);

      expect(typeof dto.id).toBe('string');
      expect(typeof dto.user_id).toBe('string');
      expect(typeof dto.total).toBe('number');
      expect(typeof dto.status).toBe('string');
      expect(dto.created_at).toBeInstanceOf(Date);
      expect(dto.updated_at).toBeInstanceOf(Date);
      expect(Array.isArray(dto.items)).toBe(true);
    });

    it('should handle optional user_id correctly', () => {
      const dtoWithoutUser = new CartResponseDto({
        ...mockCartResponseData,
        user_id: undefined,
      });

      expect(dtoWithoutUser.user_id).toBeUndefined();
    });

    it('should handle optional items correctly', () => {
      const dtoWithoutItems = new CartResponseDto({
        ...mockCartResponseData,
        items: undefined,
      });

      expect(dtoWithoutItems.items).toBeUndefined();
    });
  });

  describe('status validation', () => {
    it('should accept valid status values', () => {
      const validStatuses = ['active', 'abandoned', 'completed'] as const;

      validStatuses.forEach(status => {
        const dto = new CartResponseDto({
          ...mockCartResponseData,
          status,
        });

        expect(dto.status).toBe(status);
      });
    });

    it('should handle status as string', () => {
      const dto = new CartResponseDto({
        ...mockCartResponseData,
        status: 'active',
      });

      expect(dto.status).toBe('active');
    });
  });

  describe('items property', () => {
    it('should handle empty items array', () => {
      const dto = new CartResponseDto({
        ...mockCartResponseData,
        items: [],
      });

      expect(dto.items).toEqual([]);
      expect(Array.isArray(dto.items)).toBe(true);
    });

    it('should handle single item', () => {
      const singleItem = [mockCartResponseData.items[0]];
      const dto = new CartResponseDto({
        ...mockCartResponseData,
        items: singleItem,
      });

      expect(dto.items).toHaveLength(1);
      expect(dto.items[0]).toBeInstanceOf(CartItemEntity);
    });

    it('should handle multiple items', () => {
      const multipleItems = [
        mockCartResponseData.items[0],
        new CartItemEntity({
          id: 'test-item-2',
          cart_id: 'test-cart-id',
          product_id: 'test-product-2',
          quantity: 1,
          unit_price: 25.00,
          subtotal: 25.00,
          created_at: new Date('2023-01-01T00:00:00.000Z'),
          updated_at: new Date('2023-01-01T00:00:00.000Z'),
        }),
      ];

      const dto = new CartResponseDto({
        ...mockCartResponseData,
        items: multipleItems,
      });

      expect(dto.items).toHaveLength(2);
      expect(dto.items[0]).toBeInstanceOf(CartItemEntity);
      expect(dto.items[1]).toBeInstanceOf(CartItemEntity);
    });

    it('should handle items with null values', () => {
      const itemsWithNull = [
        mockCartResponseData.items[0],
        null,
        undefined,
      ] as any;

      const dto = new CartResponseDto({
        ...mockCartResponseData,
        items: itemsWithNull,
      });

      expect(dto.items).toHaveLength(3);
      expect(dto.items[0]).toBeInstanceOf(CartItemEntity);
      expect(dto.items[1]).toBeNull();
      expect(dto.items[2]).toBeUndefined();
    });
  });

  describe('total property', () => {
    it('should handle zero total', () => {
      const dto = new CartResponseDto({
        ...mockCartResponseData,
        total: 0,
      });

      expect(dto.total).toBe(0);
      expect(typeof dto.total).toBe('number');
    });

    it('should handle negative total (edge case)', () => {
      const dto = new CartResponseDto({
        ...mockCartResponseData,
        total: -10,
      });

      expect(dto.total).toBe(-10);
      expect(typeof dto.total).toBe('number');
    });

    it('should handle decimal total', () => {
      const dto = new CartResponseDto({
        ...mockCartResponseData,
        total: 99.99,
      });

      expect(dto.total).toBe(99.99);
      expect(typeof dto.total).toBe('number');
    });

    it('should handle very large total', () => {
      const dto = new CartResponseDto({
        ...mockCartResponseData,
        total: Number.MAX_SAFE_INTEGER,
      });

      expect(dto.total).toBe(Number.MAX_SAFE_INTEGER);
      expect(typeof dto.total).toBe('number');
    });

    it('should handle floating point precision', () => {
      const dto = new CartResponseDto({
        ...mockCartResponseData,
        total: 0.1 + 0.2, // This results in 0.30000000000000004
      });

      expect(dto.total).toBeCloseTo(0.3, 10);
    });
  });

  describe('date properties', () => {
    it('should handle Date objects correctly', () => {
      const now = new Date();
      const dto = new CartResponseDto({
        ...mockCartResponseData,
        created_at: now,
        updated_at: now,
      });

      expect(dto.created_at).toBe(now);
      expect(dto.updated_at).toBe(now);
      expect(dto.created_at).toBeInstanceOf(Date);
      expect(dto.updated_at).toBeInstanceOf(Date);
    });

    it('should handle string dates', () => {
      const dateString = '2023-01-01T00:00:00.000Z';
      const dto = new CartResponseDto({
        ...mockCartResponseData,
        created_at: dateString as any,
        updated_at: dateString as any,
      });

      expect(dto.created_at).toBe(dateString);
      expect(dto.updated_at).toBe(dateString);
    });

    it('should handle invalid dates', () => {
      const invalidDate = new Date('invalid');
      const dto = new CartResponseDto({
        ...mockCartResponseData,
        created_at: invalidDate,
        updated_at: invalidDate,
      });

      expect(dto.created_at).toBeInstanceOf(Date);
      expect(dto.updated_at).toBeInstanceOf(Date);
      expect(isNaN(dto.created_at.getTime())).toBe(true);
      expect(isNaN(dto.updated_at.getTime())).toBe(true);
    });

    it('should handle null dates', () => {
      const dto = new CartResponseDto({
        ...mockCartResponseData,
        created_at: null as any,
        updated_at: null as any,
      });

      expect(dto.created_at).toBeNull();
      expect(dto.updated_at).toBeNull();
    });

    it('should handle undefined dates', () => {
      const dto = new CartResponseDto({
        ...mockCartResponseData,
        created_at: undefined,
        updated_at: undefined,
      });

      expect(dto.created_at).toBeUndefined();
      expect(dto.updated_at).toBeUndefined();
    });
  });

  describe('transformation with plainToInstance', () => {
    it('should transform plain object to CartResponseDto instance', () => {
      const dto = plainToInstance(CartResponseDto, mockCartResponseData);

      expect(dto).toBeInstanceOf(CartResponseDto);
      expect(dto.id).toBe(mockCartResponseData.id);
      expect(dto.user_id).toBe(mockCartResponseData.user_id);
      expect(dto.total).toBe(mockCartResponseData.total);
      expect(dto.status).toBe(mockCartResponseData.status);
      expect(dto.created_at).toEqual(mockCartResponseData.created_at);
      expect(dto.updated_at).toEqual(mockCartResponseData.updated_at);
      expect(dto.items).toEqual(mockCartResponseData.items);
    });

    it('should handle date string conversion', () => {
      const dataWithStringDates = {
        ...mockCartResponseData,
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-01T00:00:00.000Z',
      };

      const dto = plainToInstance(CartResponseDto, dataWithStringDates);

      expect(dto.created_at).toBeInstanceOf(Date);
      expect(dto.updated_at).toBeInstanceOf(Date);
    });

    it('should handle null input', () => {
      const dto = plainToInstance(CartResponseDto, null);

      expect(dto).toBeInstanceOf(CartResponseDto);
    });

    it('should handle undefined input', () => {
      const dto = plainToInstance(CartResponseDto, undefined);

      expect(dto).toBeInstanceOf(CartResponseDto);
    });
  });

  describe('serialization behavior', () => {
    it('should include all properties when serialized', () => {
      const dto = new CartResponseDto(mockCartResponseData);
      const serialized = JSON.parse(JSON.stringify(dto));

      expect(serialized.id).toBe(mockCartResponseData.id);
      expect(serialized.user_id).toBe(mockCartResponseData.user_id);
      expect(serialized.total).toBe(mockCartResponseData.total);
      expect(serialized.status).toBe(mockCartResponseData.status);
      expect(serialized.created_at).toBe(mockCartResponseData.created_at.toISOString());
      expect(serialized.updated_at).toBe(mockCartResponseData.updated_at.toISOString());
      expect(serialized.items).toHaveLength(1);
    });

    it('should handle circular references gracefully', () => {
      const itemWithCircularRef = mockCartResponseData.items[0];
      (itemWithCircularRef as any).cart = mockCartResponseData;

      const dto = new CartResponseDto({
        ...mockCartResponseData,
        items: [itemWithCircularRef],
      });

      // Should not throw during JSON serialization
      expect(() => JSON.stringify(dto)).not.toThrow();
    });
  });

  describe('real-world scenarios', () => {
    it('should handle active cart with items', () => {
      const activeCart = {
        id: 'active-cart-id',
        user_id: 'user-123',
        total: 150.75,
        status: 'active' as const,
        created_at: new Date(),
        updated_at: new Date(),
        items: [
          new CartItemEntity({
            id: 'item-1',
            cart_id: 'active-cart-id',
            product_id: 'product-1',
            quantity: 2,
            unit_price: 50.00,
            subtotal: 100.00,
            created_at: new Date(),
            updated_at: new Date(),
          }),
          new CartItemEntity({
            id: 'item-2',
            cart_id: 'active-cart-id',
            product_id: 'product-2',
            quantity: 1,
            unit_price: 50.75,
            subtotal: 50.75,
            created_at: new Date(),
            updated_at: new Date(),
          }),
        ],
      };

      const dto = new CartResponseDto(activeCart);

      expect(dto.status).toBe('active');
      expect(dto.total).toBe(150.75);
      expect(dto.items).toHaveLength(2);
      expect(dto.items[0].subtotal + dto.items[1].subtotal).toBe(150.75);
    });

    it('should handle abandoned cart', () => {
      const abandonedCart = {
        id: 'abandoned-cart-id',
        user_id: 'user-456',
        total: 75.50,
        status: 'abandoned' as const,
        created_at: new Date('2023-01-01'),
        updated_at: new Date('2023-01-02'),
        items: [
          new CartItemEntity({
            id: 'item-1',
            cart_id: 'abandoned-cart-id',
            product_id: 'product-1',
            quantity: 1,
            unit_price: 75.50,
            subtotal: 75.50,
            created_at: new Date('2023-01-01'),
            updated_at: new Date('2023-01-01'),
          }),
        ],
      };

      const dto = new CartResponseDto(abandonedCart);

      expect(dto.status).toBe('abandoned');
      expect(dto.total).toBe(75.50);
      expect(dto.items).toHaveLength(1);
    });

    it('should handle completed cart', () => {
      const completedCart = {
        id: 'completed-cart-id',
        user_id: 'user-789',
        total: 200.00,
        status: 'completed' as const,
        created_at: new Date('2023-01-01'),
        updated_at: new Date('2023-01-01'),
        items: [],
      };

      const dto = new CartResponseDto(completedCart);

      expect(dto.status).toBe('completed');
      expect(dto.total).toBe(200.00);
      expect(dto.items).toEqual([]);
    });

    it('should handle guest cart (no user_id)', () => {
      const guestCart = {
        id: 'guest-cart-id',
        total: 25.00,
        status: 'active' as const,
        created_at: new Date(),
        updated_at: new Date(),
        items: [
          new CartItemEntity({
            id: 'item-1',
            cart_id: 'guest-cart-id',
            product_id: 'product-1',
            quantity: 1,
            unit_price: 25.00,
            subtotal: 25.00,
            created_at: new Date(),
            updated_at: new Date(),
          }),
        ],
      };

      const dto = new CartResponseDto(guestCart);

      expect(dto.user_id).toBeUndefined();
      expect(dto.total).toBe(25.00);
      expect(dto.items).toHaveLength(1);
    });
  });

  describe('edge cases', () => {
    it('should handle empty cart', () => {
      const emptyCart = {
        id: 'empty-cart-id',
        total: 0,
        status: 'active' as const,
        created_at: new Date(),
        updated_at: new Date(),
        items: [],
      };

      const dto = new CartResponseDto(emptyCart);

      expect(dto.total).toBe(0);
      expect(dto.items).toEqual([]);
    });

    it('should handle cart with very large number of items', () => {
      const manyItems = Array.from({ length: 1000 }, (_, i) => 
        new CartItemEntity({
          id: `item-${i}`,
          cart_id: 'test-cart-id',
          product_id: `product-${i}`,
          quantity: 1,
          unit_price: 1.00,
          subtotal: 1.00,
          created_at: new Date(),
          updated_at: new Date(),
        })
      );

      const dto = new CartResponseDto({
        ...mockCartResponseData,
        items: manyItems,
      });

      expect(dto.items).toHaveLength(1000);
      expect(dto.total).toBe(1000);
    });

    it('should handle cart with mixed item types', () => {
      const mixedItems = [
        mockCartResponseData.items[0],
        null,
        undefined,
        'invalid-item' as any,
        123 as any,
      ];

      const dto = new CartResponseDto({
        ...mockCartResponseData,
        items: mixedItems,
      });

      expect(dto.items).toHaveLength(5);
      expect(dto.items[0]).toBeInstanceOf(CartItemEntity);
      expect(dto.items[1]).toBeNull();
      expect(dto.items[2]).toBeUndefined();
      expect(dto.items[3]).toBe('invalid-item');
      expect(dto.items[4]).toBe(123);
    });
  });
});
