import { ProductEntity } from '../product.entity';

describe('ProductEntity', () => {
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

  describe('constructor', () => {
    it('should create instance with complete data', () => {
      const entity = new ProductEntity(mockProductData);

      expect(entity.id).toBe(mockProductData.id);
      expect(entity.nombre).toBe(mockProductData.nombre);
      expect(entity.precio).toBe(mockProductData.precio);
      expect(entity.stock).toBe(mockProductData.stock);
      expect(entity.descripcion).toBe(mockProductData.descripcion);
      expect(entity.imagen).toBe(mockProductData.imagen);
      expect(entity.createdAt).toBe(mockProductData.createdAt);
      expect(entity.updatedAt).toBe(mockProductData.updatedAt);
      expect(entity.deletedAt).toBe(mockProductData.deletedAt);
    });

    it('should create instance with partial data', () => {
      const partialData = {
        id: 'test-id',
        nombre: 'Mouse Gamer',
        precio: 29.99,
      };

      const entity = new ProductEntity(partialData);

      expect(entity.id).toBe('test-id');
      expect(entity.nombre).toBe('Mouse Gamer');
      expect(entity.precio).toBe(29.99);
      expect(entity.stock).toBeUndefined();
      expect(entity.descripcion).toBeUndefined();
      expect(entity.imagen).toBeUndefined();
    });

    it('should handle empty constructor', () => {
      const entity = new ProductEntity({});

      expect(entity.id).toBeUndefined();
      expect(entity.nombre).toBeUndefined();
      expect(entity.precio).toBeUndefined();
      expect(entity.stock).toBeUndefined();
      expect(entity.descripcion).toBeUndefined();
      expect(entity.imagen).toBeUndefined();
    });
  });

  describe('field types', () => {
    it('should handle correct field types', () => {
      const entity = new ProductEntity(mockProductData);

      expect(typeof entity.id).toBe('string');
      expect(typeof entity.nombre).toBe('string');
      expect(typeof entity.precio).toBe('number');
      expect(typeof entity.stock).toBe('number');
      expect(typeof entity.descripcion).toBe('string');
      expect(typeof entity.imagen).toBe('string');
      expect(entity.createdAt instanceof Date).toBe(true);
      expect(entity.updatedAt instanceof Date).toBe(true);
    });

    it('should handle UUID format for id', () => {
      const entity = new ProductEntity(mockProductData);

      expect(entity.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should handle nombre validation', () => {
      const entity = new ProductEntity(mockProductData);

      expect(entity.nombre).toBe('Laptop Gaming Pro');
      expect(entity.nombre.length).toBeGreaterThan(0);
      expect(typeof entity.nombre).toBe('string');
    });

    it('should handle precio validation', () => {
      const entity = new ProductEntity(mockProductData);

      expect(entity.precio).toBe(1299.99);
      expect(entity.precio).toBeGreaterThan(0);
      expect(typeof entity.precio).toBe('number');
    });

    it('should handle stock validation', () => {
      const entity = new ProductEntity(mockProductData);

      expect(entity.stock).toBe(50);
      expect(entity.stock).toBeGreaterThanOrEqual(0);
      expect(typeof entity.stock).toBe('number');
    });
  });

  describe('date handling', () => {
    it('should handle Date objects correctly', () => {
      const testDate = new Date('2024-12-25T15:30:00.000Z');
      const entityWithDates = {
        ...mockProductData,
        createdAt: testDate,
        updatedAt: testDate,
      };

      const entity = new ProductEntity(entityWithDates);

      expect(entity.createdAt).toBe(testDate);
      expect(entity.updatedAt).toBe(testDate);
      expect(entity.createdAt instanceof Date).toBe(true);
      expect(entity.updatedAt instanceof Date).toBe(true);
    });

    it('should handle null deletedAt', () => {
      const entityWithNullDeletedAt = {
        ...mockProductData,
        deletedAt: null,
      };

      const entity = new ProductEntity(entityWithNullDeletedAt as any);

      expect(entity.deletedAt).toBeNull();
    });

    it('should handle undefined deletedAt', () => {
      const entityWithUndefinedDeletedAt = {
        ...mockProductData,
        deletedAt: undefined,
      };

      const entity = new ProductEntity(entityWithUndefinedDeletedAt);

      expect(entity.deletedAt).toBeUndefined();
    });
  });

  describe('precio handling', () => {
    it('should handle zero precio', () => {
      const entityWithZeroPrecio = {
        ...mockProductData,
        precio: 0,
      };

      const entity = new ProductEntity(entityWithZeroPrecio);

      expect(entity.precio).toBe(0);
      expect(typeof entity.precio).toBe('number');
    });

    it('should handle negative precio', () => {
      const entityWithNegativePrecio = {
        ...mockProductData,
        precio: -100,
      };

      const entity = new ProductEntity(entityWithNegativePrecio);

      expect(entity.precio).toBe(-100);
      expect(typeof entity.precio).toBe('number');
    });

    it('should handle decimal precio', () => {
      const entityWithDecimalPrecio = {
        ...mockProductData,
        precio: 99.999,
      };

      const entity = new ProductEntity(entityWithDecimalPrecio);

      expect(entity.precio).toBe(99.999);
      expect(typeof entity.precio).toBe('number');
    });

    it('should handle very large precio', () => {
      const entityWithLargePrecio = {
        ...mockProductData,
        precio: 999999.99,
      };

      const entity = new ProductEntity(entityWithLargePrecio);

      expect(entity.precio).toBe(999999.99);
      expect(typeof entity.precio).toBe('number');
    });
  });

  describe('stock handling', () => {
    it('should handle zero stock', () => {
      const entityWithZeroStock = {
        ...mockProductData,
        stock: 0,
      };

      const entity = new ProductEntity(entityWithZeroStock);

      expect(entity.stock).toBe(0);
      expect(typeof entity.stock).toBe('number');
    });

    it('should handle negative stock', () => {
      const entityWithNegativeStock = {
        ...mockProductData,
        stock: -10,
      };

      const entity = new ProductEntity(entityWithNegativeStock);

      expect(entity.stock).toBe(-10);
      expect(typeof entity.stock).toBe('number');
    });

    it('should handle very large stock', () => {
      const entityWithLargeStock = {
        ...mockProductData,
        stock: 10000,
      };

      const entity = new ProductEntity(entityWithLargeStock);

      expect(entity.stock).toBe(10000);
      expect(typeof entity.stock).toBe('number');
    });
  });

  describe('descripcion handling', () => {
    it('should handle null descripcion', () => {
      const entityWithNullDescripcion = {
        ...mockProductData,
        descripcion: null,
      };

      const entity = new ProductEntity(entityWithNullDescripcion as any);

      expect(entity.descripcion).toBeNull();
    });

    it('should handle undefined descripcion', () => {
      const entityWithUndefinedDescripcion = {
        ...mockProductData,
        descripcion: undefined,
      };

      const entity = new ProductEntity(entityWithUndefinedDescripcion);

      expect(entity.descripcion).toBeUndefined();
    });

    it('should handle empty descripcion', () => {
      const entityWithEmptyDescripcion = {
        ...mockProductData,
        descripcion: '',
      };

      const entity = new ProductEntity(entityWithEmptyDescripcion);

      expect(entity.descripcion).toBe('');
      expect(typeof entity.descripcion).toBe('string');
    });

    it('should handle very long descripcion', () => {
      const longDescripcion = 'a'.repeat(1000);
      const entityWithLongDescripcion = {
        ...mockProductData,
        descripcion: longDescripcion,
      };

      const entity = new ProductEntity(entityWithLongDescripcion);

      expect(entity.descripcion).toBe(longDescripcion);
      expect(typeof entity.descripcion).toBe('string');
    });
  });

  describe('imagen handling', () => {
    it('should handle null imagen', () => {
      const entityWithNullImagen = {
        ...mockProductData,
        imagen: null,
      };

      const entity = new ProductEntity(entityWithNullImagen as any);

      expect(entity.imagen).toBeNull();
    });

    it('should handle undefined imagen', () => {
      const entityWithUndefinedImagen = {
        ...mockProductData,
        imagen: undefined,
      };

      const entity = new ProductEntity(entityWithUndefinedImagen);

      expect(entity.imagen).toBeUndefined();
    });

    it('should handle empty imagen', () => {
      const entityWithEmptyImagen = {
        ...mockProductData,
        imagen: '',
      };

      const entity = new ProductEntity(entityWithEmptyImagen);

      expect(entity.imagen).toBe('');
      expect(typeof entity.imagen).toBe('string');
    });

    it('should handle valid URL imagen', () => {
      const validUrl = 'https://example.com/images/product.jpg';
      const entityWithValidUrl = {
        ...mockProductData,
        imagen: validUrl,
      };

      const entity = new ProductEntity(entityWithValidUrl);

      expect(entity.imagen).toBe(validUrl);
      expect(typeof entity.imagen).toBe('string');
    });

    it('should handle relative path imagen', () => {
      const relativePath = '/images/products/laptop.jpg';
      const entityWithRelativePath = {
        ...mockProductData,
        imagen: relativePath,
      };

      const entity = new ProductEntity(entityWithRelativePath);

      expect(entity.imagen).toBe(relativePath);
      expect(typeof entity.imagen).toBe('string');
    });
  });

  describe('nombre handling', () => {
    it('should handle empty nombre', () => {
      const entityWithEmptyNombre = {
        ...mockProductData,
        nombre: '',
      };

      const entity = new ProductEntity(entityWithEmptyNombre);

      expect(entity.nombre).toBe('');
      expect(typeof entity.nombre).toBe('string');
    });

    it('should handle special characters in nombre', () => {
      const specialChars = 'Product with émojis 🎉 and chars: @#$%^&*()';
      const entityWithSpecialChars = {
        ...mockProductData,
        nombre: specialChars,
      };

      const entity = new ProductEntity(entityWithSpecialChars);

      expect(entity.nombre).toBe(specialChars);
      expect(typeof entity.nombre).toBe('string');
    });

    it('should handle very long nombre', () => {
      const longNombre = 'a'.repeat(200);
      const entityWithLongNombre = {
        ...mockProductData,
        nombre: longNombre,
      };

      const entity = new ProductEntity(entityWithLongNombre);

      expect(entity.nombre).toBe(longNombre);
      expect(typeof entity.nombre).toBe('string');
    });
  });

  describe('serialization', () => {
    it('should be serializable to JSON', () => {
      const entity = new ProductEntity(mockProductData);
      const jsonString = JSON.stringify(entity);
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
      const partialEntity = new ProductEntity({
        id: 'test-id',
        nombre: 'Keyboard',
        precio: 49.99,
      });

      const jsonString = JSON.stringify(partialEntity);
      const parsed = JSON.parse(jsonString);

      expect(parsed.id).toBe('test-id');
      expect(parsed.nombre).toBe('Keyboard');
      expect(parsed.precio).toBe(49.99);
      expect(parsed.stock).toBeUndefined();
      expect(parsed.descripcion).toBeUndefined();
      expect(parsed.imagen).toBeUndefined();
    });

    it('should handle null values in serialization', () => {
      const entityWithNulls = new ProductEntity({
        id: 'test-id',
        deletedAt: null,
        descripcion: null,
        imagen: null,
      } as any);

      const jsonString = JSON.stringify(entityWithNulls);
      const parsed = JSON.parse(jsonString);

      expect(parsed.id).toBe('test-id');
      expect(parsed.deletedAt).toBe(null);
      expect(parsed.descripcion).toBe(null);
      expect(parsed.imagen).toBe(null);
    });
  });

  describe('edge cases', () => {
    it('should handle special characters in descripcion', () => {
      const specialChars = 'Description with émojis 🎉 and special chars: @#$%^&*()';
      const entityWithSpecialChars = {
        ...mockProductData,
        descripcion: specialChars,
      };

      const entity = new ProductEntity(entityWithSpecialChars);

      expect(entity.descripcion).toBe(specialChars);
      expect(typeof entity.descripcion).toBe('string');
    });

    it('should handle special characters in imagen URL', () => {
      const specialUrl = 'https://example.com/images/product-name_123.jpg';
      const entityWithSpecialUrl = {
        ...mockProductData,
        imagen: specialUrl,
      };

      const entity = new ProductEntity(entityWithSpecialUrl);

      expect(entity.imagen).toBe(specialUrl);
      expect(typeof entity.imagen).toBe('string');
    });

    it('should handle minimal data', () => {
      const minimalEntity = new ProductEntity({
        id: 'minimal-id',
        nombre: 'Minimal Product',
        precio: 1,
        stock: 1,
      });

      expect(minimalEntity.id).toBe('minimal-id');
      expect(minimalEntity.nombre).toBe('Minimal Product');
      expect(minimalEntity.precio).toBe(1);
      expect(minimalEntity.stock).toBe(1);
      expect(minimalEntity.descripcion).toBeUndefined();
      expect(minimalEntity.imagen).toBeUndefined();
    });
  });

  describe('Object.assign behavior', () => {
    it('should merge properties correctly using Object.assign', () => {
      const entity = new ProductEntity({});
      Object.assign(entity, mockProductData);

      expect(entity.id).toBe(mockProductData.id);
      expect(entity.nombre).toBe(mockProductData.nombre);
      expect(entity.precio).toBe(mockProductData.precio);
      expect(entity.stock).toBe(mockProductData.stock);
    });

    it('should overwrite existing properties with Object.assign', () => {
      const entity = new ProductEntity(mockProductData);
      const newData = {
        nombre: 'Updated Product',
        precio: 999.99,
        stock: 100,
      };

      Object.assign(entity, newData);

      expect(entity.id).toBe(mockProductData.id); // Should remain unchanged
      expect(entity.nombre).toBe('Updated Product'); // Should be updated
      expect(entity.precio).toBe(999.99); // Should be updated
      expect(entity.stock).toBe(100); // Should be updated
    });
  });
});
