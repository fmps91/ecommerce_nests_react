import { OrderDetailResponseDto } from '../order-detail-response.dto';

// Mock ProductResponseDto for testing
class MockProductResponseDto {
  id: string;
  nombre: string;
  precio: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<MockProductResponseDto>) {
    Object.assign(this, partial);
  }
}

describe('OrderDetailResponseDto', () => {
  const mockOrderDetailData = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    productId: '123e4567-e89b-12d3-a456-426614174001',
    productName: 'Test Product',
    unitPrice: 9.99,
    quantity: 2,
    subtotal: 19.98,
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
  };

  const mockProductData = {
    id: '123e4567-e89b-12d3-a456-426614174001',
    nombre: 'Test Product',
    precio: 9.99,
    stock: 100,
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
  };

  describe('constructor', () => {
    it('should create instance with complete data', () => {
      const dto = new OrderDetailResponseDto(mockOrderDetailData);

      expect(dto.id).toBe(mockOrderDetailData.id);
      expect(dto.productId).toBe(mockOrderDetailData.productId);
      expect(dto.productName).toBe(mockOrderDetailData.productName);
      expect(dto.unitPrice).toBe(mockOrderDetailData.unitPrice);
      expect(dto.quantity).toBe(mockOrderDetailData.quantity);
      expect(dto.subtotal).toBe(mockOrderDetailData.subtotal);
      expect(dto.createdAt).toBe(mockOrderDetailData.createdAt);
      expect(dto.updatedAt).toBe(mockOrderDetailData.updatedAt);
    });

    it('should create instance with partial data', () => {
      const partialData = {
        id: 'test-id',
        productId: 'product-id',
        unitPrice: 10,
        quantity: 1,
      };

      const dto = new OrderDetailResponseDto(partialData);

      expect(dto.id).toBe('test-id');
      expect(dto.productId).toBe('product-id');
      expect(dto.unitPrice).toBe(10);
      expect(dto.quantity).toBe(1);
      expect(dto.productName).toBeUndefined();
      expect(dto.subtotal).toBeUndefined();
      expect(dto.createdAt).toBeUndefined();
      expect(dto.updatedAt).toBeUndefined();
    });

    it('should handle empty constructor', () => {
      const dto = new OrderDetailResponseDto({});

      expect(dto.id).toBeUndefined();
      expect(dto.productId).toBeUndefined();
      expect(dto.productName).toBeUndefined();
      expect(dto.unitPrice).toBeUndefined();
      expect(dto.quantity).toBeUndefined();
      expect(dto.subtotal).toBeUndefined();
      expect(dto.createdAt).toBeUndefined();
      expect(dto.updatedAt).toBeUndefined();
    });
  });

  describe('field types', () => {
    it('should handle correct field types', () => {
      const dto = new OrderDetailResponseDto(mockOrderDetailData);

      expect(typeof dto.id).toBe('string');
      expect(typeof dto.productId).toBe('string');
      expect(typeof dto.productName).toBe('string');
      expect(typeof dto.unitPrice).toBe('number');
      expect(typeof dto.quantity).toBe('number');
      expect(typeof dto.subtotal).toBe('number');
      expect(dto.createdAt instanceof Date).toBe(true);
      expect(dto.updatedAt instanceof Date).toBe(true);
    });

    it('should handle optional fields as undefined', () => {
      const dto = new OrderDetailResponseDto({
        id: 'test-id',
        productId: 'product-id',
        unitPrice: 10,
        quantity: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      expect(dto.productName).toBeUndefined();
      expect(dto.subtotal).toBeUndefined();
      expect(dto.product).toBeUndefined();
    });

    it('should handle optional fields as null', () => {
      const dto = new OrderDetailResponseDto({
        ...mockOrderDetailData,
        productName: null as any,
        subtotal: null as any,
        product: null as any,
      });

      expect(dto.productName).toBeNull();
      expect(dto.subtotal).toBeNull();
      expect(dto.product).toBeNull();
    });
  });

  describe('UUID validation', () => {
    it('should handle valid UUID format for id', () => {
      const dto = new OrderDetailResponseDto(mockOrderDetailData);
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(dto.id).toMatch(uuidRegex);
    });

    it('should handle valid UUID format for productId', () => {
      const dto = new OrderDetailResponseDto(mockOrderDetailData);
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(dto.productId).toMatch(uuidRegex);
    });

    it('should handle invalid UUID format gracefully', () => {
      const invalidUUIDs = [
        'invalid-uuid',
        '123-456-789',
        'not-a-uuid-at-all',
        '',
        '123e4567-e89b-12d3-a456-42661417400', // Too short
      ];

      invalidUUIDs.forEach(invalidUUID => {
        const dto = new OrderDetailResponseDto({
          ...mockOrderDetailData,
          id: invalidUUID,
        });
        expect(dto.id).toBe(invalidUUID);
      });
    });
  });

  describe('numeric fields validation', () => {
    it('should handle positive unitPrice', () => {
      const positivePrices = [0.01, 1, 10.99, 100, 999.99, 1000];

      positivePrices.forEach(unitPrice => {
        const dto = new OrderDetailResponseDto({
          ...mockOrderDetailData,
          unitPrice: unitPrice,
        });
        expect(dto.unitPrice).toBe(unitPrice);
        expect(dto.unitPrice).toBeGreaterThanOrEqual(0);
      });
    });

    it('should handle zero unitPrice', () => {
      const dto = new OrderDetailResponseDto({
        ...mockOrderDetailData,
        unitPrice: 0,
      });
      expect(dto.unitPrice).toBe(0);
    });

    it('should handle negative unitPrice', () => {
      const negativePrices = [-0.01, -1, -10.99, -100];

      negativePrices.forEach(unitPrice => {
        const dto = new OrderDetailResponseDto({
          ...mockOrderDetailData,
          unitPrice: unitPrice,
        });
        expect(dto.unitPrice).toBe(unitPrice);
        expect(dto.unitPrice).toBeLessThan(0);
      });
    });

    it('should handle positive quantity', () => {
      const positiveQuantities = [1, 2, 10, 100, 999];

      positiveQuantities.forEach(quantity => {
        const dto = new OrderDetailResponseDto({
          ...mockOrderDetailData,
          quantity: quantity,
        });
        expect(dto.quantity).toBe(quantity);
        expect(dto.quantity).toBeGreaterThan(0);
      });
    });

    it('should handle zero quantity', () => {
      const dto = new OrderDetailResponseDto({
        ...mockOrderDetailData,
        quantity: 0,
      });
      expect(dto.quantity).toBe(0);
    });

    it('should handle negative quantity', () => {
      const negativeQuantities = [-1, -10, -100];

      negativeQuantities.forEach(quantity => {
        const dto = new OrderDetailResponseDto({
          ...mockOrderDetailData,
          quantity: quantity,
        });
        expect(dto.quantity).toBe(quantity);
        expect(dto.quantity).toBeLessThan(0);
      });
    });

    it('should handle decimal quantity', () => {
      const decimalQuantities = [1.5, 2.5, 10.99];

      decimalQuantities.forEach(quantity => {
        const dto = new OrderDetailResponseDto({
          ...mockOrderDetailData,
          quantity: quantity,
        });
        expect(dto.quantity).toBe(quantity);
      });
    });

    it('should handle positive subtotal', () => {
      const positiveSubtotals = [0.01, 1, 10.99, 100, 999.99, 1000];

      positiveSubtotals.forEach(subtotal => {
        const dto = new OrderDetailResponseDto({
          ...mockOrderDetailData,
          subtotal: subtotal,
        });
        expect(dto.subtotal).toBe(subtotal);
        expect(dto.subtotal).toBeGreaterThanOrEqual(0);
      });
    });

    it('should handle zero subtotal', () => {
      const dto = new OrderDetailResponseDto({
        ...mockOrderDetailData,
        subtotal: 0,
      });
      expect(dto.subtotal).toBe(0);
    });

    it('should handle negative subtotal', () => {
      const negativeSubtotals = [-0.01, -1, -10.99, -100];

      negativeSubtotals.forEach(subtotal => {
        const dto = new OrderDetailResponseDto({
          ...mockOrderDetailData,
          subtotal: subtotal,
        });
        expect(dto.subtotal).toBe(subtotal);
        expect(dto.subtotal).toBeLessThan(0);
      });
    });
  });

  describe('productName field', () => {
    it('should handle various productName lengths', () => {
      const productNames = [
        '',
        'A',
        'Short',
        'Medium length product name',
        'A'.repeat(100), // Long name
        'A'.repeat(1000), // Very long name
      ];

      productNames.forEach(productName => {
        const dto = new OrderDetailResponseDto({
          ...mockOrderDetailData,
          productName: productName,
        });
        expect(dto.productName).toBe(productName);
        expect(typeof dto.productName).toBe('string');
      });
    });

    it('should handle productName with special characters', () => {
      const specialNames = [
        'Product with ñ and áccents',
        'Product with émojis 🎉 and symbols @#$%',
        'Multiline\nProduct\nName\nWith\nBreaks',
        'Product with "quotes" and \'apostrophes\'',
        'Café & Té Special Blend',
        'Product/Service v2.0',
        'Product: Deluxe Edition',
        'Product; Premium Version',
        'Product* Special',
        'Product+ Extra',
        'Product- Discounted',
        'Product_ Modified',
      ];

      specialNames.forEach(productName => {
        const dto = new OrderDetailResponseDto({
          ...mockOrderDetailData,
          productName: productName,
        });
        expect(dto.productName).toBe(productName);
      });
    });
  });

  describe('product relationship', () => {
    it('should handle product object', () => {
      const product = new MockProductResponseDto(mockProductData);
      const dto = new OrderDetailResponseDto({
        ...mockOrderDetailData,
        product: product,
      });

      expect(dto.product).toBeDefined();
      expect(dto.product).toBeInstanceOf(MockProductResponseDto);
      expect(dto.product!.id).toBe(mockProductData.id);
      expect(dto.product!.nombre).toBe(mockProductData.nombre);
    });

    it('should handle null product', () => {
      const dto = new OrderDetailResponseDto({
        ...mockOrderDetailData,
        product: null as any,
      });

      expect(dto.product).toBeNull();
    });

    it('should handle undefined product', () => {
      const dto = new OrderDetailResponseDto({
        ...mockOrderDetailData,
        product: undefined,
      });

      expect(dto.product).toBeUndefined();
    });

    it('should handle product with complete data', () => {
      const completeProduct = new MockProductResponseDto({
        id: 'product-id',
        nombre: 'Complete Product',
        precio: 29.99,
        stock: 50,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const dto = new OrderDetailResponseDto({
        ...mockOrderDetailData,
        product: completeProduct,
      });

      expect(dto.product!.id).toBe('product-id');
      expect(dto.product!.nombre).toBe('Complete Product');
      expect(dto.product!.precio).toBe(29.99);
      expect(dto.product!.stock).toBe(50);
    });
  });

  describe('date handling', () => {
    it('should handle Date objects correctly', () => {
      const testDate = new Date('2024-12-25T15:30:00.000Z');
      const dto = new OrderDetailResponseDto({
        ...mockOrderDetailData,
        createdAt: testDate,
        updatedAt: testDate,
      });

      expect(dto.createdAt).toBe(testDate);
      expect(dto.updatedAt).toBe(testDate);
      expect(dto.createdAt instanceof Date).toBe(true);
      expect(dto.updatedAt instanceof Date).toBe(true);
    });

    it('should handle different dates', () => {
      const createdDate = new Date('2024-01-01T00:00:00.000Z');
      const updatedDate = new Date('2024-06-15T12:30:00.000Z');

      const dto = new OrderDetailResponseDto({
        ...mockOrderDetailData,
        createdAt: createdDate,
        updatedAt: updatedDate,
      });

      expect(dto.createdAt).toBe(createdDate);
      expect(dto.updatedAt).toBe(updatedDate);
    });

    it('should handle null dates', () => {
      const dto = new OrderDetailResponseDto({
        ...mockOrderDetailData,
        createdAt: null as any,
        updatedAt: null as any,
      });

      expect(dto.createdAt).toBeNull();
      expect(dto.updatedAt).toBeNull();
    });

    it('should handle undefined dates', () => {
      const dto = new OrderDetailResponseDto({
        ...mockOrderDetailData,
        createdAt: undefined,
        updatedAt: undefined,
      });

      expect(dto.createdAt).toBeUndefined();
      expect(dto.updatedAt).toBeUndefined();
    });
  });

  describe('calculated properties', () => {
    it('should calculate formattedUnitPrice correctly', () => {
      const testPrices = [9.99, 19.50, 100, 0.01, 999999.99];

      testPrices.forEach(unitPrice => {
        const dto = new OrderDetailResponseDto({
          ...mockOrderDetailData,
          unitPrice: unitPrice,
        });

        expect(dto.formattedUnitPrice).toBeDefined();
        expect(typeof dto.formattedUnitPrice).toBe('string');
        expect(dto.formattedUnitPrice).toContain('€');
        expect(dto.formattedUnitPrice).toContain(unitPrice.toFixed(2).replace('.', ','));
      });
    });

    it('should calculate formattedSubtotal correctly', () => {
      const testSubtotals = [19.98, 39.00, 200, 0.02, 1999999.98];

      testSubtotals.forEach(subtotal => {
        const dto = new OrderDetailResponseDto({
          ...mockOrderDetailData,
          subtotal: subtotal,
        });

        expect(dto.formattedSubtotal).toBeDefined();
        expect(typeof dto.formattedSubtotal).toBe('string');
        expect(dto.formattedSubtotal).toContain('€');
        expect(dto.formattedSubtotal).toContain(subtotal.toFixed(2).replace('.', ','));
      });
    });

    it('should handle zero values in formatted properties', () => {
      const dto = new OrderDetailResponseDto({
        ...mockOrderDetailData,
        unitPrice: 0,
        subtotal: 0,
      });

      expect(dto.formattedUnitPrice).toBe('0,00 €');
      expect(dto.formattedSubtotal).toBe('0,00 €');
    });

    it('should handle negative values in formatted properties', () => {
      const dto = new OrderDetailResponseDto({
        ...mockOrderDetailData,
        unitPrice: -10,
        subtotal: -20,
      });

      expect(dto.formattedUnitPrice).toContain('-10,00 €');
      expect(dto.formattedSubtotal).toContain('-20,00 €');
    });

    it('should handle decimal precision in formatted properties', () => {
      const dto = new OrderDetailResponseDto({
        ...mockOrderDetailData,
        unitPrice: 9.999,
        subtotal: 19.998,
      });

      expect(dto.formattedUnitPrice).toContain('9,99 €');
      expect(dto.formattedSubtotal).toContain('19,99 €');
    });

    it('should handle very large numbers in formatted properties', () => {
      const dto = new OrderDetailResponseDto({
        ...mockOrderDetailData,
        unitPrice: 999999.99,
        subtotal: 1999999.98,
      });

      expect(dto.formattedUnitPrice).toContain('999.999,99 €');
      expect(dto.formattedSubtotal).toContain('1.999.999,98 €');
    });
  });

  describe('serialization', () => {
    it('should be serializable to JSON', () => {
      const dto = new OrderDetailResponseDto(mockOrderDetailData);
      const jsonString = JSON.stringify(dto);
      const parsed = JSON.parse(jsonString);

      expect(parsed.id).toBe(mockOrderDetailData.id);
      expect(parsed.productId).toBe(mockOrderDetailData.productId);
      expect(parsed.productName).toBe(mockOrderDetailData.productName);
      expect(parsed.unitPrice).toBe(mockOrderDetailData.unitPrice);
      expect(parsed.quantity).toBe(mockOrderDetailData.quantity);
      expect(parsed.subtotal).toBe(mockOrderDetailData.subtotal);
      expect(parsed.createdAt).toBe(mockOrderDetailData.createdAt.toISOString());
      expect(parsed.updatedAt).toBe(mockOrderDetailData.updatedAt.toISOString());
      expect(parsed.formattedUnitPrice).toBeDefined();
      expect(parsed.formattedSubtotal).toBeDefined();
    });

    it('should serialize with product relationship', () => {
      const product = new MockProductResponseDto(mockProductData);
      const dto = new OrderDetailResponseDto({
        ...mockOrderDetailData,
        product: product,
      });

      const jsonString = JSON.stringify(dto);
      const parsed = JSON.parse(jsonString);

      expect(parsed.product).toBeDefined();
      expect(parsed.product.id).toBe(mockProductData.id);
      expect(parsed.product.nombre).toBe(mockProductData.nombre);
    });

    it('should serialize partial data correctly', () => {
      const partialDto = new OrderDetailResponseDto({
        id: 'test-id',
        productId: 'product-id',
        unitPrice: 10,
        quantity: 1,
      });

      const jsonString = JSON.stringify(partialDto);
      const parsed = JSON.parse(jsonString);

      expect(parsed.id).toBe('test-id');
      expect(parsed.productId).toBe('product-id');
      expect(parsed.unitPrice).toBe(10);
      expect(parsed.quantity).toBe(1);
      expect(parsed.productName).toBeUndefined();
      expect(parsed.subtotal).toBeUndefined();
      expect(parsed.createdAt).toBeUndefined();
      expect(parsed.updatedAt).toBeUndefined();
    });

    it('should include calculated properties in JSON', () => {
      const dto = new OrderDetailResponseDto(mockOrderDetailData);
      const jsonString = JSON.stringify(dto);
      const parsed = JSON.parse(jsonString);

      expect(parsed.formattedUnitPrice).toBeDefined();
      expect(parsed.formattedSubtotal).toBeDefined();
      expect(typeof parsed.formattedUnitPrice).toBe('string');
      expect(typeof parsed.formattedSubtotal).toBe('string');
    });
  });

  describe('edge cases', () => {
    it('should handle very long strings', () => {
      const longString = 'a'.repeat(1000);
      const dto = new OrderDetailResponseDto({
        ...mockOrderDetailData,
        productName: longString,
      });

      expect(dto.productName).toBe(longString);
      expect(typeof dto.productName).toBe('string');
    });

    it('should handle special characters in productName', () => {
      const specialNames = [
        'Producto con ñ y ácentos',
        'Product with émojis 🎉',
        'Café & Té',
        'Product (Special) Edition',
      ];

      specialNames.forEach(productName => {
        const dto = new OrderDetailResponseDto({
          ...mockOrderDetailData,
          productName: productName,
        });
        expect(dto.productName).toBe(productName);
      });
    });

    it('should handle extreme numbers', () => {
      const extremeNumbers = {
        unitPrice: Number.MAX_SAFE_INTEGER,
        quantity: Number.MAX_SAFE_INTEGER,
        subtotal: Number.MAX_SAFE_INTEGER,
      };

      const dto = new OrderDetailResponseDto({
        ...mockOrderDetailData,
        ...extremeNumbers,
      });

      expect(dto.unitPrice).toBe(Number.MAX_SAFE_INTEGER);
      expect(dto.quantity).toBe(Number.MAX_SAFE_INTEGER);
      expect(dto.subtotal).toBe(Number.MAX_SAFE_INTEGER);
    });

    it('should handle floating point precision', () => {
      const floatingNumbers = [0.1 + 0.2, 0.3, 1.999999999, 99.999999999];

      floatingNumbers.forEach(unitPrice => {
        const dto = new OrderDetailResponseDto({
          ...mockOrderDetailData,
          unitPrice: unitPrice,
        });
        expect(dto.unitPrice).toBe(unitPrice);
      });
    });

    it('should handle calculation consistency', () => {
      const dto = new OrderDetailResponseDto({
        ...mockOrderDetailData,
        unitPrice: 10,
        quantity: 3,
        subtotal: 30,
      });

      // The formatted values should be consistent
      expect(dto.formattedUnitPrice).toBe('10,00 €');
      expect(dto.formattedSubtotal).toBe('30,00 €');
    });
  });

  describe('Object.assign behavior', () => {
    it('should merge properties correctly using Object.assign', () => {
      const dto = new OrderDetailResponseDto({});
      Object.assign(dto, mockOrderDetailData);

      expect(dto.id).toBe(mockOrderDetailData.id);
      expect(dto.productId).toBe(mockOrderDetailData.productId);
      expect(dto.productName).toBe(mockOrderDetailData.productName);
      expect(dto.unitPrice).toBe(mockOrderDetailData.unitPrice);
    });

    it('should overwrite existing properties with Object.assign', () => {
      const dto = new OrderDetailResponseDto(mockOrderDetailData);
      const newData = {
        productName: 'Updated Product',
        unitPrice: 199.99,
        quantity: 5,
      };

      Object.assign(dto, newData);

      expect(dto.id).toBe(mockOrderDetailData.id); // Should remain unchanged
      expect(dto.productName).toBe('Updated Product'); // Should be updated
      expect(dto.unitPrice).toBe(199.99); // Should be updated
      expect(dto.quantity).toBe(5); // Should be updated
    });
  });

  describe('instanceof and constructor', () => {
    it('should be instance of OrderDetailResponseDto', () => {
      const dto = new OrderDetailResponseDto(mockOrderDetailData);

      expect(dto instanceof OrderDetailResponseDto).toBe(true);
      expect(dto.constructor.name).toBe('OrderDetailResponseDto');
    });

    it('should have correct prototype chain', () => {
      const dto = new OrderDetailResponseDto(mockOrderDetailData);

      expect(Object.getPrototypeOf(dto)).toBe(OrderDetailResponseDto.prototype);
      expect(OrderDetailResponseDto.prototype.constructor.name).toBe('OrderDetailResponseDto');
    });
  });
});
