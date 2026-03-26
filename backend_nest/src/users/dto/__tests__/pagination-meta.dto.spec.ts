import { PaginationMetaDto } from '../pagination-meta.dto';

describe('PaginationMetaDto', () => {
  const completeMeta: PaginationMetaDto = {
    total: 100,
    page: 3,
    limit: 25,
    totalPages: 4,
    hasNextPage: true,
    hasPreviousPage: true,
  };

  describe('constructor', () => {
    it('should create instance with complete data', () => {
      const dto = new PaginationMetaDto(completeMeta);

      expect(dto.total).toBe(100);
      expect(dto.page).toBe(3);
      expect(dto.limit).toBe(25);
      expect(dto.totalPages).toBe(4);
      expect(dto.hasNextPage).toBe(true);
      expect(dto.hasPreviousPage).toBe(true);
    });

    it('should create instance with partial data', () => {
      const partialData = {
        page: 2,
        limit: 10,
      };

      const dto = new PaginationMetaDto(partialData);

      expect(dto.page).toBe(2);
      expect(dto.limit).toBe(10);
      expect(dto.total).toBeUndefined();
      expect(dto.totalPages).toBeUndefined();
      expect(dto.hasNextPage).toBeUndefined();
      expect(dto.hasPreviousPage).toBeUndefined();
    });

    it('should create instance with only required fields', () => {
      const requiredOnly = {
        page: 1,
        limit: 20,
      };

      const dto = new PaginationMetaDto(requiredOnly);

      expect(dto.page).toBe(1);
      expect(dto.limit).toBe(20);
      expect(dto.total).toBeUndefined();
      expect(dto.totalPages).toBeUndefined();
      expect(dto.hasNextPage).toBeUndefined();
      expect(dto.hasPreviousPage).toBeUndefined();
    });

    it('should handle empty constructor', () => {
      const dto = new PaginationMetaDto({});

      expect(dto.page).toBeUndefined();
      expect(dto.limit).toBeUndefined();
      expect(dto.total).toBeUndefined();
      expect(dto.totalPages).toBeUndefined();
      expect(dto.hasNextPage).toBeUndefined();
      expect(dto.hasPreviousPage).toBeUndefined();
    });
  });

  describe('pagination calculations', () => {
    it('should handle first page correctly', () => {
      const firstPage = new PaginationMetaDto({
        total: 50,
        page: 1,
        limit: 10,
        totalPages: 5,
        hasNextPage: true,
        hasPreviousPage: false,
      });

      expect(firstPage.page).toBe(1);
      expect(firstPage.hasPreviousPage).toBe(false);
      expect(firstPage.hasNextPage).toBe(true);
    });

    it('should handle last page correctly', () => {
      const lastPage = new PaginationMetaDto({
        total: 50,
        page: 5,
        limit: 10,
        totalPages: 5,
        hasNextPage: false,
        hasPreviousPage: true,
      });

      expect(lastPage.page).toBe(5);
      expect(lastPage.hasNextPage).toBe(false);
      expect(lastPage.hasPreviousPage).toBe(true);
    });

    it('should handle single page correctly', () => {
      const singlePage = new PaginationMetaDto({
        total: 5,
        page: 1,
        limit: 10,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      });

      expect(singlePage.page).toBe(1);
      expect(singlePage.totalPages).toBe(1);
      expect(singlePage.hasNextPage).toBe(false);
      expect(singlePage.hasPreviousPage).toBe(false);
    });

    it('should handle empty results correctly', () => {
      const emptyResults = new PaginationMetaDto({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      });

      expect(emptyResults.total).toBe(0);
      expect(emptyResults.totalPages).toBe(0);
      expect(emptyResults.hasNextPage).toBe(false);
      expect(emptyResults.hasPreviousPage).toBe(false);
    });
  });

  describe('data types', () => {
    it('should handle numeric values correctly', () => {
      const numericMeta = new PaginationMetaDto({
        total: 1000,
        page: 5,
        limit: 50,
        totalPages: 20,
        hasNextPage: true,
        hasPreviousPage: true,
      });

      expect(typeof numericMeta.total).toBe('number');
      expect(typeof numericMeta.page).toBe('number');
      expect(typeof numericMeta.limit).toBe('number');
      expect(typeof numericMeta.totalPages).toBe('number');
      expect(typeof numericMeta.hasNextPage).toBe('boolean');
      expect(typeof numericMeta.hasPreviousPage).toBe('boolean');
    });

    it('should handle string numbers correctly', () => {
      const stringNumbers = new PaginationMetaDto({
        total: '100' as any,
        page: '2' as any,
        limit: '25' as any,
        totalPages: '4' as any,
      });

      expect(stringNumbers.total).toBe('100');
      expect(stringNumbers.page).toBe('2');
      expect(stringNumbers.limit).toBe('25');
      expect(stringNumbers.totalPages).toBe('4');
    });
  });

  describe('serialization', () => {
    it('should be serializable to JSON', () => {
      const dto = new PaginationMetaDto(completeMeta);
      const jsonString = JSON.stringify(dto);
      const parsed = JSON.parse(jsonString);

      expect(parsed.total).toBe(100);
      expect(parsed.page).toBe(3);
      expect(parsed.limit).toBe(25);
      expect(parsed.totalPages).toBe(4);
      expect(parsed.hasNextPage).toBe(true);
      expect(parsed.hasPreviousPage).toBe(true);
    });

    it('should serialize partial data correctly', () => {
      const partialDto = new PaginationMetaDto({
        page: 1,
        limit: 10,
      });

      const jsonString = JSON.stringify(partialDto);
      const parsed = JSON.parse(jsonString);

      expect(parsed.page).toBe(1);
      expect(parsed.limit).toBe(10);
      expect(parsed.total).toBeUndefined();
      expect(parsed.totalPages).toBeUndefined();
    });
  });

  describe('edge cases', () => {
    it('should handle zero values', () => {
      const zeroValues = new PaginationMetaDto({
        total: 0,
        page: 0,
        limit: 0,
        totalPages: 0,
      });

      expect(zeroValues.total).toBe(0);
      expect(zeroValues.page).toBe(0);
      expect(zeroValues.limit).toBe(0);
      expect(zeroValues.totalPages).toBe(0);
    });

    it('should handle negative values', () => {
      const negativeValues = new PaginationMetaDto({
        total: -1,
        page: -1,
        limit: -1,
        totalPages: -1,
      });

      expect(negativeValues.total).toBe(-1);
      expect(negativeValues.page).toBe(-1);
      expect(negativeValues.limit).toBe(-1);
      expect(negativeValues.totalPages).toBe(-1);
    });

    it('should handle very large numbers', () => {
      const largeNumbers = new PaginationMetaDto({
        total: Number.MAX_SAFE_INTEGER,
        page: 999999,
        limit: 1000,
        totalPages: Number.MAX_SAFE_INTEGER,
      });

      expect(largeNumbers.total).toBe(Number.MAX_SAFE_INTEGER);
      expect(largeNumbers.page).toBe(999999);
      expect(largeNumbers.limit).toBe(1000);
    });

    it('should handle decimal numbers', () => {
      const decimalNumbers = new PaginationMetaDto({
        total: 100.5,
        page: 2.5,
        limit: 10.5,
        totalPages: 9.5,
      });

      expect(decimalNumbers.total).toBe(100.5);
      expect(decimalNumbers.page).toBe(2.5);
      expect(decimalNumbers.limit).toBe(10.5);
      expect(decimalNumbers.totalPages).toBe(9.5);
    });
  });

  describe('boolean handling', () => {
    it('should handle true boolean values', () => {
      const trueValues = new PaginationMetaDto({
        page: 2,
        limit: 10,
        hasNextPage: true,
        hasPreviousPage: true,
      });

      expect(trueValues.hasNextPage).toBe(true);
      expect(trueValues.hasPreviousPage).toBe(true);
      expect(typeof trueValues.hasNextPage).toBe('boolean');
      expect(typeof trueValues.hasPreviousPage).toBe('boolean');
    });

    it('should handle false boolean values', () => {
      const falseValues = new PaginationMetaDto({
        page: 1,
        limit: 10,
        hasNextPage: false,
        hasPreviousPage: false,
      });

      expect(falseValues.hasNextPage).toBe(false);
      expect(falseValues.hasPreviousPage).toBe(false);
      expect(typeof falseValues.hasNextPage).toBe('boolean');
      expect(typeof falseValues.hasPreviousPage).toBe('boolean');
    });

    it('should handle truthy/falsy values', () => {
      const truthyFalsy = new PaginationMetaDto({
        page: 1,
        limit: 10,
        hasNextPage: 1 as any, // truthy
        hasPreviousPage: 0 as any, // falsy
      });

      expect(truthyFalsy.hasNextPage).toBe(1);
      expect(truthyFalsy.hasPreviousPage).toBe(0);
    });
  });
});
