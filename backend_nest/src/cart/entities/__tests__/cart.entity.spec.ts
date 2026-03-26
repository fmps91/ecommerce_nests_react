import { CartEntity } from '../cart.entity';
import { CartItemEntity } from '../cart-item.entity';
import { Cart } from '../../models/cart.model';
import { CartItem } from '../../models/cart-item.model';

describe('CartEntity', () => {
  const mockCartData = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    user_id: '123e4567-e89b-12d3-a456-426614174001',
    total: 150.75,
    status: 'active' as const,
    created_at: new Date('2024-01-15T10:30:00.000Z'),
    updated_at: new Date('2024-01-15T10:30:00.000Z'),
    deleted_at: undefined,
    items: [],
  };

  const mockItems = [
    new CartItemEntity({
      id: 'item-1',
      cart_id: 'test-cart-id',
      product_id: 'product-1',
      quantity: 2,
      unit_price: 50.25,
      subtotal: 100.50,
      created_at: new Date(),
      updated_at: new Date(),
    }),
    new CartItemEntity({
      id: 'item-2',
      cart_id: 'test-cart-id',
      product_id: 'product-2',
      quantity: 1,
      unit_price: 50.25,
      subtotal: 50.25,
      created_at: new Date(),
      updated_at: new Date(),
    }),
  ];

  describe('constructor', () => {
    it('should create instance with complete data', () => {
      const entity = new CartEntity(mockCartData);

      expect(entity.id).toBe(mockCartData.id);
      expect(entity.user_id).toBe(mockCartData.user_id);
      expect(entity.total).toBe(mockCartData.total);
      expect(entity.status).toBe(mockCartData.status);
      expect(entity.created_at).toBe(mockCartData.created_at);
      expect(entity.updated_at).toBe(mockCartData.updated_at);
      expect(entity.deleted_at).toBe(mockCartData.deleted_at);
    });

    it('should create instance with partial data', () => {
      const partialData = {
        id: 'test-id',
        total: 50,
      };

      const entity = new CartEntity(partialData);

      expect(entity.id).toBe('test-id');
      expect(entity.total).toBe(50);
      expect(entity.user_id).toBeUndefined();
      expect(entity.status).toBeUndefined();
    });

    it('should handle empty constructor', () => {
      const entity = new CartEntity({});

      expect(entity.id).toBeUndefined();
      expect(entity.user_id).toBeUndefined();
      expect(entity.total).toBeUndefined();
      expect(entity.status).toBeUndefined();
    });
  });

  describe('field types', () => {
    it('should handle correct field types', () => {
      const entity = new CartEntity(mockCartData);

      expect(typeof entity.id).toBe('string');
      expect(typeof entity.user_id).toBe('string');
      expect(typeof entity.total).toBe('number');
      expect(typeof entity.status).toBe('string');
      expect(entity.created_at instanceof Date).toBe(true);
      expect(entity.updated_at instanceof Date).toBe(true);
    });

    it('should handle UUID format for id', () => {
      const entity = new CartEntity(mockCartData);

      expect(entity.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should handle UUID format for user_id', () => {
      const entity = new CartEntity(mockCartData);

      expect(entity.user_id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should handle status enum values', () => {
      const activeEntity = new CartEntity({ ...mockCartData, status: 'active' });
      const abandonedEntity = new CartEntity({ ...mockCartData, status: 'abandoned' });
      const completedEntity = new CartEntity({ ...mockCartData, status: 'completed' });

      expect(['active', 'abandoned', 'completed']).toContain(activeEntity.status);
      expect(['active', 'abandoned', 'completed']).toContain(abandonedEntity.status);
      expect(['active', 'abandoned', 'completed']).toContain(completedEntity.status);
    });
  });

  describe('date handling', () => {
    it('should handle Date objects correctly', () => {
      const testDate = new Date('2024-12-25T15:30:00.000Z');
      const entityWithDates = {
        ...mockCartData,
        created_at: testDate,
        updated_at: testDate,
        deleted_at: testDate,
      };

      const entity = new CartEntity(entityWithDates);

      expect(entity.created_at).toBe(testDate);
      expect(entity.updated_at).toBe(testDate);
      expect(entity.deleted_at).toBe(testDate);
      expect(entity.created_at instanceof Date).toBe(true);
      expect(entity.updated_at instanceof Date).toBe(true);
      expect(entity.deleted_at instanceof Date).toBe(true);
    });

    it('should handle null dates', () => {
      const entityWithNullDates = {
        ...mockCartData,
        deleted_at: null,
      };

      const entity = new CartEntity(entityWithNullDates as any);

      expect(entity.deleted_at).toBeNull();
    });

    it('should handle undefined dates', () => {
      const entityWithUndefinedDates = {
        ...mockCartData,
        deleted_at: undefined,
      };

      const entity = new CartEntity(entityWithUndefinedDates);

      expect(entity.deleted_at).toBeUndefined();
    });
  });

  describe('items relationship', () => {
    it('should handle items array correctly', () => {
      const entityWithItems = {
        ...mockCartData,
        items: mockItems,
      };

      const entity = new CartEntity(entityWithItems);

      expect(entity.items!).toHaveLength(2);
      expect(entity.items![0]).toBeInstanceOf(CartItemEntity);
      expect(entity.items![0].id).toBe('item-1');
      expect(entity.items![1].id).toBe('item-2');
    });

    it('should handle empty items array', () => {
      const entityWithEmptyItems = {
        ...mockCartData,
        items: [],
      };

      const entity = new CartEntity(entityWithEmptyItems);

      expect(entity.items).toHaveLength(0);
      expect(Array.isArray(entity.items)).toBe(true);
    });

    it('should handle null items', () => {
      const entityWithNullItems = {
        ...mockCartData,
        items: null,
      };

      const entity = new CartEntity(entityWithNullItems as any);

      expect(entity.items).toBeNull();
    });

    it('should handle undefined items', () => {
      const entityWithUndefinedItems = {
        ...mockCartData,
        items: undefined,
      };

      const entity = new CartEntity(entityWithUndefinedItems);

      expect(entity.items).toBeUndefined();
    });
  });

  describe('fromModel static method', () => {
    const mockCartModel = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      user_id: '123e4567-e89b-12d3-a456-426614174001',
      total: 150.75,
      status: 'active' as const,
      created_at: new Date('2024-01-15T10:30:00.000Z'),
      updated_at: new Date('2024-01-15T10:30:00.000Z'),
      deleted_at: undefined,
    } as Cart;

    const mockCartItemModels = [
      {
        id: 'item-1',
        cart_id: 'test-cart-id',
        product_id: 'product-1',
        quantity: 2,
        unit_price: 50.25,
        subtotal: 100.50,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: undefined,
      } as CartItem,
      {
        id: 'item-2',
        cart_id: 'test-cart-id',
        product_id: 'product-2',
        quantity: 1,
        unit_price: 50.25,
        subtotal: 50.25,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: undefined,
      } as CartItem,
    ];

    it('should convert Cart model to CartEntity with items', () => {
      const cartWithItems = {
        ...mockCartModel,
        items: mockCartItemModels,
      } as unknown as Cart;

      const entity = CartEntity.fromModel(cartWithItems);

      expect(entity.id).toBe(cartWithItems.id);
      expect(entity.user_id).toBe(cartWithItems.user_id);
      expect(entity.total).toBe(Number(cartWithItems.total));
      expect(entity.status).toBe(cartWithItems.status);
      expect(entity.created_at).toBe(cartWithItems.created_at);
      expect(entity.updated_at).toBe(cartWithItems.updated_at);
      expect(entity.deleted_at).toBe(cartWithItems.deleted_at);
      expect(entity.items).toHaveLength(2);
      expect(entity.items![0]).toBeInstanceOf(CartItemEntity);
      expect(entity.items![0].id).toBe('item-1');
    });

    it('should convert Cart model to CartEntity without items', () => {
      const entity = CartEntity.fromModel(mockCartModel, false);

      expect(entity.id).toBe(mockCartModel.id);
      expect(entity.user_id).toBe(mockCartModel.user_id);
      expect(entity.total).toBe(Number(mockCartModel.total));
      expect(entity.status).toBe(mockCartModel.status);
      expect(entity.items).toEqual([]);
    });

    it('should convert Cart model to CartEntity with items by default', () => {
      const cartWithItems = {
        ...mockCartModel,
        items: mockCartItemModels,
      } as unknown as Cart;

      const entity = CartEntity.fromModel(cartWithItems);

      expect(entity.items).toHaveLength(2);
    });

    it('should handle null items in model', () => {
      const cartWithNullItems = {
        ...mockCartModel,
        items: null,
      } as unknown as Cart;

      const entity = CartEntity.fromModel(cartWithNullItems);

      expect(entity.items).toEqual([]);
    });

    it('should handle undefined items in model', () => {
      const cartWithUndefinedItems = {
        ...mockCartModel,
        items: undefined,
      } as unknown as Cart;

      const entity = CartEntity.fromModel(cartWithUndefinedItems);

      expect(entity.items).toEqual([]);
    });
  });

  describe('serialization', () => {
    it('should be serializable to JSON', () => {
      const entity = new CartEntity(mockCartData);
      const jsonString = JSON.stringify(entity);
      const parsed = JSON.parse(jsonString);

      expect(parsed.id).toBe(mockCartData.id);
      expect(parsed.user_id).toBe(mockCartData.user_id);
      expect(parsed.total).toBe(mockCartData.total);
      expect(parsed.status).toBe(mockCartData.status);
      expect(parsed.created_at).toBe(mockCartData.created_at.toISOString());
      expect(parsed.updated_at).toBe(mockCartData.updated_at.toISOString());
      expect(parsed.deleted_at).toBe(null);
    });

    it('should serialize partial data correctly', () => {
      const partialEntity = new CartEntity({
        id: 'test-id',
        total: 50,
      });

      const jsonString = JSON.stringify(partialEntity);
      const parsed = JSON.parse(jsonString);

      expect(parsed.id).toBe('test-id');
      expect(parsed.total).toBe(50);
      expect(parsed.user_id).toBeUndefined();
      expect(parsed.status).toBeUndefined();
    });

    it('should handle null values in serialization', () => {
      const entityWithNulls = new CartEntity({
        id: 'test-id',
        deleted_at: null,
        items: null,
      } as any);

      const jsonString = JSON.stringify(entityWithNulls);
      const parsed = JSON.parse(jsonString);

      expect(parsed.id).toBe('test-id');
      expect(parsed.deleted_at).toBe(null);
      expect(parsed.items).toBe(null);
    });
  });

  describe('edge cases', () => {
    it('should handle zero total', () => {
      const entityWithZeroTotal = {
        ...mockCartData,
        total: 0,
      };

      const entity = new CartEntity(entityWithZeroTotal);

      expect(entity.total).toBe(0);
      expect(typeof entity.total).toBe('number');
    });

    it('should handle negative total', () => {
      const entityWithNegativeTotal = {
        ...mockCartData,
        total: -50,
      };

      const entity = new CartEntity(entityWithNegativeTotal);

      expect(entity.total).toBe(-50);
      expect(typeof entity.total).toBe('number');
    });

    it('should handle decimal total', () => {
      const entityWithDecimalTotal = {
        ...mockCartData,
        total: 99.999,
      };

      const entity = new CartEntity(entityWithDecimalTotal);

      expect(entity.total).toBe(99.999);
      expect(typeof entity.total).toBe('number');
    });

    it('should handle very large total', () => {
      const entityWithLargeTotal = {
        ...mockCartData,
        total: 999999.99,
      };

      const entity = new CartEntity(entityWithLargeTotal);

      expect(entity.total).toBe(999999.99);
      expect(typeof entity.total).toBe('number');
    });
  });

  describe('Object.assign behavior', () => {
    it('should merge properties correctly using Object.assign', () => {
      const entity = new CartEntity({});
      Object.assign(entity, mockCartData);

      expect(entity.id).toBe(mockCartData.id);
      expect(entity.user_id).toBe(mockCartData.user_id);
      expect(entity.total).toBe(mockCartData.total);
    });

    it('should overwrite existing properties with Object.assign', () => {
      const entity = new CartEntity(mockCartData);
      const newData = {
        status: 'completed',
        total: 200,
      };

      Object.assign(entity, newData);

      expect(entity.id).toBe(mockCartData.id); // Should remain unchanged
      expect(entity.status).toBe('completed'); // Should be updated
      expect(entity.total).toBe(200); // Should be updated
    });
  });
});
