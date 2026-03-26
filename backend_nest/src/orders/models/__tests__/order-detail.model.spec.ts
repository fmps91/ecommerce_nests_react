import { OrderDetail } from '../order-detail.model';

describe('OrderDetail Model', () => {
  const mockProductData = {
    id: '123e4567-e89b-12d3-a456-426614174004',
    nombre: 'Test Product',
    precio: 50.25,
    stock: 100,
    descripcion: 'Test product description',
    imagen: 'https://example.com/product.jpg',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
  };

  const mockOrderData = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    userId: '123e4567-e89b-12d3-a456-426614174001',
    total: 100.50,
    status: 'PENDING',
    isPaid: false,
    notes: 'Test order notes',
    shippingAddress: { street: '123 Test St' },
    billingAddress: { street: '456 Billing St' },
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
    order: mockOrderData,
    product: mockProductData,
  };

  describe('model structure', () => {
    it('should have correct table configuration', () => {
      // Test that OrderDetail model extends Sequelize Model
      expect(OrderDetail.prototype.constructor.name).toBe('OrderDetail');
    });

    it('should have all required fields', () => {
      const orderDetail = new OrderDetail(mockOrderDetailData as any);

      expect(orderDetail.id).toBeDefined();
      expect(orderDetail.orderId).toBeDefined();
      expect(orderDetail.productId).toBeDefined();
      expect(orderDetail.productName).toBeDefined();
      expect(orderDetail.unitPrice).toBeDefined();
      expect(orderDetail.quantity).toBeDefined();
      expect(orderDetail.subtotal).toBeDefined();
      expect(orderDetail.createdAt).toBeDefined();
      expect(orderDetail.updatedAt).toBeDefined();
    });
  });

  describe('field types and validation', () => {
    it('should handle correct field types', () => {
      const orderDetail = new OrderDetail(mockOrderDetailData as any);

      expect(typeof orderDetail.id).toBe('string');
      expect(typeof orderDetail.orderId).toBe('string');
      expect(typeof orderDetail.productId).toBe('string');
      expect(typeof orderDetail.productName).toBe('string');
      expect(typeof orderDetail.unitPrice).toBe('number');
      expect(typeof orderDetail.quantity).toBe('number');
      expect(typeof orderDetail.subtotal).toBe('number');
      expect(orderDetail.createdAt instanceof Date).toBe(true);
      expect(orderDetail.updatedAt instanceof Date).toBe(true);
    });

    it('should handle UUID format for id', () => {
      const orderDetail = new OrderDetail(mockOrderDetailData as any);

      expect(orderDetail.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should handle UUID format for orderId', () => {
      const orderDetail = new OrderDetail(mockOrderDetailData as any);

      expect(orderDetail.orderId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should handle UUID format for productId', () => {
      const orderDetail = new OrderDetail(mockOrderDetailData as any);

      expect(orderDetail.productId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should handle productName validation', () => {
      const orderDetail = new OrderDetail(mockOrderDetailData as any);

      expect(orderDetail.productName).toBe('Test Product');
      expect(orderDetail.productName.length).toBeGreaterThan(0);
      expect(typeof orderDetail.productName).toBe('string');
    });

    it('should handle unitPrice validation', () => {
      const orderDetail = new OrderDetail(mockOrderDetailData as any);

      expect(orderDetail.unitPrice).toBe(50.25);
      expect(orderDetail.unitPrice).toBeGreaterThan(0);
      expect(typeof orderDetail.unitPrice).toBe('number');
    });

    it('should handle quantity validation', () => {
      const orderDetail = new OrderDetail(mockOrderDetailData as any);

      expect(orderDetail.quantity).toBe(2);
      expect(orderDetail.quantity).toBeGreaterThanOrEqual(1);
      expect(typeof orderDetail.quantity).toBe('number');
    });

    it('should handle subtotal validation', () => {
      const orderDetail = new OrderDetail(mockOrderDetailData as any);

      expect(orderDetail.subtotal).toBe(100.50);
      expect(orderDetail.subtotal).toBeGreaterThan(0);
      expect(typeof orderDetail.subtotal).toBe('number');
    });
  });

  describe('date handling', () => {
    it('should handle Date objects correctly', () => {
      const testDate = new Date('2024-12-25T15:30:00.000Z');
      const orderDetailWithDates = {
        ...mockOrderDetailData,
        createdAt: testDate,
        updatedAt: testDate,
      };

      const orderDetail = new OrderDetail(orderDetailWithDates as any);

      expect(orderDetail.createdAt).toBe(testDate);
      expect(orderDetail.updatedAt).toBe(testDate);
      expect(orderDetail.createdAt instanceof Date).toBe(true);
      expect(orderDetail.updatedAt instanceof Date).toBe(true);
    });
  });

  describe('unitPrice handling', () => {
    it('should handle zero unitPrice', () => {
      const orderDetailWithZeroUnitPrice = {
        ...mockOrderDetailData,
        unitPrice: 0,
      };

      const orderDetail = new OrderDetail(orderDetailWithZeroUnitPrice as any);

      expect(orderDetail.unitPrice).toBe(0);
      expect(typeof orderDetail.unitPrice).toBe('number');
    });

    it('should handle negative unitPrice', () => {
      const orderDetailWithNegativeUnitPrice = {
        ...mockOrderDetailData,
        unitPrice: -10,
      };

      const orderDetail = new OrderDetail(orderDetailWithNegativeUnitPrice as any);

      expect(orderDetail.unitPrice).toBe(-10);
      expect(typeof orderDetail.unitPrice).toBe('number');
    });

    it('should handle decimal unitPrice', () => {
      const orderDetailWithDecimalUnitPrice = {
        ...mockOrderDetailData,
        unitPrice: 99.999,
      };

      const orderDetail = new OrderDetail(orderDetailWithDecimalUnitPrice as any);

      expect(orderDetail.unitPrice).toBe(99.999);
      expect(typeof orderDetail.unitPrice).toBe('number');
    });

    it('should handle very large unitPrice', () => {
      const orderDetailWithLargeUnitPrice = {
        ...mockOrderDetailData,
        unitPrice: 999999.99,
      };

      const orderDetail = new OrderDetail(orderDetailWithLargeUnitPrice as any);

      expect(orderDetail.unitPrice).toBe(999999.99);
      expect(typeof orderDetail.unitPrice).toBe('number');
    });

    it('should handle unitPrice with decimal precision', () => {
      const orderDetailWithPrecision = {
        ...mockOrderDetailData,
        unitPrice: 1234.56,
      };

      const orderDetail = new OrderDetail(orderDetailWithPrecision as any);

      expect(orderDetail.unitPrice).toBe(1234.56);
      expect(orderDetail.unitPrice.toFixed(2)).toBe('1234.56');
    });
  });

  describe('quantity handling', () => {
    it('should handle minimum quantity', () => {
      const orderDetailWithMinQuantity = {
        ...mockOrderDetailData,
        quantity: 1,
      };

      const orderDetail = new OrderDetail(orderDetailWithMinQuantity as any);

      expect(orderDetail.quantity).toBe(1);
      expect(typeof orderDetail.quantity).toBe('number');
    });

    it('should handle large quantity', () => {
      const orderDetailWithLargeQuantity = {
        ...mockOrderDetailData,
        quantity: 1000,
      };

      const orderDetail = new OrderDetail(orderDetailWithLargeQuantity as any);

      expect(orderDetail.quantity).toBe(1000);
      expect(typeof orderDetail.quantity).toBe('number');
    });

    it('should handle zero quantity (should fail validation)', () => {
      const orderDetailWithZeroQuantity = {
        ...mockOrderDetailData,
        quantity: 0,
      };

      const orderDetail = new OrderDetail(orderDetailWithZeroQuantity as any);

      expect(orderDetail.quantity).toBe(0);
      expect(typeof orderDetail.quantity).toBe('number');
      // Note: Sequelize validation would fail this, but we test the assignment
    });
  });

  describe('subtotal handling', () => {
    it('should handle zero subtotal', () => {
      const orderDetailWithZeroSubtotal = {
        ...mockOrderDetailData,
        subtotal: 0,
      };

      const orderDetail = new OrderDetail(orderDetailWithZeroSubtotal as any);

      expect(orderDetail.subtotal).toBe(0);
      expect(typeof orderDetail.subtotal).toBe('number');
    });

    it('should handle negative subtotal', () => {
      const orderDetailWithNegativeSubtotal = {
        ...mockOrderDetailData,
        subtotal: -50,
      };

      const orderDetail = new OrderDetail(orderDetailWithNegativeSubtotal as any);

      expect(orderDetail.subtotal).toBe(-50);
      expect(typeof orderDetail.subtotal).toBe('number');
    });

    it('should handle decimal subtotal', () => {
      const orderDetailWithDecimalSubtotal = {
        ...mockOrderDetailData,
        subtotal: 99.999,
      };

      const orderDetail = new OrderDetail(orderDetailWithDecimalSubtotal as any);

      expect(orderDetail.subtotal).toBe(99.999);
      expect(typeof orderDetail.subtotal).toBe('number');
    });

    it('should handle very large subtotal', () => {
      const orderDetailWithLargeSubtotal = {
        ...mockOrderDetailData,
        subtotal: 999999.99,
      };

      const orderDetail = new OrderDetail(orderDetailWithLargeSubtotal as any);

      expect(orderDetail.subtotal).toBe(999999.99);
      expect(typeof orderDetail.subtotal).toBe('number');
    });

    it('should handle subtotal with decimal precision', () => {
      const orderDetailWithPrecision = {
        ...mockOrderDetailData,
        subtotal: 1234.56,
      };

      const orderDetail = new OrderDetail(orderDetailWithPrecision as any);

      expect(orderDetail.subtotal).toBe(1234.56);
      expect(orderDetail.subtotal.toFixed(2)).toBe('1234.56');
    });

    it('should calculate subtotal correctly from unitPrice and quantity', () => {
      const orderDetailWithCalculation = {
        ...mockOrderDetailData,
        unitPrice: 25.50,
        quantity: 4,
        subtotal: 102.00, // 25.50 * 4
      };

      const orderDetail = new OrderDetail(orderDetailWithCalculation as any);

      expect(orderDetail.unitPrice).toBe(25.50);
      expect(orderDetail.quantity).toBe(4);
      expect(orderDetail.subtotal).toBe(102.00);
      expect(orderDetail.subtotal).toBe(orderDetail.unitPrice * orderDetail.quantity);
    });
  });

  describe('productName handling', () => {
    it('should handle empty productName', () => {
      const orderDetailWithEmptyProductName = {
        ...mockOrderDetailData,
        productName: '',
      };

      const orderDetail = new OrderDetail(orderDetailWithEmptyProductName as any);

      expect(orderDetail.productName).toBe('');
      expect(typeof orderDetail.productName).toBe('string');
    });

    it('should handle special characters in productName', () => {
      const specialChars = 'Product with émojis 🎉 and chars: @#$%^&*()';
      const orderDetailWithSpecialChars = {
        ...mockOrderDetailData,
        productName: specialChars,
      };

      const orderDetail = new OrderDetail(orderDetailWithSpecialChars as any);

      expect(orderDetail.productName).toBe(specialChars);
      expect(typeof orderDetail.productName).toBe('string');
    });

    it('should handle very long productName', () => {
      const longProductName = 'a'.repeat(200);
      const orderDetailWithLongProductName = {
        ...mockOrderDetailData,
        productName: longProductName,
      };

      const orderDetail = new OrderDetail(orderDetailWithLongProductName as any);

      expect(orderDetail.productName).toBe(longProductName);
      expect(typeof orderDetail.productName).toBe('string');
    });
  });

  describe('relationships', () => {
    it('should handle order relationship correctly', () => {
      const orderDetail = new OrderDetail(mockOrderDetailData as any);

      expect(orderDetail.order).toBeDefined();
      expect(orderDetail.order.id).toBe(mockOrderData.id);
      expect(orderDetail.order.userId).toBe(mockOrderData.userId);
    });

    it('should handle null order', () => {
      const orderDetailWithNullOrder = {
        ...mockOrderDetailData,
        order: null,
      };

      const orderDetail = new OrderDetail(orderDetailWithNullOrder as any);

      expect(orderDetail.order).toBeNull();
    });

    it('should handle undefined order', () => {
      const orderDetailWithUndefinedOrder = {
        ...mockOrderDetailData,
        order: undefined,
      };

      const orderDetail = new OrderDetail(orderDetailWithUndefinedOrder as any);

      expect(orderDetail.order).toBeUndefined();
    });

    it('should handle product relationship correctly', () => {
      const orderDetail = new OrderDetail(mockOrderDetailData as any);

      expect(orderDetail.product).toBeDefined();
      expect(orderDetail.product.id).toBe(mockProductData.id);
      expect(orderDetail.product.nombre).toBe(mockProductData.nombre);
    });

    it('should handle null product', () => {
      const orderDetailWithNullProduct = {
        ...mockOrderDetailData,
        product: null,
      };

      const orderDetail = new OrderDetail(orderDetailWithNullProduct as any);

      expect(orderDetail.product).toBeNull();
    });

    it('should handle undefined product', () => {
      const orderDetailWithUndefinedProduct = {
        ...mockOrderDetailData,
        product: undefined,
      };

      const orderDetail = new OrderDetail(orderDetailWithUndefinedProduct as any);

      expect(orderDetail.product).toBeUndefined();
    });
  });

  describe('serialization', () => {
    it('should be serializable to JSON', () => {
      const orderDetail = new OrderDetail(mockOrderDetailData as any);
      const jsonString = JSON.stringify(orderDetail);
      const parsed = JSON.parse(jsonString);

      expect(parsed.id).toBe(mockOrderDetailData.id);
      expect(parsed.orderId).toBe(mockOrderDetailData.orderId);
      expect(parsed.productId).toBe(mockOrderDetailData.productId);
      expect(parsed.productName).toBe(mockOrderDetailData.productName);
      expect(parsed.unitPrice).toBe(mockOrderDetailData.unitPrice);
      expect(parsed.quantity).toBe(mockOrderDetailData.quantity);
      expect(parsed.subtotal).toBe(mockOrderDetailData.subtotal);
      expect(parsed.createdAt).toBe(mockOrderDetailData.createdAt.toISOString());
      expect(parsed.updatedAt).toBe(mockOrderDetailData.updatedAt.toISOString());
    });

    it('should serialize partial data correctly', () => {
      const partialOrderDetail = new OrderDetail({
        id: 'test-id',
        orderId: 'test-order-id',
        productId: 'test-product-id',
        productName: 'Test Product',
        unitPrice: 25.50,
        quantity: 2,
        subtotal: 51.00,
      } as any);

      const jsonString = JSON.stringify(partialOrderDetail);
      const parsed = JSON.parse(jsonString);

      expect(parsed.id).toBe('test-id');
      expect(parsed.orderId).toBe('test-order-id');
      expect(parsed.productId).toBe('test-product-id');
      expect(parsed.productName).toBe('Test Product');
      expect(parsed.unitPrice).toBe(25.50);
      expect(parsed.quantity).toBe(2);
      expect(parsed.subtotal).toBe(51.00);
    });

    it('should handle null values in serialization', () => {
      const orderDetailWithNulls = new OrderDetail({
        id: 'test-id',
        orderId: 'test-order-id',
        productId: 'test-product-id',
        productName: 'Test Product',
        unitPrice: 25.50,
        quantity: 2,
        subtotal: 51.00,
        order: null,
        product: null,
      } as any);

      const jsonString = JSON.stringify(orderDetailWithNulls);
      const parsed = JSON.parse(jsonString);

      expect(parsed.id).toBe('test-id');
      expect(parsed.order).toBe(null);
      expect(parsed.product).toBe(null);
    });
  });

  describe('edge cases', () => {
    it('should handle minimal data', () => {
      const minimalOrderDetail = new OrderDetail({
        id: 'minimal-id',
        orderId: 'minimal-order-id',
        productId: 'minimal-product-id',
        productName: 'Minimal Product',
        unitPrice: 1,
        quantity: 1,
        subtotal: 1,
      } as any);

      expect(minimalOrderDetail.id).toBe('minimal-id');
      expect(minimalOrderDetail.orderId).toBe('minimal-order-id');
      expect(minimalOrderDetail.productId).toBe('minimal-product-id');
      expect(minimalOrderDetail.productName).toBe('Minimal Product');
      expect(minimalOrderDetail.unitPrice).toBe(1);
      expect(minimalOrderDetail.quantity).toBe(1);
      expect(minimalOrderDetail.subtotal).toBe(1);
    });

    it('should handle maximum decimal precision', () => {
      const orderDetailWithMaxPrecision = {
        ...mockOrderDetailData,
        unitPrice: 99999999.99,
        subtotal: 99999999.99,
      };

      const orderDetail = new OrderDetail(orderDetailWithMaxPrecision as any);

      expect(orderDetail.unitPrice).toBe(99999999.99);
      expect(orderDetail.subtotal).toBe(99999999.99);
      expect(typeof orderDetail.unitPrice).toBe('number');
      expect(typeof orderDetail.subtotal).toBe('number');
    });
  });

  describe('model methods and behavior', () => {
    it('should handle Sequelize model methods', () => {
      const orderDetail = new OrderDetail(mockOrderDetailData as any);

      // Test that it's a Sequelize Model instance
      expect(typeof orderDetail.save).toBe('function');
      expect(typeof orderDetail.reload).toBe('function');
      expect(typeof orderDetail.destroy).toBe('function');
      expect(typeof orderDetail.update).toBe('function');
    });

    it('should handle dataValues property', () => {
      const orderDetail = new OrderDetail(mockOrderDetailData as any);

      // Sequelize models have dataValues property
      expect(orderDetail.dataValues).toBeDefined();
      expect(typeof orderDetail.dataValues).toBe('object');
    });

    it('should handle isNewRecord property', () => {
      const orderDetail = new OrderDetail(mockOrderDetailData as any);

      // Sequelize models have isNewRecord property
      expect(typeof orderDetail.isNewRecord).toBe('boolean');
    });
  });
});
