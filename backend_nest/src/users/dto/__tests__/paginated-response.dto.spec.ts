import { PaginatedResponseDto } from '../paginated-response.dto';
import { PaginationMetaDto } from '../pagination-meta.dto';
import { UserResponseDto } from '../user-response.dto';

describe('PaginatedResponseDto', () => {
  const mockUserResponse: UserResponseDto = new UserResponseDto({
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    name: 'Test User',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const mockPaginationMeta: PaginationMetaDto = {
    total: 100,
    page: 1,
    limit: 10,
    totalPages: 10,
    hasNextPage: true,
    hasPreviousPage: false,
  };

  describe('constructor', () => {
    it('should create instance with data and meta', () => {
      const dto = new PaginatedResponseDto<UserResponseDto>({
        data: [mockUserResponse],
        meta: mockPaginationMeta,
      });

      expect(dto.data).toHaveLength(1);
      expect(dto.data[0]).toBeInstanceOf(UserResponseDto);
      expect(dto.meta).toBeInstanceOf(PaginationMetaDto);
      expect(dto.meta.total).toBe(100);
      expect(dto.meta.page).toBe(1);
    });

    it('should create instance with empty data array', () => {
      const dto = new PaginatedResponseDto<UserResponseDto>({
        data: [],
        meta: mockPaginationMeta,
      });

      expect(dto.data).toHaveLength(0);
      expect(Array.isArray(dto.data)).toBe(true);
      expect(dto.meta).toBeInstanceOf(PaginationMetaDto);
    });

    it('should create instance with partial data', () => {
      const partialData = {
        data: [mockUserResponse],
      };

      const dto = new PaginatedResponseDto<UserResponseDto>(partialData);

      expect(dto.data).toHaveLength(1);
      expect(dto.data[0]).toBeInstanceOf(UserResponseDto);
      expect(dto.meta).toBeUndefined();
    });

    it('should create instance with partial meta', () => {
      const partialMeta = {
        meta: new PaginationMetaDto({ total: 50, page: 2, limit: 25 }),
      };

      const dto = new PaginatedResponseDto<UserResponseDto>(partialMeta);

      expect(dto.data).toBeUndefined();
      expect(dto.meta.total).toBe(50);
      expect(dto.meta.page).toBe(2);
      expect(dto.meta.limit).toBe(25);
    });

    it('should handle empty constructor', () => {
      const dto = new PaginatedResponseDto<UserResponseDto>({});

      expect(dto.data).toBeUndefined();
      expect(dto.meta).toBeUndefined();
    });
  });

  describe('generic typing', () => {
    it('should work with UserResponseDto type', () => {
      const dto = new PaginatedResponseDto<UserResponseDto>({
        data: [mockUserResponse],
        meta: mockPaginationMeta,
      });

      expect(dto.data[0]).toBeInstanceOf(UserResponseDto);
      expect(dto.data[0].email).toBe('test@example.com');
    });

    it('should work with string type', () => {
      const stringDto = new PaginatedResponseDto<string>({
        data: ['item1', 'item2', 'item3'],
        meta: mockPaginationMeta,
      });

      expect(stringDto.data).toHaveLength(3);
      expect(stringDto.data[0]).toBe('item1');
      expect(typeof stringDto.data[0]).toBe('string');
    });

    it('should work with number type', () => {
      const numberDto = new PaginatedResponseDto<number>({
        data: [1, 2, 3, 4, 5],
        meta: mockPaginationMeta,
      });

      expect(numberDto.data).toHaveLength(5);
      expect(numberDto.data[0]).toBe(1);
      expect(typeof numberDto.data[0]).toBe('number');
    });

    it('should work with object type', () => {
      const objectDto = new PaginatedResponseDto<{ id: string; name: string }>({
        data: [
          { id: '1', name: 'Item 1' },
          { id: '2', name: 'Item 2' },
        ],
        meta: mockPaginationMeta,
      });

      expect(objectDto.data).toHaveLength(2);
      expect(objectDto.data[0].id).toBe('1');
      expect(objectDto.data[0].name).toBe('Item 1');
    });
  });

  describe('data array handling', () => {
    it('should handle multiple items', () => {
      const multipleUsers = [
        mockUserResponse,
        new UserResponseDto({
          id: '123e4567-e89b-12d3-a456-426614174001',
          email: 'test2@example.com',
          name: 'Test User 2',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ];

      const dto = new PaginatedResponseDto<UserResponseDto>({
        data: multipleUsers,
        meta: mockPaginationMeta,
      });

      expect(dto.data).toHaveLength(2);
      expect(dto.data[0].email).toBe('test@example.com');
      expect(dto.data[1].email).toBe('test2@example.com');
    });

    it('should handle null data', () => {
      const dto = new PaginatedResponseDto<UserResponseDto>({
        data: null as any,
        meta: mockPaginationMeta,
      });

      expect(dto.data).toBeNull();
    });

    it('should handle undefined data', () => {
      const dto = new PaginatedResponseDto<UserResponseDto>({
        data: undefined,
        meta: mockPaginationMeta,
      });

      expect(dto.data).toBeUndefined();
    });
  });

  describe('pagination meta handling', () => {
    it('should handle complete pagination meta', () => {
      const completeMeta: PaginationMetaDto = {
        total: 150,
        page: 3,
        limit: 25,
        totalPages: 6,
        hasNextPage: true,
        hasPreviousPage: true,
      };

      const dto = new PaginatedResponseDto<UserResponseDto>({
        data: [mockUserResponse],
        meta: completeMeta,
      });

      expect(dto.meta.total).toBe(150);
      expect(dto.meta.page).toBe(3);
      expect(dto.meta.limit).toBe(25);
      expect(dto.meta.totalPages).toBe(6);
      expect(dto.meta.hasNextPage).toBe(true);
      expect(dto.meta.hasPreviousPage).toBe(true);
    });

    it('should handle minimal pagination meta', () => {
      const minimalMeta = new PaginationMetaDto({ page: 1, limit: 10 });

      const dto = new PaginatedResponseDto<UserResponseDto>({
        data: [mockUserResponse],
        meta: minimalMeta,
      });

      expect(dto.meta.page).toBe(1);
      expect(dto.meta.limit).toBe(10);
      expect(dto.meta.total).toBeUndefined();
      expect(dto.meta.totalPages).toBeUndefined();
      expect(dto.meta.hasNextPage).toBeUndefined();
      expect(dto.meta.hasPreviousPage).toBeUndefined();
    });
  });

  describe('serialization', () => {
    it('should be serializable to JSON', () => {
      const dto = new PaginatedResponseDto<UserResponseDto>({
        data: [mockUserResponse],
        meta: mockPaginationMeta,
      });

      const jsonString = JSON.stringify(dto);
      const parsed = JSON.parse(jsonString);

      expect(Array.isArray(parsed.data)).toBe(true);
      expect(parsed.data).toHaveLength(1);
      expect(parsed.data[0].id).toBe(mockUserResponse.id);
      expect(parsed.data[0].email).toBe(mockUserResponse.email);
      
      expect(parsed.meta.total).toBe(100);
      expect(parsed.meta.page).toBe(1);
      expect(parsed.meta.limit).toBe(10);
    });

    it('should serialize empty data correctly', () => {
      const dto = new PaginatedResponseDto<UserResponseDto>({
        data: [],
        meta: mockPaginationMeta,
      });

      const jsonString = JSON.stringify(dto);
      const parsed = JSON.parse(jsonString);

      expect(Array.isArray(parsed.data)).toBe(true);
      expect(parsed.data).toHaveLength(0);
      expect(parsed.meta.total).toBe(100);
    });
  });

  describe('edge cases', () => {
    it('should handle large data arrays', () => {
      const largeData = Array.from({ length: 1000 }, (_, index) =>
        new UserResponseDto({
          id: `id-${index}`,
          email: `user${index}@example.com`,
          name: `User ${index}`,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      );

      const dto = new PaginatedResponseDto<UserResponseDto>({
        data: largeData,
        meta: { ...mockPaginationMeta, total: 1000, totalPages: 100 },
      });

      expect(dto.data).toHaveLength(1000);
      expect(dto.meta.total).toBe(1000);
      expect(dto.meta.totalPages).toBe(100);
    });

    it('should handle zero-based pagination', () => {
      const zeroBasedMeta: PaginationMetaDto = {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      };

      const dto = new PaginatedResponseDto<UserResponseDto>({
        data: [],
        meta: zeroBasedMeta,
      });

      expect(dto.meta.total).toBe(0);
      expect(dto.meta.totalPages).toBe(0);
      expect(dto.meta.hasNextPage).toBe(false);
      expect(dto.meta.hasPreviousPage).toBe(false);
    });
  });
});
