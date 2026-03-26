import { PaginatedResponseDto } from '../paginated-response.dto';
import { PaginationMetaDto } from '../pagination-meta.dto';

describe('PaginatedResponseDto', () => {
  const mockData = [
    { id: 'item-1', name: 'Item 1' },
    { id: 'item-2', name: 'Item 2' },
    { id: 'item-3', name: 'Item 3' },
  ];

  const mockMeta: PaginationMetaDto = {
    page: 2,
    limit: 10,
    total: 25,
    totalPages: 3,
    hasNextPage: true,
    hasPreviousPage: true,
  };

  describe('constructor', () => {
    it('should create instance with data and meta', () => {
      const dto = new PaginatedResponseDto({ data: mockData, meta: mockMeta });

      expect(dto.data).toEqual(mockData);
      expect(dto.meta).toBeInstanceOf(PaginationMetaDto);
      expect(dto.meta.page).toBe(2);
      expect(dto.meta.limit).toBe(10);
      expect(dto.meta.total).toBe(25);
      expect(dto.meta.totalPages).toBe(3);
      expect(dto.meta.hasNextPage).toBe(true);
      expect(dto.meta.hasPreviousPage).toBe(true);
    });

    it('should create instance with partial data', () => {
      const partialData = [{ id: 'test-item', name: 'Test Item' }];
      const partialMeta = new PaginationMetaDto({ page: 1, limit: 5 });

      const dto = new PaginatedResponseDto({ data: partialData, meta: partialMeta });

      expect(dto.data).toEqual(partialData);
      expect(dto.meta.page).toBe(1);
      expect(dto.meta.limit).toBe(5);
    });

    it('should create instance with empty data', () => {
      const emptyData = [];
      const emptyMeta = { page: 1, limit: 10, total: 0, totalPages: 0, hasNextPage: false, hasPreviousPage: false };

      const dto = new PaginatedResponseDto({ data: emptyData, meta: emptyMeta });

      expect(dto.data).toEqual([]);
      expect(dto.meta.total).toBe(0);
      expect(dto.meta.totalPages).toBe(0);
    });
  });

  describe('data array handling', () => {
    it('should handle multiple items', () => {
      const largeData = Array.from({ length: 100 }, (_, index) => ({
        id: `item-${index}`,
        name: `Item ${index}`,
      }));

      const dto = new PaginatedResponseDto({ data: largeData, meta: mockMeta });

      expect(dto.data).toHaveLength(100);
      expect(dto.data[0].id).toBe('item-0');
      expect(dto.data[99].id).toBe('item-99');
    });

    it('should handle single item array', () => {
      const singleData = [{ id: 'single-item', name: 'Single Item' }];

      const dto = new PaginatedResponseDto({ data: singleData, meta: mockMeta });

      expect(dto.data).toHaveLength(1);
      expect(dto.data[0].id).toBe('single-item');
    });

    it('should handle null data', () => {
      const dto = new PaginatedResponseDto({ data: null as any, meta: mockMeta });

      expect(dto.data).toBeNull();
    });

    it('should handle undefined data', () => {
      const dto = new PaginatedResponseDto({ data: undefined as any, meta: mockMeta });

      expect(dto.data).toBeUndefined();
    });

    it('should handle mixed type data', () => {
      const mixedData = [
        { id: '1', value: 'string' },
        { id: '2', value: 123 },
        { id: '3', value: true },
        { id: '4', value: { nested: 'object' } },
      ];

      const dto = new PaginatedResponseDto({ data: mixedData, meta: mockMeta });

      expect(dto.data).toHaveLength(4);
      expect(typeof dto.data[0].value).toBe('string');
      expect(typeof dto.data[1].value).toBe('number');
      expect(typeof dto.data[2].value).toBe('boolean');
      expect(typeof dto.data[3].value).toBe('object');
    });
  });

  describe('pagination meta handling', () => {
    it('should handle first page meta', () => {
      const firstPageMeta = {
        page: 1,
        limit: 10,
        total: 5,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      };

      const dto = new PaginatedResponseDto({ data: mockData, meta: firstPageMeta });

      expect(dto.meta.page).toBe(1);
      expect(dto.meta.limit).toBe(10);
      expect(dto.meta.total).toBe(5);
      expect(dto.meta.totalPages).toBe(1);
      expect(dto.meta.hasNextPage).toBe(false);
      expect(dto.meta.hasPreviousPage).toBe(false);
    });

    it('should handle middle page meta', () => {
      const middlePageMeta = {
        page: 2,
        limit: 10,
        total: 25,
        totalPages: 3,
        hasNextPage: true,
        hasPreviousPage: true,
      };

      const dto = new PaginatedResponseDto({ data: mockData, meta: middlePageMeta });

      expect(dto.meta.page).toBe(2);
      expect(dto.meta.hasNextPage).toBe(true);
      expect(dto.meta.hasPreviousPage).toBe(true);
    });

    it('should handle last page meta', () => {
      const lastPageMeta = {
        page: 3,
        limit: 10,
        total: 25,
        totalPages: 3,
        hasNextPage: false,
        hasPreviousPage: true,
      };

      const dto = new PaginatedResponseDto({ data: mockData, meta: lastPageMeta });

      expect(dto.meta.page).toBe(3);
      expect(dto.meta.hasNextPage).toBe(false);
      expect(dto.meta.hasPreviousPage).toBe(true);
    });

    it('should handle zero-based pagination', () => {
      const zeroBasedMeta = {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      };

      const dto = new PaginatedResponseDto({ data: [], meta: zeroBasedMeta });

      expect(dto.meta.total).toBe(0);
      expect(dto.meta.totalPages).toBe(0);
      expect(dto.meta.hasNextPage).toBe(false);
      expect(dto.meta.hasPreviousPage).toBe(false);
    });

    it('should handle partial meta', () => {
      const partialMeta = new PaginationMetaDto({ page: 1, limit: 5 });

      const dto = new PaginatedResponseDto({ data: mockData, meta: partialMeta });

      expect(dto.meta.page).toBe(1);
      expect(dto.meta.limit).toBe(5);
      expect(dto.meta.total).toBeUndefined();
      expect(dto.meta.totalPages).toBeUndefined();
    });
  });

  describe('serialization', () => {
    it('should be serializable to JSON', () => {
      const dto = new PaginatedResponseDto({ data: mockData, meta: mockMeta });
      const jsonString = JSON.stringify(dto);
      const parsed = JSON.parse(jsonString);

      expect(Array.isArray(parsed.data)).toBe(true);
      expect(parsed.data).toHaveLength(3);
      expect(parsed.data[0].id).toBe('item-1');
      expect(typeof parsed.meta).toBe('object');
      expect(parsed.meta.page).toBe(2);
      expect(parsed.meta.limit).toBe(10);
      expect(parsed.meta.total).toBe(25);
      expect(parsed.meta.totalPages).toBe(3);
      expect(parsed.meta.hasNextPage).toBe(true);
      expect(parsed.meta.hasPreviousPage).toBe(true);
    });

    it('should serialize empty data correctly', () => {
      const dto = new PaginatedResponseDto({ data: [], meta: mockMeta });
      const jsonString = JSON.stringify(dto);
      const parsed = JSON.parse(jsonString);

      expect(Array.isArray(parsed.data)).toBe(true);
      expect(parsed.data).toHaveLength(0);
      expect(parsed.meta.total).toBe(25);
    });

    it('should serialize partial meta correctly', () => {
      const partialMeta = new PaginationMetaDto({ page: 1, limit: 5 });
      const dto = new PaginatedResponseDto({ data: mockData, meta: partialMeta });
      const jsonString = JSON.stringify(dto);
      const parsed = JSON.parse(jsonString);

      expect(parsed.meta.page).toBe(1);
      expect(parsed.meta.limit).toBe(5);
      expect(parsed.meta.total).toBeUndefined();
    });
  });

  describe('edge cases', () => {
    it('should handle large data arrays', () => {
      const largeData = Array.from({ length: 1000 }, (_, index) => ({
        id: `item-${index}`,
        name: `Item ${index}`,
        value: index * 10,
      }));

      const largeMeta = {
        page: 50,
        limit: 20,
        total: 1000,
        totalPages: 50,
        hasNextPage: false,
        hasPreviousPage: true,
      };

      const dto = new PaginatedResponseDto({ data: largeData, meta: largeMeta });

      expect(dto.data).toHaveLength(1000);
      expect(dto.meta.page).toBe(50);
      expect(dto.meta.totalPages).toBe(50);
    });

    it('should handle extreme pagination values', () => {
      const extremeMeta = {
        page: 999999,
        limit: 1,
        total: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: true,
      };

      const dto = new PaginatedResponseDto({ data: mockData, meta: extremeMeta });

      expect(dto.meta.page).toBe(999999);
      expect(dto.meta.limit).toBe(1);
      expect(dto.meta.totalPages).toBe(1);
    });

    it('should handle negative values (edge case)', () => {
      const negativeMeta = {
        page: -1,
        limit: -10,
        total: -5,
        totalPages: -1,
        hasNextPage: false,
        hasPreviousPage: false,
      };

      const dto = new PaginatedResponseDto({ data: mockData, meta: negativeMeta });

      expect(dto.meta.page).toBe(-1);
      expect(dto.meta.limit).toBe(-10);
      expect(dto.meta.total).toBe(-5);
    });

    it('should handle boolean values correctly', () => {
      const booleanMeta = {
        page: 1,
        limit: 10,
        total: 5,
        totalPages: 1,
        hasNextPage: true,
        hasPreviousPage: true,
      };

      const dto = new PaginatedResponseDto({ data: mockData, meta: booleanMeta });

      expect(dto.meta.hasNextPage).toBe(true);
      expect(dto.meta.hasPreviousPage).toBe(true);
      expect(typeof dto.meta.hasNextPage).toBe('boolean');
      expect(typeof dto.meta.hasPreviousPage).toBe('boolean');
    });
  });

  describe('Object.assign behavior', () => {
    it('should merge properties correctly using Object.assign', () => {
      const dto = new PaginatedResponseDto({ data: [], meta: new PaginationMetaDto({ page: 1, limit: 10 }) });
      Object.assign(dto, { data: mockData, meta: { ...mockMeta } as PaginationMetaDto });

      expect(dto.data).toEqual(mockData);
      expect(dto.meta).toBeInstanceOf(PaginationMetaDto);
    });

    it('should overwrite existing properties with Object.assign', () => {
      const dto = new PaginatedResponseDto({ data: mockData, meta: mockMeta });
      const newData = {
        data: [{ id: 'new-item' }],
        meta: new PaginationMetaDto({ page: 1, limit: 5 }),
      };

      Object.assign(dto, newData);

      expect(dto.data).toEqual([{ id: 'new-item' }]);
      expect(dto.meta.page).toBe(1);
      expect(dto.meta.limit).toBe(5);
      expect(dto.meta.limit).toBe(20);
    });
  });

  describe('generic typing', () => {
    it('should work with different data types', () => {
      const stringData = ['item1', 'item2', 'item3'];
      const numberData = [1, 2, 3];
      const objectData = [{ id: 1 }, { id: 2 }];

      const stringDto = new PaginatedResponseDto<string>({ data: stringData, meta: mockMeta });
      const numberDto = new PaginatedResponseDto<number>({ data: numberData, meta: mockMeta });
      const objectDto = new PaginatedResponseDto<{ id: number }>({ data: objectData, meta: mockMeta });

      expect(stringDto.data).toEqual(stringData);
      expect(numberDto.data).toEqual(numberData);
      expect(objectDto.data).toEqual(objectData);
    });

    it('should maintain type safety', () => {
      const stringDto = new PaginatedResponseDto<string>({ data: mockData as any, meta: mockMeta });

      // TypeScript should enforce that data is treated as string array
      const firstItem: string = stringDto.data[0];
      expect(typeof firstItem).toBe('string');

      // This would cause a TypeScript error if uncommented:
      // const numberItem: number = stringDto.data[0]; // Type 'string' is not assignable to type 'number'
    });
  });
});
