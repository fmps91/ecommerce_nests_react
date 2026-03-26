import { OrderDetailEntity } from '../order-detail.entity';
import { OrderEntity } from '../order.entity';
import { ProductEntity } from '../../../products/entities/product.entity';
import { OrderStatus } from '../../models/order.model';

describe('OrderDetailEntity', () => {
  const mockOrderDetailData = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    orderId: '123e4567-e89b-12d3-a456-426614174001',
    productId: '123e4567-e89b-12d3-a456-426614174002',
    unitPrice: 50.25,
    quantity: 2,
    subtotal: 100.50,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: undefined,
  };

  const mockOrder = {
    id: 'test-order-id',
    userId: 'test-user-id',
    status: 'PENDING' as OrderStatus,
    items: [],
    total: 100.50,
    totalPrice: 100.50,
    isPaid: false,
    isShipped: false,
    isDelivered: false,
    formattedTotal: '100,50 €',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockProduct = {
    id: 'test-product-id',
    nombre: 'Test Product',
    precio: 50.25,
    stock: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe('constructor', () => {
    it('should create instance with complete data', () => {
      const entity = new OrderDetailEntity(mockOrderDetailData);

      expect(entity.id).toBe(mockOrderDetailData.id);
      expect(entity.orderId).toBe(mockOrderDetailData.orderId);
      expect(entity.productId).toBe(mockOrderDetailData.productId);
      expect(entity.unitPrice).toBe(mockOrderDetailData.unitPrice);
      expect(entity.quantity).toBe(mockOrderDetailData.quantity);
      expect(entity.subtotal).toBe(mockOrderDetailData.subtotal);
      expect(entity.createdAt).toBe(mockOrderDetailData.createdAt);
      expect(entity.updatedAt).toBe(mockOrderDetailData.updatedAt);
    });

    it('should create instance with partial data', () => {
      const partialData = {
        id: 'test-id',
        productId: 'test-product-id',
        quantity: 1,
      };

      const entity = new OrderDetailEntity(partialData);

      expect(entity.id).toBe('test-id');
      expect(entity.productId).toBe('test-product-id');
      expect(entity.quantity).toBe(1);
    });

    it('should handle empty constructor', () => {
      const entity = new OrderDetailEntity({});

      expect(entity.id).toBeUndefined();
      expect(entity.orderId).toBeUndefined();
      expect(entity.productId).toBeUndefined();
    });
  });

  describe('field types', () => {
    it('should handle correct field types', () => {
      const entity = new OrderDetailEntity(mockOrderDetailData);

      expect(typeof entity.id).toBe('string');
      expect(typeof entity.orderId).toBe('string');
      expect(typeof entity.productId).toBe('string');
      expect(typeof entity.unitPrice).toBe('number');
      expect(typeof entity.quantity).toBe('number');
      expect(typeof entity.subtotal).toBe('number');
      expect(entity.createdAt instanceof Date).toBe(true);
      expect(entity.updatedAt instanceof Date).toBe(true);
    });

    it('should handle UUID format for id', () => {
      const entity = new OrderDetailEntity(mockOrderDetailData);

      expect(entity.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should handle UUID format for orderId', () => {
      const entity = new OrderDetailEntity(mockOrderDetailData);

      expect(entity.orderId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should handle UUID format for productId', () => {
      const entity = new OrderDetailEntity(mockOrderDetailData);

      expect(entity.productId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should handle numeric fields', () => {
      const entity = new OrderDetailEntity(mockOrderDetailData);

      expect(typeof entity.unitPrice).toBe('number');
      expect(typeof entity.quantity).toBe('number');
      expect(typeof entity.subtotal).toBe('number');
      expect(Number.isFinite(entity.unitPrice)).toBe(true);
      expect(Number.isFinite(entity.quantity)).toBe(true);
      expect(Number.isFinite(entity.subtotal)).toBe(true);
    });
  });

  describe('date handling', () => {
    it('should handle Date objects correctly', () => {
      const testDate = new Date('2024-12-25T15:30:00.000Z');
      const entityWithDates = {
        ...mockOrderDetailData,
        createdAt: testDate,
        updatedAt: testDate,
      };

      const entity = new OrderDetailEntity(entityWithDates);

      expect(entity.createdAt).toBe(testDate);
      expect(entity.updatedAt).toBe(testDate);
      expect(entity.createdAt instanceof Date).toBe(true);
      expect(entity.updatedAt instanceof Date).toBe(true);
    });

    it('should handle null dates', () => {
      const entityWithNullDates = {
        ...mockOrderDetailData,
        createdAt: null,
        updatedAt: null,
      };

      const entity = new OrderDetailEntity(entityWithNullDates as any);

      expect(entity.createdAt).toBeNull();
      expect(entity.updatedAt).toBeNull();
    });

    it('should handle undefined dates', () => {
      const entityWithUndefinedDates = {
        ...mockOrderDetailData,
        createdAt: undefined,
        updatedAt: undefined,
      };

      const entity = new OrderDetailEntity(entityWithUndefinedDates);

      expect(entity.createdAt).toBeUndefined();
      expect(entity.updatedAt).toBeUndefined();
    });
  });

  describe('relationship handling', () => {
    it('should handle order relationship', () => {
      const entityWithOrder = {
        ...mockOrderDetailData,
        order: mockOrder,
      };

      const entity = new OrderDetailEntity(entityWithOrder);

      expect(entity.order).toBeInstanceOf(OrderEntity);
      expect(entity.order?.id).toBe(mockOrder.id);
      expect(entity.order?.userId).toBe(mockOrder.userId);
    });

    it('should handle product relationship', () => {
      const entityWithProduct = {
        ...mockOrderDetailData,
        product: mockProduct,
      };

      const entity = new OrderDetailEntity(entityWithProduct);

      expect(entity.product).toBeInstanceOf(ProductEntity);
      expect(entity.product?.id).toBe(mockProduct.id);
      expect(entity.product?.nombre).toBe(mockProduct.nombre);
    });

    it('should handle both relationships', () => {
      const entityWithRelationships = {
        ...mockOrderDetailData,
        order: mockOrder,
        product: mockProduct,
      };

      const entity = new OrderDetailEntity(entityWithRelationships);

      expect(entity.order).toBeInstanceOf(OrderEntity);
      expect(entity.product).toBeInstanceOf(ProductEntity);
      expect(entity.order?.id).toBe(mockOrder.id);
      expect(entity.product?.id).toBe(mockProduct.id);
    });

    it('should handle null relationships', () => {
      const entityWithNullRelationships = {
        ...mockOrderDetailData,
        order: null,
        product: null,
      };

      const entity = new OrderDetailEntity(entityWithNullRelationships as any);

      expect(entity.order).toBeNull();
      expect(entity.product).toBeNull();
    });

    it('should handle undefined relationships', () => {
      const entityWithUndefinedRelationships = {
        ...mockOrderDetailData,
        order: undefined,
        product: undefined,
      };

      const entity = new OrderDetailEntity(entityWithUndefinedRelationships);

      expect(entity.order).toBeUndefined();
      expect(entity.product).toBeUndefined();
    });
  });

  describe('serialization', () => {
    it('should be serializable to JSON', () => {
      const entity = new OrderDetailEntity(mockOrderDetailData);
      const jsonString = JSON.stringify(entity);
      const parsed = JSON.parse(jsonString);

      expect(parsed.id).toBe(mockOrderDetailData.id);
      expect(parsed.orderId).toBe(mockOrderDetailData.orderId);
      expect(parsed.productId).toBe(mockOrderDetailData.productId);
      expect(parsed.unitPrice).toBe(mockOrderDetailData.unitPrice);
      expect(parsed.quantity).toBe(mockOrderDetailData.quantity);
      expect(parsed.subtotal).toBe(mockOrderDetailData.subtotal);
      expect(parsed.createdAt).toBe(mockOrderDetailData.createdAt.toISOString());
      expect(parsed.updatedAt).toBe(mockOrderDetailData.updatedAt.toISOString());
    });

    it('should serialize partial data correctly', () => {
      const partialEntity = new OrderDetailEntity({
        id: 'test-id',
        unitPrice: 50,
      });

      const jsonString = JSON.stringify(partialEntity);
      const parsed = JSON.parse(jsonString);

      expect(parsed.id).toBe('test-id');
      expect(parsed.unitPrice).toBe(50);
      expect(parsed.orderId).toBeUndefined();
      expect(parsed.productId).toBeUndefined();
    });

    it('should handle null values in serialization', () => {
      const entityWithNulls = new OrderDetailEntity({
        id: 'test-id',
        createdAt: null,
        updatedAt: null,
      } as any);

      const jsonString = JSON.stringify(entityWithNulls);
      const parsed = JSON.parse(jsonString);

      expect(parsed.id).toBe('test-id');
      expect(parsed.createdAt).toBe(null);
      expect(parsed.updatedAt).toBe(null);
    });
  });

  describe('edge cases', () => {
    it('should handle very long strings', () => {
      const longString = 'a'.repeat(1000);
      const entityWithLongStrings = {
        ...mockOrderDetailData,
        productId: longString,
      };

      const entity = new OrderDetailEntity(entityWithLongStrings);

      expect(entity.productId).toBe(longString);
      expect(typeof entity.productId).toBe('string');
    });

    it('should handle special characters in strings', () => {
      const specialChars = 'Product with émojis 🎉 and special chars: @#$%^&*()';
      const entityWithSpecialChars = {
        ...mockOrderDetailData,
        productId: specialChars,
      };

      const entity = new OrderDetailEntity(entityWithSpecialChars);

      expect(entity.productId).toBe(specialChars);
      expect(typeof entity.productId).toBe('string');
    });

    it('should handle zero values', () => {
      const entityWithZeroValues = {
        ...mockOrderDetailData,
        unitPrice: 0,
        quantity: 0,
        subtotal: 0,
      };

      const entity = new OrderDetailEntity(entityWithZeroValues);

      expect(entity.unitPrice).toBe(0);
      expect(entity.quantity).toBe(0);
      expect(entity.subtotal).toBe(0);
      expect(typeof entity.unitPrice).toBe('number');
      expect(typeof entity.quantity).toBe('number');
      expect(typeof entity.subtotal).toBe('number');
    });

    it('should handle negative values', () => {
      const entityWithNegativeValues = {
        ...mockOrderDetailData,
        unitPrice: -50,
        quantity: -2,
        subtotal: -100,
      };

      const entity = new OrderDetailEntity(entityWithNegativeValues);

      expect(entity.unitPrice).toBe(-50);
      expect(entity.quantity).toBe(-2);
      expect(entity.subtotal).toBe(-100);
    });

    it('should handle decimal values', () => {
      const entityWithDecimals = {
        ...mockOrderDetailData,
        unitPrice: 99.999,
        quantity: 1.5,
        subtotal: 149.9985,
      };

      const entity = new OrderDetailEntity(entityWithDecimals);

      expect(entity.unitPrice).toBe(99.999);
      expect(entity.quantity).toBe(1.5);
      expect(entity.subtotal).toBe(149.9985);
      expect(typeof entity.unitPrice).toBe('number');
      expect(typeof entity.quantity).toBe('number');
      expect(typeof entity.subtotal).toBe('number');
    });
  });

  describe('Object.assign behavior', () => {
    it('should merge properties correctly using Object.assign', () => {
      const entity = new OrderDetailEntity({});
      Object.assign(entity, mockOrderDetailData);

      expect(entity.id).toBe(mockOrderDetailData.id);
      expect(entity.orderId).toBe(mockOrderDetailData.orderId);
      expect(entity.productId).toBe(mockOrderDetailData.productId);
    });

    it('should overwrite existing properties with Object.assign', () => {
      const entity = new OrderDetailEntity(mockOrderDetailData);
      const newData = {
        unitPrice: 75.50,
        quantity: 3,
      };

      Object.assign(entity, newData);

      expect(entity.id).toBe(mockOrderDetailData.id); // Should remain unchanged
      expect(entity.unitPrice).toBe(75.50); // Should be updated
      expect(entity.quantity).toBe(3); // Should be updated
    });
  });

  describe('calculated properties', () => {
    it('should handle formattedSubtotal getter', () => {
      const entity = new OrderDetailEntity(mockOrderDetailData);

      // Test that the getter works correctly
      expect(entity.formattedSubtotal).toBeDefined();
      expect(typeof entity.formattedSubtotal).toBe('string');
    });

    it('should format currency correctly', () => {
      const entity = new OrderDetailEntity({
        ...mockOrderDetailData,
        subtotal: 100.50,
      });

      const formatted = entity.formattedSubtotal;

      expect(formatted).toBe('100,50 €');
    });

    it('should handle zero subtotal formatting', () => {
      const entity = new OrderDetailEntity({
        ...mockOrderDetailData,
        subtotal: 0,
      });

      const formatted = entity.formattedSubtotal;

      expect(formatted).toBe('0,00 €');
    });

    it('should handle negative subtotal formatting', () => {
      const entity = new OrderDetailEntity({
        ...mockOrderDetailData,
        subtotal: -50.25,
      });

      const formatted = entity.formattedSubtotal;

      expect(formatted).toBe('-50,25 €');
    });
  });
});
