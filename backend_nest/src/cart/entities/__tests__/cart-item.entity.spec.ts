import { CartItemEntity } from '../cart-item.entity';
import { CartItem } from '../../models/cart-item.model';

describe('CartItemEntity', () => {
  const mockCartItemData = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    cart_id: '123e4567-e89b-12d3-a456-426614174001',
    product_id: '123e4567-e89b-12d3-a456-426614174002',
    quantity: 3,
    unit_price: 25.50,
    subtotal: 76.50,
    created_at: new Date('2024-01-15T10:30:00.000Z'),
    updated_at: new Date('2024-01-15T10:30:00.000Z'),
    deleted_at: undefined,
    product: {
      id: 'product-123',
      nombre: 'Test Product',
      precio: 25.50,
      imagen: 'test-image.jpg',
    },
  };

  describe('constructor', () => {
    it('should create instance with complete data', () => {
      const entity = new CartItemEntity(mockCartItemData);

      expect(entity.id).toBe(mockCartItemData.id);
      expect(entity.cart_id).toBe(mockCartItemData.cart_id);
      expect(entity.product_id).toBe(mockCartItemData.product_id);
      expect(entity.quantity).toBe(mockCartItemData.quantity);
      expect(entity.unit_price).toBe(mockCartItemData.unit_price);
      expect(entity.subtotal).toBe(mockCartItemData.subtotal);
      expect(entity.created_at).toBe(mockCartItemData.created_at);
      expect(entity.updated_at).toBe(mockCartItemData.updated_at);
      expect(entity.deleted_at).toBe(mockCartItemData.deleted_at);
      expect(entity.product).toEqual(mockCartItemData.product);
    });

    it('should create instance with partial data', () => {
      const partialData = {
        id: 'test-id',
        cart_id: 'test-cart-id',
        quantity: 1,
      };

      const entity = new CartItemEntity(partialData);

      expect(entity.id).toBe('test-id');
      expect(entity.cart_id).toBe('test-cart-id');
      expect(entity.quantity).toBe(1);
      expect(entity.product_id).toBeUndefined();
      expect(entity.unit_price).toBeUndefined();
    });

    it('should handle empty constructor', () => {
      const entity = new CartItemEntity({});

      expect(entity.id).toBeUndefined();
      expect(entity.cart_id).toBeUndefined();
      expect(entity.product_id).toBeUndefined();
      expect(entity.quantity).toBeUndefined();
    });
  });

  describe('field types', () => {
    it('should handle correct field types', () => {
      const entity = new CartItemEntity(mockCartItemData);

      expect(typeof entity.id).toBe('string');
      expect(typeof entity.cart_id).toBe('string');
      expect(typeof entity.product_id).toBe('string');
      expect(typeof entity.quantity).toBe('number');
      expect(typeof entity.unit_price).toBe('number');
      expect(typeof entity.subtotal).toBe('number');
      expect(entity.created_at instanceof Date).toBe(true);
      expect(entity.updated_at instanceof Date).toBe(true);
    });

    it('should handle UUID format for id', () => {
      const entity = new CartItemEntity(mockCartItemData);

      expect(entity.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should handle UUID format for cart_id', () => {
      const entity = new CartItemEntity(mockCartItemData);

      expect(entity.cart_id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should handle UUID format for product_id', () => {
      const entity = new CartItemEntity(mockCartItemData);

      expect(entity.product_id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should handle integer quantity', () => {
      const entity = new CartItemEntity(mockCartItemData);

      expect(Number.isInteger(entity.quantity)).toBe(true);
      expect(entity.quantity).toBeGreaterThan(0);
    });

    it('should handle decimal prices', () => {
      const entity = new CartItemEntity(mockCartItemData);

      expect(entity.unit_price).toBe(25.50);
      expect(entity.subtotal).toBe(76.50);
      expect(typeof entity.unit_price).toBe('number');
      expect(typeof entity.subtotal).toBe('number');
    });
  });

  describe('date handling', () => {
    it('should handle Date objects correctly', () => {
      const testDate = new Date('2024-12-25T15:30:00.000Z');
      const entityWithDates = {
        ...mockCartItemData,
        created_at: testDate,
        updated_at: testDate,
        deleted_at: testDate,
      };

      const entity = new CartItemEntity(entityWithDates);

      expect(entity.created_at).toBe(testDate);
      expect(entity.updated_at).toBe(testDate);
      expect(entity.deleted_at).toBe(testDate);
      expect(entity.created_at instanceof Date).toBe(true);
      expect(entity.updated_at instanceof Date).toBe(true);
      expect(entity.deleted_at instanceof Date).toBe(true);
    });

    it('should handle null dates', () => {
      const entityWithNullDates = {
        ...mockCartItemData,
        deleted_at: null,
      };

      const entity = new CartItemEntity(entityWithNullDates as any);

      expect(entity.deleted_at).toBeNull();
    });

    it('should handle undefined dates', () => {
      const entityWithUndefinedDates = {
        ...mockCartItemData,
        deleted_at: undefined,
      };

      const entity = new CartItemEntity(entityWithUndefinedDates);

      expect(entity.deleted_at).toBeUndefined();
    });
  });

  describe('product relationship', () => {
    it('should handle product object correctly', () => {
      const entity = new CartItemEntity(mockCartItemData);

      expect(entity.product).toBeDefined();
      expect(entity.product!.id).toBe('product-123');
      expect(entity.product!.nombre).toBe('Test Product');
      expect(entity.product!.precio).toBe(25.50);
      expect(entity.product!.imagen).toBe('test-image.jpg');
    });

    it('should handle null product', () => {
      const entityWithNullProduct = {
        ...mockCartItemData,
        product: null,
      };

      const entity = new CartItemEntity(entityWithNullProduct as any);

      expect(entity.product).toBeNull();
    });

    it('should handle undefined product', () => {
      const entityWithUndefinedProduct = {
        ...mockCartItemData,
        product: undefined,
      };

      const entity = new CartItemEntity(entityWithUndefinedProduct);

      expect(entity.product).toBeUndefined();
    });

    it('should handle product with missing optional fields', () => {
      const productWithMissingFields = {
        id: 'product-456',
        nombre: 'Minimal Product',
        precio: 10.00,
      };

      const entityWithMinimalProduct = {
        ...mockCartItemData,
        product: productWithMissingFields,
      };

      const entity = new CartItemEntity(entityWithMinimalProduct);

      expect(entity.product!.id).toBe('product-456');
      expect(entity.product!.nombre).toBe('Minimal Product');
      expect(entity.product!.precio).toBe(10.00);
      expect(entity.product!.imagen).toBeUndefined();
    });
  });

  describe('fromModel static method', () => {
    const mockCartItemModel = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      cart_id: '123e4567-e89b-12d3-a456-426614174001',
      product_id: '123e4567-e89b-12d3-a456-426614174002',
      quantity: 3,
      unit_price: 25.50,
      subtotal: 76.50,
      created_at: new Date('2024-01-15T10:30:00.000Z'),
      updated_at: new Date('2024-01-15T10:30:00.000Z'),
      deleted_at: undefined,
    } as CartItem;

    it('should convert CartItem model to CartItemEntity without product', () => {
      const entity = CartItemEntity.fromModel(mockCartItemModel);

      expect(entity.id).toBe(mockCartItemModel.id);
      expect(entity.cart_id).toBe(mockCartItemModel.cart_id);
      expect(entity.product_id).toBe(mockCartItemModel.product_id);
      expect(entity.quantity).toBe(mockCartItemModel.quantity);
      expect(entity.unit_price).toBe(Number(mockCartItemModel.unit_price));
      expect(entity.subtotal).toBe(Number(mockCartItemModel.subtotal));
      expect(entity.created_at).toBe(mockCartItemModel.created_at);
      expect(entity.updated_at).toBe(mockCartItemModel.updated_at);
      expect(entity.deleted_at).toBe(mockCartItemModel.deleted_at);
      expect(entity.product).toBeUndefined();
    });

    it('should convert CartItem model to CartItemEntity with product', () => {
      const cartItemWithProduct = {
        ...mockCartItemModel,
        product: {
          id: 'product-123',
          nombre: 'Test Product',
          precio: 25.50,
          imagen: 'test-image.jpg',
        },
      } as any;

      const entity = CartItemEntity.fromModel(cartItemWithProduct);

      expect(entity.product).toBeDefined();
      expect(entity.product!.id).toBe('product-123');
      expect(entity.product!.nombre).toBe('Test Product');
      expect(entity.product!.precio).toBe(25.50);
      expect(entity.product!.imagen).toBe('test-image.jpg');
    });

    it('should handle null product in model', () => {
      const cartItemWithNullProduct = {
        ...mockCartItemModel,
        product: null,
      } as any;

      const entity = CartItemEntity.fromModel(cartItemWithNullProduct);

      expect(entity.product).toBeUndefined();
    });

    it('should handle undefined product in model', () => {
      const cartItemWithUndefinedProduct = {
        ...mockCartItemModel,
        product: undefined,
      } as any;

      const entity = CartItemEntity.fromModel(cartItemWithUndefinedProduct);

      expect(entity.product).toBeUndefined();
    });

    it('should convert decimal numbers correctly', () => {
      const cartItemWithDecimals = {
        ...mockCartItemModel,
        unit_price: '99.99' as any,
        subtotal: '199.98' as any,
      } as unknown as CartItem;

      const entity = CartItemEntity.fromModel(cartItemWithDecimals);

      expect(entity.unit_price).toBe(99.99);
      expect(entity.subtotal).toBe(199.98);
      expect(typeof entity.unit_price).toBe('number');
      expect(typeof entity.subtotal).toBe('number');
    });
  });

  describe('serialization', () => {
    it('should be serializable to JSON', () => {
      const entity = new CartItemEntity(mockCartItemData);
      const jsonString = JSON.stringify(entity);
      const parsed = JSON.parse(jsonString);

      expect(parsed.id).toBe(mockCartItemData.id);
      expect(parsed.cart_id).toBe(mockCartItemData.cart_id);
      expect(parsed.product_id).toBe(mockCartItemData.product_id);
      expect(parsed.quantity).toBe(mockCartItemData.quantity);
      expect(parsed.unit_price).toBe(mockCartItemData.unit_price);
      expect(parsed.subtotal).toBe(mockCartItemData.subtotal);
      expect(parsed.created_at).toBe(mockCartItemData.created_at.toISOString());
      expect(parsed.updated_at).toBe(mockCartItemData.updated_at.toISOString());
      expect(parsed.deleted_at).toBe(null);
      expect(parsed.product).toEqual(mockCartItemData.product);
    });

    it('should serialize partial data correctly', () => {
      const partialEntity = new CartItemEntity({
        id: 'test-id',
        cart_id: 'test-cart-id',
        quantity: 1,
      });

      const jsonString = JSON.stringify(partialEntity);
      const parsed = JSON.parse(jsonString);

      expect(parsed.id).toBe('test-id');
      expect(parsed.cart_id).toBe('test-cart-id');
      expect(parsed.quantity).toBe(1);
      expect(parsed.product_id).toBeUndefined();
      expect(parsed.unit_price).toBeUndefined();
    });

    it('should handle null values in serialization', () => {
      const entityWithNulls = new CartItemEntity({
        id: 'test-id',
        deleted_at: null,
        product: null,
      } as any);

      const jsonString = JSON.stringify(entityWithNulls);
      const parsed = JSON.parse(jsonString);

      expect(parsed.id).toBe('test-id');
      expect(parsed.deleted_at).toBe(null);
      expect(parsed.product).toBe(null);
    });
  });

  describe('edge cases', () => {
    it('should handle zero quantity', () => {
      const entityWithZeroQuantity = {
        ...mockCartItemData,
        quantity: 0,
      };

      const entity = new CartItemEntity(entityWithZeroQuantity);

      expect(entity.quantity).toBe(0);
      expect(typeof entity.quantity).toBe('number');
    });

    it('should handle negative quantity', () => {
      const entityWithNegativeQuantity = {
        ...mockCartItemData,
        quantity: -1,
      };

      const entity = new CartItemEntity(entityWithNegativeQuantity);

      expect(entity.quantity).toBe(-1);
      expect(typeof entity.quantity).toBe('number');
    });

    it('should handle very large quantity', () => {
      const entityWithLargeQuantity = {
        ...mockCartItemData,
        quantity: 999999,
      };

      const entity = new CartItemEntity(entityWithLargeQuantity);

      expect(entity.quantity).toBe(999999);
      expect(typeof entity.quantity).toBe('number');
    });

    it('should handle zero prices', () => {
      const entityWithZeroPrices = {
        ...mockCartItemData,
        unit_price: 0,
        subtotal: 0,
      };

      const entity = new CartItemEntity(entityWithZeroPrices);

      expect(entity.unit_price).toBe(0);
      expect(entity.subtotal).toBe(0);
      expect(typeof entity.unit_price).toBe('number');
      expect(typeof entity.subtotal).toBe('number');
    });

    it('should handle negative prices', () => {
      const entityWithNegativePrices = {
        ...mockCartItemData,
        unit_price: -10.50,
        subtotal: -31.50,
      };

      const entity = new CartItemEntity(entityWithNegativePrices);

      expect(entity.unit_price).toBe(-10.50);
      expect(entity.subtotal).toBe(-31.50);
      expect(typeof entity.unit_price).toBe('number');
      expect(typeof entity.subtotal).toBe('number');
    });

    it('should handle very small decimal prices', () => {
      const entityWithSmallDecimals = {
        ...mockCartItemData,
        unit_price: 0.01,
        subtotal: 0.03,
      };

      const entity = new CartItemEntity(entityWithSmallDecimals);

      expect(entity.unit_price).toBe(0.01);
      expect(entity.subtotal).toBe(0.03);
      expect(typeof entity.unit_price).toBe('number');
      expect(typeof entity.subtotal).toBe('number');
    });
  });

  describe('Object.assign behavior', () => {
    it('should merge properties correctly using Object.assign', () => {
      const entity = new CartItemEntity({});
      Object.assign(entity, mockCartItemData);

      expect(entity.id).toBe(mockCartItemData.id);
      expect(entity.cart_id).toBe(mockCartItemData.cart_id);
      expect(entity.quantity).toBe(mockCartItemData.quantity);
    });

    it('should overwrite existing properties with Object.assign', () => {
      const entity = new CartItemEntity(mockCartItemData);
      const newData = {
        quantity: 5,
        unit_price: 30.00,
        subtotal: 150.00,
      };

      Object.assign(entity, newData);

      expect(entity.id).toBe(mockCartItemData.id); // Should remain unchanged
      expect(entity.quantity).toBe(5); // Should be updated
      expect(entity.unit_price).toBe(30.00); // Should be updated
      expect(entity.subtotal).toBe(150.00); // Should be updated
    });
  });
});
