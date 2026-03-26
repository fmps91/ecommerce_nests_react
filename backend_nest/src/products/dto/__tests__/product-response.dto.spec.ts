import { ProductResponseDto } from '../product-response.dto';

describe('ProductResponseDto', () => {
  const mockProductData = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    nombre: 'Producto de prueba',
    precio: 99.99,
    stock: 10,
    descripcion: 'Descripción del producto',
    imagen: 'https://example.com/image.jpg',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
    deletedAt: undefined,
  };

  describe('constructor', () => {
    it('should create instance with complete data', () => {
      const dto = new ProductResponseDto(mockProductData);

      expect(dto.id).toBe(mockProductData.id);
      expect(dto.nombre).toBe(mockProductData.nombre);
      expect(dto.precio).toBe(mockProductData.precio);
      expect(dto.stock).toBe(mockProductData.stock);
      expect(dto.descripcion).toBe(mockProductData.descripcion);
      expect(dto.imagen).toBe(mockProductData.imagen);
      expect(dto.createdAt).toBe(mockProductData.createdAt);
      expect(dto.updatedAt).toBe(mockProductData.updatedAt);
      expect(dto.deletedAt).toBe(mockProductData.deletedAt);
    });

    it('should create instance with partial data', () => {
      const partialData = {
        id: 'test-id',
        nombre: 'Producto parcial',
        precio: 49.99,
        stock: 5,
      };

      const dto = new ProductResponseDto(partialData);

      expect(dto.id).toBe('test-id');
      expect(dto.nombre).toBe('Producto parcial');
      expect(dto.precio).toBe(49.99);
      expect(dto.stock).toBe(5);
      expect(dto.descripcion).toBeUndefined();
      expect(dto.imagen).toBeUndefined();
      expect(dto.createdAt).toBeUndefined();
      expect(dto.updatedAt).toBeUndefined();
      expect(dto.deletedAt).toBeUndefined();
    });

    it('should handle empty constructor', () => {
      const dto = new ProductResponseDto({});

      expect(dto.id).toBeUndefined();
      expect(dto.nombre).toBeUndefined();
      expect(dto.precio).toBeUndefined();
      expect(dto.stock).toBeUndefined();
      expect(dto.descripcion).toBeUndefined();
      expect(dto.imagen).toBeUndefined();
      expect(dto.createdAt).toBeUndefined();
      expect(dto.updatedAt).toBeUndefined();
      expect(dto.deletedAt).toBeUndefined();
    });
  });

  describe('field types', () => {
    it('should handle correct field types', () => {
      const dto = new ProductResponseDto(mockProductData);

      expect(typeof dto.id).toBe('string');
      expect(typeof dto.nombre).toBe('string');
      expect(typeof dto.precio).toBe('number');
      expect(typeof dto.stock).toBe('number');
      expect(typeof dto.descripcion).toBe('string');
      expect(typeof dto.imagen).toBe('string');
      expect(dto.createdAt instanceof Date).toBe(true);
      expect(dto.updatedAt instanceof Date).toBe(true);
    });

    it('should handle optional fields as undefined', () => {
      const dto = new ProductResponseDto({
        id: 'test-id',
        nombre: 'Test',
        precio: 10,
        stock: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      expect(dto.descripcion).toBeUndefined();
      expect(dto.imagen).toBeUndefined();
      expect(dto.deletedAt).toBeUndefined();
    });

    it('should handle optional fields as null', () => {
      const dto = new ProductResponseDto({
        ...mockProductData,
        descripcion: null,
        imagen: null,
        deletedAt: null,
      } as any);

      expect(dto.descripcion).toBeNull();
      expect(dto.imagen).toBeNull();
      expect(dto.deletedAt).toBeNull();
    });
  });

  describe('UUID validation', () => {
    it('should handle valid UUID format', () => {
      const dto = new ProductResponseDto(mockProductData);
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(dto.id).toMatch(uuidRegex);
    });

    it('should handle invalid UUID format gracefully', () => {
      const invalidUUIDs = [
        'invalid-uuid',
        '123-456-789',
        'not-a-uuid-at-all',
        '',
        '123e4567-e89b-12d3-a456-42661417400' // Too short
      ];

      invalidUUIDs.forEach(invalidUUID => {
        const dto = new ProductResponseDto({
          ...mockProductData,
          id: invalidUUID,
        });
        expect(dto.id).toBe(invalidUUID);
      });
    });
  });

  describe('price validation', () => {
    it('should handle positive prices', () => {
      const positivePrices = [0.01, 1, 10.99, 100, 999.99, 1000];

      positivePrices.forEach(price => {
        const dto = new ProductResponseDto({
          ...mockProductData,
          precio: price,
        });
        expect(dto.precio).toBe(price);
        expect(dto.precio).toBeGreaterThan(0);
      });
    });

    it('should handle zero price', () => {
      const dto = new ProductResponseDto({
        ...mockProductData,
        precio: 0,
      });
      expect(dto.precio).toBe(0);
    });

    it('should handle negative prices', () => {
      const negativePrices = [-0.01, -1, -10.99, -100];

      negativePrices.forEach(price => {
        const dto = new ProductResponseDto({
          ...mockProductData,
          precio: price,
        });
        expect(dto.precio).toBe(price);
        expect(dto.precio).toBeLessThan(0);
      });
    });

    it('should handle decimal prices', () => {
      const decimalPrices = [10.50, 99.99, 0.99, 1000.01];

      decimalPrices.forEach(price => {
        const dto = new ProductResponseDto({
          ...mockProductData,
          precio: price,
        });
        expect(dto.precio).toBe(price);
        expect(dto.precio % 1).not.toBe(0); // Has decimals
      });
    });
  });

  describe('stock validation', () => {
    it('should handle positive stock', () => {
      const positiveStock = [1, 10, 100, 999];

      positiveStock.forEach(stock => {
        const dto = new ProductResponseDto({
          ...mockProductData,
          stock: stock,
        });
        expect(dto.stock).toBe(stock);
        expect(dto.stock).toBeGreaterThan(0);
      });
    });

    it('should handle zero stock', () => {
      const dto = new ProductResponseDto({
        ...mockProductData,
        stock: 0,
      });
      expect(dto.stock).toBe(0);
    });

    it('should handle negative stock', () => {
      const negativeStock = [-1, -10, -100];

      negativeStock.forEach(stock => {
        const dto = new ProductResponseDto({
          ...mockProductData,
          stock: stock,
        });
        expect(dto.stock).toBe(stock);
        expect(dto.stock).toBeLessThan(0);
      });
    });
  });

  describe('description field', () => {
    it('should handle various description lengths', () => {
      const descriptions = [
        '',
        'Short',
        'Medium length description',
        'A'.repeat(100), // Long description
        'A'.repeat(1000), // Very long description
      ];

      descriptions.forEach(description => {
        const dto = new ProductResponseDto({
          ...mockProductData,
          descripcion: description,
        });
        expect(dto.descripcion).toBe(description);
        expect(typeof dto.descripcion).toBe('string');
      });
    });

    it('should handle description with special characters', () => {
      const specialDescriptions = [
        'Producto con ñ y áéíóú',
        'Product with émojis 🎉 and symbols @#$%',
        'Multiline\nDescription\nWith\nBreaks',
        'Description with "quotes" and \'apostrophes\'',
      ];

      specialDescriptions.forEach(description => {
        const dto = new ProductResponseDto({
          ...mockProductData,
          descripcion: description,
        });
        expect(dto.descripcion).toBe(description);
      });
    });
  });

  describe('image field', () => {
    it('should handle various image URLs', () => {
      const imageUrls = [
        'https://example.com/image.jpg',
        'https://cdn.example.com/products/image.png',
        'https://images.example.com/path/to/image.webp',
        'https://example.com/image-with-dashes.jpg',
        'https://example.com/image_with_underscores.png',
      ];

      imageUrls.forEach(imagen => {
        const dto = new ProductResponseDto({
          ...mockProductData,
          imagen: imagen,
        });
        expect(dto.imagen).toBe(imagen);
        expect(typeof dto.imagen).toBe('string');
      });
    });

    it('should handle relative image paths', () => {
      const relativePaths = [
        '/images/product.jpg',
        './assets/image.png',
        'uploads/products/image.webp',
      ];

      relativePaths.forEach(imagen => {
        const dto = new ProductResponseDto({
          ...mockProductData,
          imagen: imagen,
        });
        expect(dto.imagen).toBe(imagen);
      });
    });

    it('should handle empty image string', () => {
      const dto = new ProductResponseDto({
        ...mockProductData,
        imagen: '',
      });
      expect(dto.imagen).toBe('');
    });
  });

  describe('date handling', () => {
    it('should handle Date objects correctly', () => {
      const testDate = new Date('2024-12-25T15:30:00.000Z');
      const dto = new ProductResponseDto({
        ...mockProductData,
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
      const deletedDate = new Date('2024-12-31T23:59:59.000Z');

      const dto = new ProductResponseDto({
        ...mockProductData,
        createdAt: createdDate,
        updatedAt: updatedDate,
        deletedAt: deletedDate,
      });

      expect(dto.createdAt).toBe(createdDate);
      expect(dto.updatedAt).toBe(updatedDate);
      expect(dto.deletedAt).toBe(deletedDate);
    });

    it('should handle null dates', () => {
      const dto = new ProductResponseDto({
        ...mockProductData,
        createdAt: null as any,
        updatedAt: null as any,
        deletedAt: null as any,
      });

      expect(dto.createdAt).toBeNull();
      expect(dto.updatedAt).toBeNull();
      expect(dto.deletedAt).toBeNull();
    });
  });

  describe('serialization', () => {
    it('should be serializable to JSON', () => {
      const dto = new ProductResponseDto(mockProductData);
      const jsonString = JSON.stringify(dto);
      const parsed = JSON.parse(jsonString);

      expect(parsed.id).toBe(mockProductData.id);
      expect(parsed.nombre).toBe(mockProductData.nombre);
      expect(parsed.precio).toBe(mockProductData.precio);
      expect(parsed.stock).toBe(mockProductData.stock);
      expect(parsed.descripcion).toBe(mockProductData.descripcion);
      expect(parsed.imagen).toBe(mockProductData.imagen);
      expect(parsed.createdAt).toBe(mockProductData.createdAt.toISOString());
      expect(parsed.updatedAt).toBe(mockProductData.updatedAt.toISOString());
      expect(parsed.deletedAt).toBeUndefined(); // Should be excluded
    });

    it('should exclude deletedAt from JSON', () => {
      const dto = new ProductResponseDto({
        ...mockProductData,
        deletedAt: new Date('2024-12-01T00:00:00.000Z'),
      });

      const jsonString = JSON.stringify(dto);
      const parsed = JSON.parse(jsonString);

      expect(parsed.deletedAt).toBeUndefined();
    });

    it('should serialize partial data correctly', () => {
      const partialDto = new ProductResponseDto({
        id: 'test-id',
        nombre: 'Test Product',
        precio: 10,
        stock: 5,
      });

      const jsonString = JSON.stringify(partialDto);
      const parsed = JSON.parse(jsonString);

      expect(parsed.id).toBe('test-id');
      expect(parsed.nombre).toBe('Test Product');
      expect(parsed.precio).toBe(10);
      expect(parsed.stock).toBe(5);
      expect(parsed.descripcion).toBeUndefined();
      expect(parsed.imagen).toBeUndefined();
      expect(parsed.createdAt).toBeUndefined();
      expect(parsed.updatedAt).toBeUndefined();
    });
  });

  describe('edge cases', () => {
    it('should handle very long strings', () => {
      const longString = 'a'.repeat(1000);
      const dto = new ProductResponseDto({
        ...mockProductData,
        nombre: longString,
        descripcion: longString,
        imagen: longString,
      });

      expect(dto.nombre).toBe(longString);
      expect(dto.descripcion).toBe(longString);
      expect(dto.imagen).toBe(longString);
    });

    it('should handle special characters in nombre', () => {
      const specialNames = [
        'Producto con ñ y ácentos',
        'Product with émojis 🎉',
        'Café & Té',
        'Product (Special) Edition',
      ];

      specialNames.forEach(nombre => {
        const dto = new ProductResponseDto({
          ...mockProductData,
          nombre: nombre,
        });
        expect(dto.nombre).toBe(nombre);
      });
    });

    it('should handle extreme numbers', () => {
      const extremeNumbers = {
        precio: Number.MAX_SAFE_INTEGER,
        stock: Number.MAX_SAFE_INTEGER,
      };

      const dto = new ProductResponseDto({
        ...mockProductData,
        ...extremeNumbers,
      });

      expect(dto.precio).toBe(Number.MAX_SAFE_INTEGER);
      expect(dto.stock).toBe(Number.MAX_SAFE_INTEGER);
    });

    it('should handle floating point precision', () => {
      const floatingPrices = [0.1 + 0.2, 0.3, 1.999999999, 99.999999999];

      floatingPrices.forEach(precio => {
        const dto = new ProductResponseDto({
          ...mockProductData,
          precio: precio,
        });
        expect(dto.precio).toBe(precio);
      });
    });
  });

  describe('Object.assign behavior', () => {
    it('should merge properties correctly using Object.assign', () => {
      const dto = new ProductResponseDto({});
      Object.assign(dto, mockProductData);

      expect(dto.id).toBe(mockProductData.id);
      expect(dto.nombre).toBe(mockProductData.nombre);
      expect(dto.precio).toBe(mockProductData.precio);
      expect(dto.deletedAt).toBeUndefined(); // Should remain excluded
    });

    it('should overwrite existing properties with Object.assign', () => {
      const dto = new ProductResponseDto(mockProductData);
      const newData = {
        nombre: 'Updated Product',
        precio: 199.99,
        stock: 25,
      };

      Object.assign(dto, newData);

      expect(dto.id).toBe(mockProductData.id); // Should remain unchanged
      expect(dto.nombre).toBe('Updated Product'); // Should be updated
      expect(dto.precio).toBe(199.99); // Should be updated
      expect(dto.stock).toBe(25); // Should be updated
    });
  });

  describe('instanceof and constructor', () => {
    it('should be instance of ProductResponseDto', () => {
      const dto = new ProductResponseDto(mockProductData);

      expect(dto instanceof ProductResponseDto).toBe(true);
      expect(dto.constructor.name).toBe('ProductResponseDto');
    });

    it('should have correct prototype chain', () => {
      const dto = new ProductResponseDto(mockProductData);

      expect(Object.getPrototypeOf(dto)).toBe(ProductResponseDto.prototype);
      expect(ProductResponseDto.prototype.constructor.name).toBe('ProductResponseDto');
    });
  });
});
