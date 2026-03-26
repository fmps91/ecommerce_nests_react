import { PaginationMetaDto } from '../pagination-meta.dto';

describe('PaginationMetaDto', () => {
  const mockPaginationMeta = {
    total: 100,
    page: 1,
    limit: 10,
    totalPages: 10,
    hasNextPage: true,
    hasPreviousPage: false,
  };

  describe('constructor', () => {
    it('should create instance with complete data', () => {
      const dto = new PaginationMetaDto(mockPaginationMeta);

      expect(dto.total).toBe(mockPaginationMeta.total);
      expect(dto.page).toBe(mockPaginationMeta.page);
      expect(dto.limit).toBe(mockPaginationMeta.limit);
      expect(dto.totalPages).toBe(mockPaginationMeta.totalPages);
      expect(dto.hasNextPage).toBe(mockPaginationMeta.hasNextPage);
      expect(dto.hasPreviousPage).toBe(mockPaginationMeta.hasPreviousPage);
    });

    it('should create instance with partial data', () => {
      const partialData = {
        page: 2,
        limit: 20,
      };

      const dto = new PaginationMetaDto(partialData);

      expect(dto.page).toBe(2);
      expect(dto.limit).toBe(20);
      expect(dto.total).toBeUndefined();
      expect(dto.totalPages).toBeUndefined();
      expect(dto.hasNextPage).toBeUndefined();
      expect(dto.hasPreviousPage).toBeUndefined();
    });

    it('should handle empty constructor', () => {
      const dto = new PaginationMetaDto({});

      expect(dto.total).toBeUndefined();
      expect(dto.page).toBeUndefined();
      expect(dto.limit).toBeUndefined();
      expect(dto.totalPages).toBeUndefined();
      expect(dto.hasNextPage).toBeUndefined();
      expect(dto.hasPreviousPage).toBeUndefined();
    });

    it('should handle constructor with only required fields', () => {
      const requiredData = {
        page: 1,
        limit: 10,
      };

      const dto = new PaginationMetaDto(requiredData);

      expect(dto.page).toBe(1);
      expect(dto.limit).toBe(10);
      expect(dto.total).toBeUndefined();
      expect(dto.totalPages).toBeUndefined();
      expect(dto.hasNextPage).toBeUndefined();
      expect(dto.hasPreviousPage).toBeUndefined();
    });
  });

  describe('field types', () => {
    it('should handle correct field types', () => {
      const dto = new PaginationMetaDto(mockPaginationMeta);

      expect(typeof dto.total).toBe('number');
      expect(typeof dto.page).toBe('number');
      expect(typeof dto.limit).toBe('number');
      expect(typeof dto.totalPages).toBe('number');
      expect(typeof dto.hasNextPage).toBe('boolean');
      expect(typeof dto.hasPreviousPage).toBe('boolean');
    });

    it('should handle optional fields as undefined', () => {
      const dto = new PaginationMetaDto({
        page: 1,
        limit: 10,
      });

      expect(dto.total).toBeUndefined();
      expect(dto.totalPages).toBeUndefined();
      expect(dto.hasNextPage).toBeUndefined();
      expect(dto.hasPreviousPage).toBeUndefined();
    });

    it('should handle optional fields as null', () => {
      const dto = new PaginationMetaDto({
        page: 1,
        limit: 10,
        total: null as any,
        totalPages: null as any,
        hasNextPage: null as any,
        hasPreviousPage: null as any,
      });

      expect(dto.total).toBeNull();
      expect(dto.totalPages).toBeNull();
      expect(dto.hasNextPage).toBeNull();
      expect(dto.hasPreviousPage).toBeNull();
    });
  });

  describe('page validation', () => {
    it('should handle positive page numbers', () => {
      const positivePages = [1, 2, 5, 10, 100];

      positivePages.forEach(page => {
        const dto = new PaginationMetaDto({
          ...mockPaginationMeta,
          page: page,
        });
        expect(dto.page).toBe(page);
        expect(dto.page).toBeGreaterThan(0);
      });
    });

    it('should handle page number 1', () => {
      const dto = new PaginationMetaDto({
        ...mockPaginationMeta,
        page: 1,
      });
      expect(dto.page).toBe(1);
    });

    it('should handle zero page', () => {
      const dto = new PaginationMetaDto({
        ...mockPaginationMeta,
        page: 0,
      });
      expect(dto.page).toBe(0);
    });

    it('should handle negative page numbers', () => {
      const negativePages = [-1, -5, -10];

      negativePages.forEach(page => {
        const dto = new PaginationMetaDto({
          ...mockPaginationMeta,
          page: page,
        });
        expect(dto.page).toBe(page);
        expect(dto.page).toBeLessThan(0);
      });
    });
  });

  describe('limit validation', () => {
    it('should handle positive limit values', () => {
      const positiveLimits = [1, 5, 10, 25, 50, 100];

      positiveLimits.forEach(limit => {
        const dto = new PaginationMetaDto({
          ...mockPaginationMeta,
          limit: limit,
        });
        expect(dto.limit).toBe(limit);
        expect(dto.limit).toBeGreaterThan(0);
      });
    });

    it('should handle limit of 1', () => {
      const dto = new PaginationMetaDto({
        ...mockPaginationMeta,
        limit: 1,
      });
      expect(dto.limit).toBe(1);
    });

    it('should handle zero limit', () => {
      const dto = new PaginationMetaDto({
        ...mockPaginationMeta,
        limit: 0,
      });
      expect(dto.limit).toBe(0);
    });

    it('should handle negative limit values', () => {
      const negativeLimits = [-1, -5, -10];

      negativeLimits.forEach(limit => {
        const dto = new PaginationMetaDto({
          ...mockPaginationMeta,
          limit: limit,
        });
        expect(dto.limit).toBe(limit);
        expect(dto.limit).toBeLessThan(0);
      });
    });
  });

  describe('total validation', () => {
    it('should handle positive total values', () => {
      const positiveTotals = [0, 1, 10, 100, 1000, 999999];

      positiveTotals.forEach(total => {
        const dto = new PaginationMetaDto({
          ...mockPaginationMeta,
          total: total,
        });
        expect(dto.total).toBe(total);
        expect(dto.total).toBeGreaterThanOrEqual(0);
      });
    });

    it('should handle zero total', () => {
      const dto = new PaginationMetaDto({
        ...mockPaginationMeta,
        total: 0,
      });
      expect(dto.total).toBe(0);
    });

    it('should handle negative total values', () => {
      const negativeTotals = [-1, -10, -100];

      negativeTotals.forEach(total => {
        const dto = new PaginationMetaDto({
          ...mockPaginationMeta,
          total: total,
        });
        expect(dto.total).toBe(total);
        expect(dto.total).toBeLessThan(0);
      });
    });
  });

  describe('totalPages validation', () => {
    it('should handle positive totalPages values', () => {
      const positiveTotalPages = [1, 5, 10, 100, 1000];

      positiveTotalPages.forEach(totalPages => {
        const dto = new PaginationMetaDto({
          ...mockPaginationMeta,
          totalPages: totalPages,
        });
        expect(dto.totalPages).toBe(totalPages);
        expect(dto.totalPages).toBeGreaterThan(0);
      });
    });

    it('should handle zero totalPages', () => {
      const dto = new PaginationMetaDto({
        ...mockPaginationMeta,
        totalPages: 0,
      });
      expect(dto.totalPages).toBe(0);
    });

    it('should handle negative totalPages values', () => {
      const negativeTotalPages = [-1, -5, -10];

      negativeTotalPages.forEach(totalPages => {
        const dto = new PaginationMetaDto({
          ...mockPaginationMeta,
          totalPages: totalPages,
        });
        expect(dto.totalPages).toBe(totalPages);
        expect(dto.totalPages).toBeLessThan(0);
      });
    });
  });

  describe('boolean fields validation', () => {
    it('should handle hasNextPage true', () => {
      const dto = new PaginationMetaDto({
        ...mockPaginationMeta,
        hasNextPage: true,
      });
      expect(dto.hasNextPage).toBe(true);
    });

    it('should handle hasNextPage false', () => {
      const dto = new PaginationMetaDto({
        ...mockPaginationMeta,
        hasNextPage: false,
      });
      expect(dto.hasNextPage).toBe(false);
    });

    it('should handle hasPreviousPage true', () => {
      const dto = new PaginationMetaDto({
        ...mockPaginationMeta,
        hasPreviousPage: true,
      });
      expect(dto.hasPreviousPage).toBe(true);
    });

    it('should handle hasPreviousPage false', () => {
      const dto = new PaginationMetaDto({
        ...mockPaginationMeta,
        hasPreviousPage: false,
      });
      expect(dto.hasPreviousPage).toBe(false);
    });
  });

  describe('pagination logic scenarios', () => {
    it('should handle first page scenario', () => {
      const firstPageMeta = {
        total: 100,
        page: 1,
        limit: 10,
        totalPages: 10,
        hasNextPage: true,
        hasPreviousPage: false,
      };

      const dto = new PaginationMetaDto(firstPageMeta);

      expect(dto.page).toBe(1);
      expect(dto.hasPreviousPage).toBe(false);
      expect(dto.hasNextPage).toBe(true);
    });

    it('should handle last page scenario', () => {
      const lastPageMeta = {
        total: 100,
        page: 10,
        limit: 10,
        totalPages: 10,
        hasNextPage: false,
        hasPreviousPage: true,
      };

      const dto = new PaginationMetaDto(lastPageMeta);

      expect(dto.page).toBe(10);
      expect(dto.hasNextPage).toBe(false);
      expect(dto.hasPreviousPage).toBe(true);
    });

    it('should handle single page scenario', () => {
      const singlePageMeta = {
        total: 5,
        page: 1,
        limit: 10,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      };

      const dto = new PaginationMetaDto(singlePageMeta);

      expect(dto.totalPages).toBe(1);
      expect(dto.hasNextPage).toBe(false);
      expect(dto.hasPreviousPage).toBe(false);
    });

    it('should handle middle page scenario', () => {
      const middlePageMeta = {
        total: 100,
        page: 5,
        limit: 10,
        totalPages: 10,
        hasNextPage: true,
        hasPreviousPage: true,
      };

      const dto = new PaginationMetaDto(middlePageMeta);

      expect(dto.page).toBe(5);
      expect(dto.hasNextPage).toBe(true);
      expect(dto.hasPreviousPage).toBe(true);
    });

    it('should handle empty results scenario', () => {
      const emptyResultsMeta = {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      };

      const dto = new PaginationMetaDto(emptyResultsMeta);

      expect(dto.total).toBe(0);
      expect(dto.totalPages).toBe(0);
      expect(dto.hasNextPage).toBe(false);
      expect(dto.hasPreviousPage).toBe(false);
    });
  });

  describe('serialization', () => {
    it('should be serializable to JSON', () => {
      const dto = new PaginationMetaDto(mockPaginationMeta);
      const jsonString = JSON.stringify(dto);
      const parsed = JSON.parse(jsonString);

      expect(parsed.total).toBe(mockPaginationMeta.total);
      expect(parsed.page).toBe(mockPaginationMeta.page);
      expect(parsed.limit).toBe(mockPaginationMeta.limit);
      expect(parsed.totalPages).toBe(mockPaginationMeta.totalPages);
      expect(parsed.hasNextPage).toBe(mockPaginationMeta.hasNextPage);
      expect(parsed.hasPreviousPage).toBe(mockPaginationMeta.hasPreviousPage);
    });

    it('should serialize partial data correctly', () => {
      const partialDto = new PaginationMetaDto({
        page: 2,
        limit: 20,
      });

      const jsonString = JSON.stringify(partialDto);
      const parsed = JSON.parse(jsonString);

      expect(parsed.page).toBe(2);
      expect(parsed.limit).toBe(20);
      expect(parsed.total).toBeUndefined();
      expect(parsed.totalPages).toBeUndefined();
      expect(parsed.hasNextPage).toBeUndefined();
      expect(parsed.hasPreviousPage).toBeUndefined();
    });

    it('should handle null values in serialization', () => {
      const dtoWithNulls = new PaginationMetaDto({
        page: 1,
        limit: 10,
        total: null as any,
        totalPages: null as any,
        hasNextPage: null as any,
        hasPreviousPage: null as any,
      });

      const jsonString = JSON.stringify(dtoWithNulls);
      const parsed = JSON.parse(jsonString);

      expect(parsed.page).toBe(1);
      expect(parsed.limit).toBe(10);
      expect(parsed.total).toBe(null);
      expect(parsed.totalPages).toBe(null);
      expect(parsed.hasNextPage).toBe(null);
      expect(parsed.hasPreviousPage).toBe(null);
    });
  });

  describe('edge cases', () => {
    it('should handle very large numbers', () => {
      const largeNumbers = {
        total: Number.MAX_SAFE_INTEGER,
        page: 1000000,
        limit: 1000000,
        totalPages: 1000000,
      };

      const dto = new PaginationMetaDto(largeNumbers);

      expect(dto.total).toBe(Number.MAX_SAFE_INTEGER);
      expect(dto.page).toBe(1000000);
      expect(dto.limit).toBe(1000000);
      expect(dto.totalPages).toBe(1000000);
    });

    it('should handle decimal numbers', () => {
      const decimalNumbers = {
        total: 100.5,
        page: 1.5,
        limit: 10.5,
        totalPages: 10.5,
      };

      const dto = new PaginationMetaDto(decimalNumbers);

      expect(dto.total).toBe(100.5);
      expect(dto.page).toBe(1.5);
      expect(dto.limit).toBe(10.5);
      expect(dto.totalPages).toBe(10.5);
    });

    it('should handle extreme pagination scenarios', () => {
      const extremeScenarios = [
        { total: 1, page: 1, limit: 1, totalPages: 1, hasNextPage: false, hasPreviousPage: false },
        { total: 1000000, page: 50000, limit: 20, totalPages: 50000, hasNextPage: false, hasPreviousPage: true },
        { total: 0, page: 1, limit: 50, totalPages: 0, hasNextPage: false, hasPreviousPage: false },
      ];

      extremeScenarios.forEach(scenario => {
        const dto = new PaginationMetaDto(scenario);
        expect(dto.total).toBe(scenario.total);
        expect(dto.page).toBe(scenario.page);
        expect(dto.limit).toBe(scenario.limit);
        expect(dto.totalPages).toBe(scenario.totalPages);
        expect(dto.hasNextPage).toBe(scenario.hasNextPage);
        expect(dto.hasPreviousPage).toBe(scenario.hasPreviousPage);
      });
    });
  });

  describe('Object.assign behavior', () => {
    it('should merge properties correctly using Object.assign', () => {
      const dto = new PaginationMetaDto({});
      Object.assign(dto, mockPaginationMeta);

      expect(dto.total).toBe(mockPaginationMeta.total);
      expect(dto.page).toBe(mockPaginationMeta.page);
      expect(dto.limit).toBe(mockPaginationMeta.limit);
      expect(dto.totalPages).toBe(mockPaginationMeta.totalPages);
      expect(dto.hasNextPage).toBe(mockPaginationMeta.hasNextPage);
      expect(dto.hasPreviousPage).toBe(mockPaginationMeta.hasPreviousPage);
    });

    it('should overwrite existing properties with Object.assign', () => {
      const dto = new PaginationMetaDto(mockPaginationMeta);
      const newData = {
        page: 5,
        limit: 25,
        hasNextPage: false,
      };

      Object.assign(dto, newData);

      expect(dto.total).toBe(mockPaginationMeta.total); // Should remain unchanged
      expect(dto.page).toBe(5); // Should be updated
      expect(dto.limit).toBe(25); // Should be updated
      expect(dto.hasNextPage).toBe(false); // Should be updated
    });
  });

  describe('instanceof and constructor', () => {
    it('should be instance of PaginationMetaDto', () => {
      const dto = new PaginationMetaDto(mockPaginationMeta);

      expect(dto instanceof PaginationMetaDto).toBe(true);
      expect(dto.constructor.name).toBe('PaginationMetaDto');
    });

    it('should have correct prototype chain', () => {
      const dto = new PaginationMetaDto(mockPaginationMeta);

      expect(Object.getPrototypeOf(dto)).toBe(PaginationMetaDto.prototype);
      expect(PaginationMetaDto.prototype.constructor.name).toBe('PaginationMetaDto');
    });
  });
});
