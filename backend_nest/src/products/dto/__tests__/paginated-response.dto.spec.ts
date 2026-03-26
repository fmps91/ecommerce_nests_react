import { PaginatedResponseDto } from '../paginated-response.dto';
import { PaginationMetaDto } from '../pagination-meta.dto';

// Mock data for testing
interface MockProduct {
  id: string;
  nombre: string;
  precio: number;
  stock: number;
}

describe('PaginatedResponseDto', () => {
  const mockProducts: MockProduct[] = [
    { id: '1', nombre: 'Producto 1', precio: 10.99, stock: 5 },
    { id: '2', nombre: 'Producto 2', precio: 20.99, stock: 10 },
    { id: '3', nombre: 'Producto 3', precio: 30.99, stock: 15 },
  ];

  const mockPaginationMeta = {
    total: 100,
    page: 1,
    limit: 10,
    totalPages: 10,
    hasNextPage: true,
    hasPreviousPage: false,
  };

  const mockPaginatedResponse = {
    data: mockProducts,
    meta: mockPaginationMeta,
  };

  describe('constructor', () => {
    it('should create instance with complete data', () => {
      const dto = new PaginatedResponseDto<MockProduct>(mockPaginatedResponse);

      expect(dto.data).toEqual(mockProducts);
      expect(dto.meta).toBeInstanceOf(PaginationMetaDto);
      expect(dto.meta.total).toBe(mockPaginationMeta.total);
      expect(dto.meta.page).toBe(mockPaginationMeta.page);
      expect(dto.meta.limit).toBe(mockPaginationMeta.limit);
      expect(dto.meta.totalPages).toBe(mockPaginationMeta.totalPages);
      expect(dto.meta.hasNextPage).toBe(mockPaginationMeta.hasNextPage);
      expect(dto.meta.hasPreviousPage).toBe(mockPaginationMeta.hasPreviousPage);
    });

    it('should create instance with partial data', () => {
      const partialData: Partial<PaginatedResponseDto<MockProduct>> = {
        data: [mockProducts[0]],
        meta: new PaginationMetaDto({
          page: 1,
          limit: 5,
        }),
      };

      const dto = new PaginatedResponseDto<MockProduct>(partialData);

      expect(dto.data).toHaveLength(1);
      expect(dto.data[0]).toEqual(mockProducts[0]);
      expect(dto.meta).toBeInstanceOf(PaginationMetaDto);
      expect(dto.meta.page).toBe(1);
      expect(dto.meta.limit).toBe(5);
      expect(dto.meta.total).toBeUndefined();
      expect(dto.meta.totalPages).toBeUndefined();
      expect(dto.meta.hasNextPage).toBeUndefined();
      expect(dto.meta.hasPreviousPage).toBeUndefined();
    });

    it('should handle empty constructor', () => {
      const dto = new PaginatedResponseDto<MockProduct>({});

      expect(dto.data).toBeUndefined();
      expect(dto.meta).toBeUndefined();
    });

    it('should handle constructor with only data', () => {
      const dto = new PaginatedResponseDto<MockProduct>({
        data: mockProducts,
      });

      expect(dto.data).toEqual(mockProducts);
      expect(dto.meta).toBeUndefined();
    });

    it('should handle constructor with only meta', () => {
      const dto = new PaginatedResponseDto<MockProduct>({
        meta: mockPaginationMeta,
      });

      expect(dto.data).toBeUndefined();
      expect(dto.meta).toBeInstanceOf(PaginationMetaDto);
      expect(dto.meta.page).toBe(mockPaginationMeta.page);
    });
  });

  describe('data field', () => {
    it('should handle array of objects', () => {
      const dto = new PaginatedResponseDto<MockProduct>(mockPaginatedResponse);

      expect(Array.isArray(dto.data)).toBe(true);
      expect(dto.data).toHaveLength(mockProducts.length);
      expect(dto.data[0]).toEqual(mockProducts[0]);
      expect(dto.data[1]).toEqual(mockProducts[1]);
      expect(dto.data[2]).toEqual(mockProducts[2]);
    });

    it('should handle empty array', () => {
      const dto = new PaginatedResponseDto<MockProduct>({
        data: [],
        meta: mockPaginationMeta,
      });

      expect(dto.data).toHaveLength(0);
      expect(Array.isArray(dto.data)).toBe(true);
    });

    it('should handle single item array', () => {
      const dto = new PaginatedResponseDto<MockProduct>({
        data: [mockProducts[0]],
        meta: mockPaginationMeta,
      });

      expect(dto.data).toHaveLength(1);
      expect(dto.data[0]).toEqual(mockProducts[0]);
    });

    it('should handle large arrays', () => {
      const largeArray = Array.from({ length: 1000 }, (_, i) => ({
        id: `${i + 1}`,
        nombre: `Producto ${i + 1}`,
        precio: (i + 1) * 10,
        stock: i + 1,
      }));

      const dto = new PaginatedResponseDto<MockProduct>({
        data: largeArray,
        meta: mockPaginationMeta,
      });

      expect(dto.data).toHaveLength(1000);
      expect(dto.data[0].id).toBe('1');
      expect(dto.data[999].id).toBe('1000');
    });

    it('should handle null data', () => {
      const dto = new PaginatedResponseDto<MockProduct>({
        data: null as any,
        meta: mockPaginationMeta,
      });

      expect(dto.data).toBeNull();
    });

    it('should handle undefined data', () => {
      const dto = new PaginatedResponseDto<MockProduct>({
        data: undefined,
        meta: mockPaginationMeta,
      });

      expect(dto.data).toBeUndefined();
    });
  });

  describe('meta field', () => {
    it('should create PaginationMetaDto instance', () => {
      const dto = new PaginatedResponseDto<MockProduct>(mockPaginatedResponse);

      expect(dto.meta).toBeInstanceOf(PaginationMetaDto);
      expect(dto.meta.total).toBe(mockPaginationMeta.total);
      expect(dto.meta.page).toBe(mockPaginationMeta.page);
      expect(dto.meta.limit).toBe(mockPaginationMeta.limit);
    });

    it('should handle partial meta data', () => {
      const partialMeta = new PaginationMetaDto({ page: 2, limit: 20 });
      const dto = new PaginatedResponseDto<MockProduct>({
        data: mockProducts,
        meta: partialMeta,
      });

      expect(dto.meta).toBeInstanceOf(PaginationMetaDto);
      expect(dto.meta.page).toBe(2);
      expect(dto.meta.limit).toBe(20);
      expect(dto.meta.total).toBeUndefined();
      expect(dto.meta.totalPages).toBeUndefined();
    });

    it('should handle null meta', () => {
      const dto = new PaginatedResponseDto<MockProduct>({
        data: mockProducts,
        meta: null as any,
      });

      expect(dto.meta).toBeNull();
    });

    it('should handle undefined meta', () => {
      const dto = new PaginatedResponseDto<MockProduct>({
        data: mockProducts,
        meta: undefined,
      });

      expect(dto.meta).toBeUndefined();
    });
  });

  describe('generic type support', () => {
    it('should work with different data types', () => {
      // Test with string array
      const stringDto = new PaginatedResponseDto<string>({
        data: ['item1', 'item2', 'item3'],
        meta: mockPaginationMeta,
      });

      expect(stringDto.data).toHaveLength(3);
      expect(typeof stringDto.data[0]).toBe('string');

      // Test with number array
      const numberDto = new PaginatedResponseDto<number>({
        data: [1, 2, 3, 4, 5],
        meta: mockPaginationMeta,
      });

      expect(numberDto.data).toHaveLength(5);
      expect(typeof numberDto.data[0]).toBe('number');

      // Test with complex object
      interface ComplexObject {
        id: string;
        name: string;
        properties: {
          color: string;
          size: number;
        };
      }

      const complexData: ComplexObject[] = [
        { id: '1', name: 'Object 1', properties: { color: 'red', size: 10 } },
        { id: '2', name: 'Object 2', properties: { color: 'blue', size: 20 } },
      ];

      const complexDto = new PaginatedResponseDto<ComplexObject>({
        data: complexData,
        meta: mockPaginationMeta,
      });

      expect(complexDto.data).toHaveLength(2);
      expect(complexDto.data[0].properties.color).toBe('red');
      expect(complexDto.data[1].properties.size).toBe(20);
    });
  });

  describe('pagination scenarios', () => {
    it('should handle first page scenario', () => {
      const firstPageResponse = {
        data: mockProducts.slice(0, 2),
        meta: {
          total: 100,
          page: 1,
          limit: 10,
          totalPages: 10,
          hasNextPage: true,
          hasPreviousPage: false,
        },
      };

      const dto = new PaginatedResponseDto<MockProduct>(firstPageResponse);

      expect(dto.meta.page).toBe(1);
      expect(dto.meta.hasPreviousPage).toBe(false);
      expect(dto.meta.hasNextPage).toBe(true);
      expect(dto.data).toHaveLength(2);
    });

    it('should handle last page scenario', () => {
      const lastPageResponse = {
        data: [mockProducts[2]],
        meta: {
          total: 100,
          page: 10,
          limit: 10,
          totalPages: 10,
          hasNextPage: false,
          hasPreviousPage: true,
        },
      };

      const dto = new PaginatedResponseDto<MockProduct>(lastPageResponse);

      expect(dto.meta.page).toBe(10);
      expect(dto.meta.hasNextPage).toBe(false);
      expect(dto.meta.hasPreviousPage).toBe(true);
      expect(dto.data).toHaveLength(1);
    });

    it('should handle single page scenario', () => {
      const singlePageResponse = {
        data: mockProducts,
        meta: {
          total: 3,
          page: 1,
          limit: 10,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };

      const dto = new PaginatedResponseDto<MockProduct>(singlePageResponse);

      expect(dto.meta.totalPages).toBe(1);
      expect(dto.meta.hasNextPage).toBe(false);
      expect(dto.meta.hasPreviousPage).toBe(false);
      expect(dto.data).toHaveLength(3);
    });

    it('should handle empty results scenario', () => {
      const emptyResultsResponse = {
        data: [],
        meta: {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };

      const dto = new PaginatedResponseDto<MockProduct>(emptyResultsResponse);

      expect(dto.meta.total).toBe(0);
      expect(dto.meta.totalPages).toBe(0);
      expect(dto.data).toHaveLength(0);
    });
  });

  describe('serialization', () => {
    it('should be serializable to JSON', () => {
      const dto = new PaginatedResponseDto<MockProduct>(mockPaginatedResponse);
      const jsonString = JSON.stringify(dto);
      const parsed = JSON.parse(jsonString);

      expect(Array.isArray(parsed.data)).toBe(true);
      expect(parsed.data).toHaveLength(mockProducts.length);
      expect(parsed.data[0].id).toBe(mockProducts[0].id);
      expect(parsed.data[0].nombre).toBe(mockProducts[0].nombre);
      
      expect(parsed.meta).toBeDefined();
      expect(parsed.meta.total).toBe(mockPaginationMeta.total);
      expect(parsed.meta.page).toBe(mockPaginationMeta.page);
      expect(parsed.meta.limit).toBe(mockPaginationMeta.limit);
      expect(parsed.meta.totalPages).toBe(mockPaginationMeta.totalPages);
      expect(parsed.meta.hasNextPage).toBe(mockPaginationMeta.hasNextPage);
      expect(parsed.meta.hasPreviousPage).toBe(mockPaginationMeta.hasPreviousPage);
    });

    it('should serialize partial data correctly', () => {
      const partialDto = new PaginatedResponseDto<MockProduct>({
        data: [mockProducts[0]],
        meta: new PaginationMetaDto({ page: 1, limit: 5 }),
      });

      const jsonString = JSON.stringify(partialDto);
      const parsed = JSON.parse(jsonString);

      expect(parsed.data).toHaveLength(1);
      expect(parsed.data[0].id).toBe(mockProducts[0].id);
      
      expect(parsed.meta.page).toBe(1);
      expect(parsed.meta.limit).toBe(5);
      expect(parsed.meta.total).toBeUndefined();
      expect(parsed.meta.totalPages).toBeUndefined();
    });

    it('should handle null values in serialization', () => {
      const dtoWithNulls = new PaginatedResponseDto<MockProduct>({
        data: null as any,
        meta: null as any,
      });

      const jsonString = JSON.stringify(dtoWithNulls);
      const parsed = JSON.parse(jsonString);

      expect(parsed.data).toBe(null);
      expect(parsed.meta).toBe(null);
    });
  });

  describe('edge cases', () => {
    it('should handle very large data arrays', () => {
      const largeData = Array.from({ length: 10000 }, (_, i) => ({
        id: `${i + 1}`,
        nombre: `Producto ${i + 1}`,
        precio: (i + 1) * 0.99,
        stock: i + 1,
      }));

      const dto = new PaginatedResponseDto<MockProduct>({
        data: largeData,
        meta: {
          total: 10000,
          page: 1,
          limit: 100,
          totalPages: 100,
          hasNextPage: true,
          hasPreviousPage: false,
        },
      });

      expect(dto.data).toHaveLength(10000);
      expect(dto.meta.total).toBe(10000);
      expect(dto.meta.totalPages).toBe(100);
    });

    it('should handle complex nested objects', () => {
      interface NestedProduct extends MockProduct {
        category: {
          id: string;
          name: string;
          subcategories: string[];
        };
        tags: string[];
        specifications: Record<string, any>;
      }

      const nestedProducts: NestedProduct[] = [
        {
          ...mockProducts[0],
          category: {
            id: 'cat1',
            name: 'Electrónicos',
            subcategories: ['Telefonía', 'Computación'],
          },
          tags: ['nuevo', 'popular'],
          specifications: { color: 'negro', peso: '200g' },
        },
      ];

      const dto = new PaginatedResponseDto<NestedProduct>({
        data: nestedProducts,
        meta: mockPaginationMeta,
      });

      expect(dto.data).toHaveLength(1);
      expect(dto.data[0].category.name).toBe('Electrónicos');
      expect(dto.data[0].tags).toContain('nuevo');
      expect(dto.data[0].specifications.color).toBe('negro');
    });

    it('should handle mixed data types in array', () => {
      const mixedData = [
        { id: '1', value: 'string' },
        { id: '2', value: 123 },
        { id: '3', value: true },
        { id: '4', value: null },
        { id: '5', value: { nested: 'object' } },
      ];

      const dto = new PaginatedResponseDto<any>({
        data: mixedData,
        meta: mockPaginationMeta,
      });

      expect(dto.data).toHaveLength(5);
      expect(typeof dto.data[0].value).toBe('string');
      expect(typeof dto.data[1].value).toBe('number');
      expect(typeof dto.data[2].value).toBe('boolean');
      expect(dto.data[3].value).toBeNull();
      expect(typeof dto.data[4].value).toBe('object');
    });
  });

  describe('Object.assign behavior', () => {
    it('should merge properties correctly using Object.assign', () => {
      const dto = new PaginatedResponseDto<MockProduct>({});
      Object.assign(dto, mockPaginatedResponse);

      expect(dto.data).toEqual(mockProducts);
      expect(dto.meta).toBeInstanceOf(PaginationMetaDto);
      expect(dto.meta.total).toBe(mockPaginationMeta.total);
    });

    it('should overwrite existing properties with Object.assign', () => {
      const dto = new PaginatedResponseDto<MockProduct>(mockPaginatedResponse);
      const newData = {
        data: [mockProducts[0]],
        meta: new PaginationMetaDto({
          page: 5,
          limit: 25,
        }),
      };

      Object.assign(dto, newData);

      expect(dto.data).toHaveLength(1);
      expect(dto.data[0]).toEqual(mockProducts[0]);
      expect(dto.meta.page).toBe(5);
      expect(dto.meta.limit).toBe(25);
      expect(dto.meta.total).toBe(mockPaginationMeta.total); // Should remain unchanged
    });
  });

  describe('instanceof and constructor', () => {
    it('should be instance of PaginatedResponseDto', () => {
      const dto = new PaginatedResponseDto<MockProduct>(mockPaginatedResponse);

      expect(dto instanceof PaginatedResponseDto).toBe(true);
      expect(dto.constructor.name).toBe('PaginatedResponseDto');
    });

    it('should have correct prototype chain', () => {
      const dto = new PaginatedResponseDto<MockProduct>(mockPaginatedResponse);

      expect(Object.getPrototypeOf(dto)).toBe(PaginatedResponseDto.prototype);
      expect(PaginatedResponseDto.prototype.constructor.name).toBe('PaginatedResponseDto');
    });

    it('should maintain generic type information', () => {
      const dto = new PaginatedResponseDto<MockProduct>(mockPaginatedResponse);

      // TypeScript should infer the correct type
      expect(dto.data[0].nombre).toBeDefined();
      expect(dto.data[0].precio).toBeDefined();
      expect(dto.data[0].stock).toBeDefined();
    });
  });

  describe('Type transformation', () => {
    it('should work with @Type decorator for meta field', () => {
      const dto = new PaginatedResponseDto<MockProduct>({
        data: mockProducts,
        meta: mockPaginationMeta,
      });

      // The @Type decorator should ensure meta is properly instantiated
      expect(dto.meta).toBeInstanceOf(PaginationMetaDto);
      expect(typeof dto.meta.total).toBe('number');
      expect(typeof dto.meta.page).toBe('number');
      expect(typeof dto.meta.hasNextPage).toBe('boolean');
    });

    it('should handle meta as plain object when @Type is not applied', () => {
      // This test documents the behavior when @Type decorator is working correctly
      const plainMeta = {
        ...mockPaginationMeta,
      } as any; // Simulate plain object

      const dto = new PaginatedResponseDto<MockProduct>({
        data: mockProducts,
        meta: plainMeta,
      });

      // Should still be properly typed due to @Type decorator
      expect(dto.meta).toBeInstanceOf(PaginationMetaDto);
    });
  });
});
