import { Product } from '../product.model';

describe('Product Model', () => {
  const mockProductData = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    nombre: 'Laptop Gaming Pro',
    precio: 1299.99,
    stock: 50,
    descripcion: 'High-performance laptop for gaming and professional work',
    imagen: 'https://example.com/images/laptop-gaming.jpg',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
    deletedAt: undefined,
  };

  describe('model structure', () => {
    it('should have correct table configuration', () => {
      // Test that the Product model extends Sequelize Model
      expect(Product.prototype.constructor.name).toBe('Product');
    });

    it('should have all required fields', () => {
      const product = new Product(mockProductData);

      expect(product.id).toBeDefined();
      expect(product.nombre).toBeDefined();
      expect(product.precio).toBeDefined();
      expect(product.stock).toBeDefined();
      expect(product.descripcion).toBeDefined();
      expect(product.imagen).toBeDefined();
      expect(product.createdAt).toBeDefined();
      expect(product.updatedAt).toBeDefined();
      expect(product.deletedAt).toBeDefined();
    });
  });

  describe('field types and validation', () => {
    it('should handle correct field types', () => {
      const product = new Product(mockProductData);

      expect(typeof product.id).toBe('string');
      expect(typeof product.nombre).toBe('string');
      expect(typeof product.precio).toBe('number');
      expect(typeof product.stock).toBe('number');
      expect(typeof product.descripcion).toBe('string');
      expect(typeof product.imagen).toBe('string');
      expect(product.createdAt instanceof Date).toBe(true);
      expect(product.updatedAt instanceof Date).toBe(true);
    });

    it('should handle UUID format for id', () => {
      const product = new Product(mockProductData);

      expect(product.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should handle nombre validation', () => {
      const product = new Product(mockProductData);

      expect(product.nombre).toBe('Laptop Gaming Pro');
      expect(product.nombre.length).toBeGreaterThan(0);
      expect(typeof product.nombre).toBe('string');
    });

    it('should handle precio validation', () => {
      const product = new Product(mockProductData);

      expect(product.precio).toBe(1299.99);
      expect(product.precio).toBeGreaterThan(0);
      expect(typeof product.precio).toBe('number');
    });

    it('should handle stock validation', () => {
      const product = new Product(mockProductData);

      expect(product.stock).toBe(50);
      expect(product.stock).toBeGreaterThanOrEqual(0);
      expect(typeof product.stock).toBe('number');
    });
  });

  describe('date handling', () => {
    it('should handle Date objects correctly', () => {
      const testDate = new Date('2024-12-25T15:30:00.000Z');
      const productWithDates = {
        ...mockProductData,
        createdAt: testDate,
        updatedAt: testDate,
      };

      const product = new Product(productWithDates);

      expect(product.createdAt).toBe(testDate);
      expect(product.updatedAt).toBe(testDate);
      expect(product.createdAt instanceof Date).toBe(true);
      expect(product.updatedAt instanceof Date).toBe(true);
    });

    it('should handle null deletedAt', () => {
      const productWithNullDeletedAt = {
        ...mockProductData,
        deletedAt: null,
      };

      const product = new Product(productWithNullDeletedAt);

      expect(product.deletedAt).toBeNull();
    });

    it('should handle undefined deletedAt', () => {
      const productWithUndefinedDeletedAt = {
        ...mockProductData,
        deletedAt: undefined,
      };

      const product = new Product(productWithUndefinedDeletedAt);

      expect(product.deletedAt).toBeUndefined();
    });

    it('should handle deletedAt as Date', () => {
      const deletedDate = new Date('2024-06-01T00:00:00.000Z');
      const productWithDeletedAt = {
        ...mockProductData,
        deletedAt: deletedDate,
      };

      const product = new Product(productWithDeletedAt);

      expect(product.deletedAt).toBe(deletedDate);
      expect(product.deletedAt instanceof Date).toBe(true);
    });
  });

  describe('precio handling', () => {
    it('should handle zero precio', () => {
      const productWithZeroPrecio = {
        ...mockProductData,
        precio: 0,
      };

      const product = new Product(productWithZeroPrecio);

      expect(product.precio).toBe(0);
      expect(typeof product.precio).toBe('number');
    });

    it('should handle negative precio', () => {
      const productWithNegativePrecio = {
        ...mockProductData,
        precio: -100,
      };

      const product = new Product(productWithNegativePrecio);

      expect(product.precio).toBe(-100);
      expect(typeof product.precio).toBe('number');
    });

    it('should handle decimal precio', () => {
      const productWithDecimalPrecio = {
        ...mockProductData,
        precio: 99.999,
      };

      const product = new Product(productWithDecimalPrecio);

      expect(product.precio).toBe(99.999);
      expect(typeof product.precio).toBe('number');
    });

    it('should handle very large precio', () => {
      const productWithLargePrecio = {
        ...mockProductData,
        precio: 999999.99,
      };

      const product = new Product(productWithLargePrecio);

      expect(product.precio).toBe(999999.99);
      expect(typeof product.precio).toBe('number');
    });

    it('should handle precio with decimal precision', () => {
      const productWithPrecision = {
        ...mockProductData,
        precio: 1234.56,
      };

      const product = new Product(productWithPrecision);

      expect(product.precio).toBe(1234.56);
      expect(product.precio.toFixed(2)).toBe('1234.56');
    });
  });

  describe('stock handling', () => {
    it('should handle zero stock', () => {
      const productWithZeroStock = {
        ...mockProductData,
        stock: 0,
      };

      const product = new Product(productWithZeroStock);

      expect(product.stock).toBe(0);
      expect(typeof product.stock).toBe('number');
    });

    it('should handle negative stock', () => {
      const productWithNegativeStock = {
        ...mockProductData,
        stock: -10,
      };

      const product = new Product(productWithNegativeStock);

      expect(product.stock).toBe(-10);
      expect(typeof product.stock).toBe('number');
    });

    it('should handle very large stock', () => {
      const productWithLargeStock = {
        ...mockProductData,
        stock: 10000,
      };

      const product = new Product(productWithLargeStock);

      expect(product.stock).toBe(10000);
      expect(typeof product.stock).toBe('number');
    });

    it('should handle integer stock values', () => {
      const productWithIntegerStock = {
        ...mockProductData,
        stock: 42,
      };

      const product = new Product(productWithIntegerStock);

      expect(product.stock).toBe(42);
      expect(Number.isInteger(product.stock)).toBe(true);
    });
  });

  describe('descripcion handling', () => {
    it('should handle null descripcion', () => {
      const productWithNullDescripcion = {
        ...mockProductData,
        descripcion: null,
      };

      const product = new Product(productWithNullDescripcion);

      expect(product.descripcion).toBeNull();
    });

    it('should handle undefined descripcion', () => {
      const productWithUndefinedDescripcion = {
        ...mockProductData,
        descripcion: undefined,
      };

      const product = new Product(productWithUndefinedDescripcion);

      expect(product.descripcion).toBeUndefined();
    });

    it('should handle empty descripcion', () => {
      const productWithEmptyDescripcion = {
        ...mockProductData,
        descripcion: '',
      };

      const product = new Product(productWithEmptyDescripcion);

      expect(product.descripcion).toBe('');
      expect(typeof product.descripcion).toBe('string');
    });

    it('should handle very long descripcion', () => {
      const longDescripcion = 'a'.repeat(1000);
      const productWithLongDescripcion = {
        ...mockProductData,
        descripcion: longDescripcion,
      };

      const product = new Product(productWithLongDescripcion);

      expect(product.descripcion).toBe(longDescripcion);
      expect(typeof product.descripcion).toBe('string');
    });

    it('should handle special characters in descripcion', () => {
      const specialChars = 'Description with émojis 🎉 and special chars: @#$%^&*()';
      const productWithSpecialChars = {
        ...mockProductData,
        descripcion: specialChars,
      };

      const product = new Product(productWithSpecialChars);

      expect(product.descripcion).toBe(specialChars);
      expect(typeof product.descripcion).toBe('string');
    });
  });

  describe('imagen handling', () => {
    it('should handle null imagen', () => {
      const productWithNullImagen = {
        ...mockProductData,
        imagen: null,
      };

      const product = new Product(productWithNullImagen);

      expect(product.imagen).toBeNull();
    });

    it('should handle undefined imagen', () => {
      const productWithUndefinedImagen = {
        ...mockProductData,
        imagen: undefined,
      };

      const product = new Product(productWithUndefinedImagen);

      expect(product.imagen).toBeUndefined();
    });

    it('should handle empty imagen', () => {
      const productWithEmptyImagen = {
        ...mockProductData,
        imagen: '',
      };

      const product = new Product(productWithEmptyImagen);

      expect(product.imagen).toBe('');
      expect(typeof product.imagen).toBe('string');
    });

    it('should handle valid URL imagen', () => {
      const validUrl = 'https://example.com/images/product.jpg';
      const productWithValidUrl = {
        ...mockProductData,
        imagen: validUrl,
      };

      const product = new Product(productWithValidUrl);

      expect(product.imagen).toBe(validUrl);
      expect(typeof product.imagen).toBe('string');
    });

    it('should handle relative path imagen', () => {
      const relativePath = '/images/products/laptop.jpg';
      const productWithRelativePath = {
        ...mockProductData,
        imagen: relativePath,
      };

      const product = new Product(productWithRelativePath);

      expect(product.imagen).toBe(relativePath);
      expect(typeof product.imagen).toBe('string');
    });

    it('should handle special characters in imagen URL', () => {
      const specialUrl = 'https://example.com/images/product-name_123.jpg';
      const productWithSpecialUrl = {
        ...mockProductData,
        imagen: specialUrl,
      };

      const product = new Product(productWithSpecialUrl);

      expect(product.imagen).toBe(specialUrl);
      expect(typeof product.imagen).toBe('string');
    });
  });

  describe('nombre handling', () => {
    it('should handle empty nombre', () => {
      const productWithEmptyNombre = {
        ...mockProductData,
        nombre: '',
      };

      const product = new Product(productWithEmptyNombre);

      expect(product.nombre).toBe('');
      expect(typeof product.nombre).toBe('string');
    });

    it('should handle special characters in nombre', () => {
      const specialChars = 'Product with émojis 🎉 and chars: @#$%^&*()';
      const productWithSpecialChars = {
        ...mockProductData,
        nombre: specialChars,
      };

      const product = new Product(productWithSpecialChars);

      expect(product.nombre).toBe(specialChars);
      expect(typeof product.nombre).toBe('string');
    });

    it('should handle very long nombre', () => {
      const longNombre = 'a'.repeat(200);
      const productWithLongNombre = {
        ...mockProductData,
        nombre: longNombre,
      };

      const product = new Product(productWithLongNombre);

      expect(product.nombre).toBe(longNombre);
      expect(typeof product.nombre).toBe('string');
    });
  });

  describe('serialization', () => {
    it('should be serializable to JSON', () => {
      const product = new Product(mockProductData);
      const jsonString = JSON.stringify(product);
      const parsed = JSON.parse(jsonString);

      expect(parsed.id).toBe(mockProductData.id);
      expect(parsed.nombre).toBe(mockProductData.nombre);
      expect(parsed.precio).toBe(mockProductData.precio);
      expect(parsed.stock).toBe(mockProductData.stock);
      expect(parsed.descripcion).toBe(mockProductData.descripcion);
      expect(parsed.imagen).toBe(mockProductData.imagen);
      expect(parsed.createdAt).toBe(mockProductData.createdAt.toISOString());
      expect(parsed.updatedAt).toBe(mockProductData.updatedAt.toISOString());
      expect(parsed.deletedAt).toBeUndefined();
    });

    it('should serialize partial data correctly', () => {
      const partialProduct = new Product({
        id: 'test-id',
        nombre: 'Keyboard',
        precio: 49.99,
      });

      const jsonString = JSON.stringify(partialProduct);
      const parsed = JSON.parse(jsonString);

      expect(parsed.id).toBe('test-id');
      expect(parsed.nombre).toBe('Keyboard');
      expect(parsed.precio).toBe(49.99);
      expect(parsed.stock).toBeUndefined();
      expect(parsed.descripcion).toBeUndefined();
      expect(parsed.imagen).toBeUndefined();
    });

    it('should handle null values in serialization', () => {
      const productWithNulls = new Product({
        id: 'test-id',
        deletedAt: null,
        descripcion: null,
        imagen: null,
      } as any);

      const jsonString = JSON.stringify(productWithNulls);
      const parsed = JSON.parse(jsonString);

      expect(parsed.id).toBe('test-id');
      expect(parsed.deletedAt).toBe(null);
      expect(parsed.descripcion).toBe(null);
      expect(parsed.imagen).toBe(null);
    });
  });

  describe('edge cases', () => {
    it('should handle minimal data', () => {
      const minimalProduct = new Product({
        id: 'minimal-id',
        nombre: 'Minimal Product',
        precio: 1,
        stock: 1,
      });

      expect(minimalProduct.id).toBe('minimal-id');
      expect(minimalProduct.nombre).toBe('Minimal Product');
      expect(minimalProduct.precio).toBe(1);
      expect(minimalProduct.stock).toBe(1);
      expect(minimalProduct.descripcion).toBeUndefined();
      expect(minimalProduct.imagen).toBeUndefined();
    });

    it('should handle maximum decimal precision', () => {
      const productWithMaxPrecision = {
        ...mockProductData,
        precio: 99999999.99,
      };

      const product = new Product(productWithMaxPrecision);

      expect(product.precio).toBe(99999999.99);
      expect(typeof product.precio).toBe('number');
    });

    it('should handle negative stock edge case', () => {
      const productWithNegativeStock = {
        ...mockProductData,
        stock: -999999,
      };

      const product = new Product(productWithNegativeStock);

      expect(product.stock).toBe(-999999);
      expect(typeof product.stock).toBe('number');
    });
  });

  describe('model methods and behavior', () => {
    it('should handle Sequelize model methods', () => {
      const product = new Product(mockProductData);

      // Test that it's a Sequelize Model instance
      expect(typeof product.save).toBe('function');
      expect(typeof product.reload).toBe('function');
      expect(typeof product.destroy).toBe('function');
      expect(typeof product.update).toBe('function');
    });

    it('should handle dataValues property', () => {
      const product = new Product(mockProductData);

      // Sequelize models have dataValues property
      expect(product.dataValues).toBeDefined();
      expect(typeof product.dataValues).toBe('object');
    });

    it('should handle isNewRecord property', () => {
      const product = new Product(mockProductData);

      // Sequelize models have isNewRecord property
      expect(typeof product.isNewRecord).toBe('boolean');
    });
  });
});
