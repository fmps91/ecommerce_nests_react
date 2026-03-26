import { UserResponseDto } from '../user-response.dto';
import { UserEntity, UserRole } from '../../entities/user.entity';

describe('UserResponseDto', () => {
  const mockUserEntity: UserEntity = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    name: 'Test User',
    roleId: '123e4567-e89b-12d3-a456-426614174001',
    isActive: true,
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-02T00:00:00.000Z'),
  };

  describe('constructor', () => {
    it('should create instance with full UserEntity data', () => {
      const dto = new UserResponseDto(mockUserEntity);

      expect(dto.id).toBe(mockUserEntity.id);
      expect(dto.email).toBe(mockUserEntity.email);
      expect(dto.name).toBe(mockUserEntity.name);
      expect(dto.isActive).toBe(mockUserEntity.isActive);
      expect(dto.createdAt).toBe(mockUserEntity.createdAt);
      expect(dto.updatedAt).toBe(mockUserEntity.updatedAt);
    });

    it('should create instance with partial data', () => {
      const partialData = {
        id: 'test-id',
        email: 'partial@example.com',
      };

      const dto = new UserResponseDto(partialData);

      expect(dto.id).toBe('test-id');
      expect(dto.email).toBe('partial@example.com');
      expect(dto.name).toBeUndefined();
      expect(dto.isActive).toBeUndefined();
    });

    it('should handle empty constructor', () => {
      const dto = new UserResponseDto({});

      expect(dto.id).toBeUndefined();
      expect(dto.email).toBeUndefined();
      expect(dto.name).toBeUndefined();
      expect(dto.isActive).toBeUndefined();
    });
  });

  describe('data transformation', () => {
    it('should transform dates correctly', () => {
      const testDate = new Date('2024-12-25T15:30:00.000Z');
      const userWithDate = {
        ...mockUserEntity,
        createdAt: testDate,
        updatedAt: testDate,
      };

      const dto = new UserResponseDto(userWithDate);

      expect(dto.createdAt).toBe(testDate);
      expect(dto.updatedAt).toBe(testDate);
      expect(dto.createdAt instanceof Date).toBe(true);
      expect(dto.updatedAt instanceof Date).toBe(true);
    });

    it('should handle string dates', () => {
      const userWithStringDates = {
        ...mockUserEntity,
        createdAt: '2024-01-01T00:00:00.000Z' as any,
        updatedAt: '2024-01-02T00:00:00.000Z' as any,
      };

      const dto = new UserResponseDto(userWithStringDates);

      expect(dto.createdAt).toBe('2024-01-01T00:00:00.000Z');
      expect(dto.updatedAt).toBe('2024-01-02T00:00:00.000Z');
    });

    it('should handle boolean values correctly', () => {
      const inactiveUser = {
        ...mockUserEntity,
        isActive: false,
      };

      const dto = new UserResponseDto(inactiveUser);

      expect(dto.isActive).toBe(false);
      expect(typeof dto.isActive).toBe('boolean');
    });
  });

  describe('field mapping', () => {
    it('should map all required fields correctly', () => {
      const dto = new UserResponseDto(mockUserEntity);

      // Test all expected fields are present and correctly mapped
      expect(dto).toHaveProperty('id');
      expect(dto).toHaveProperty('email');
      expect(dto).toHaveProperty('name');
      expect(dto).toHaveProperty('role');
      expect(dto).toHaveProperty('isActive');
      expect(dto).toHaveProperty('createdAt');
      expect(dto).toHaveProperty('updatedAt');

      // Test values match
      expect(dto.id).toBe(mockUserEntity.id);
      expect(dto.email).toBe(mockUserEntity.email);
      expect(dto.name).toBe(mockUserEntity.name);
      expect(dto.isActive).toBe(mockUserEntity.isActive);
    });

    it('should handle roleId to role mapping', () => {
      // Note: Based on the DTO, it seems like it should have a 'role' field
      // but the UserEntity has 'roleId'. This test documents the current behavior
      const dto = new UserResponseDto(mockUserEntity);

      // The DTO has a 'role' field but UserEntity has 'roleId'
      // This might need adjustment based on actual requirements
      expect(dto.role as any).toBeUndefined();
    });
  });

  describe('serialization', () => {
    it('should be serializable to JSON', () => {
      const dto = new UserResponseDto(mockUserEntity);
      const jsonString = JSON.stringify(dto);
      const parsed = JSON.parse(jsonString);

      expect(parsed.id).toBe(mockUserEntity.id);
      expect(parsed.email).toBe(mockUserEntity.email);
      expect(parsed.name).toBe(mockUserEntity.name);
      expect(parsed.isActive).toBe(mockUserEntity.isActive);
      expect(parsed.createdAt).toBe(mockUserEntity.createdAt.toISOString());
      expect(parsed.updatedAt).toBe(mockUserEntity.updatedAt.toISOString());
    });

    it('should handle undefined values in serialization', () => {
      const partialDto = new UserResponseDto({
        id: 'test-id',
        email: 'test@example.com',
      });

      const jsonString = JSON.stringify(partialDto);
      const parsed = JSON.parse(jsonString);

      expect(parsed.id).toBe('test-id');
      expect(parsed.email).toBe('test@example.com');
      expect(parsed.name).toBeUndefined();
      expect(parsed.isActive).toBeUndefined();
    });
  });

  describe('edge cases', () => {
    it('should handle null values gracefully', () => {
      const userWithNulls = {
        id: null,
        email: null,
        name: null,
        isActive: null,
        createdAt: null,
        updatedAt: null,
      };

      const dto = new UserResponseDto(userWithNulls as any);

      expect(dto.id).toBeNull();
      expect(dto.email).toBeNull();
      expect(dto.name).toBeNull();
      expect(dto.isActive).toBeNull();
      expect(dto.createdAt).toBeNull();
      expect(dto.updatedAt).toBeNull();
    });

    it('should handle very long strings', () => {
      const longString = 'a'.repeat(1000);
      const userWithLongStrings = {
        ...mockUserEntity,
        name: longString,
        email: `${longString}@example.com`,
      };

      const dto = new UserResponseDto(userWithLongStrings);

      expect(dto.name).toBe(longString);
      expect(dto.email).toBe(`${longString}@example.com`);
    });

    it('should handle special characters in email', () => {
      const userWithSpecialEmail = {
        ...mockUserEntity,
        email: 'test+special@example-domain.co.uk',
      };

      const dto = new UserResponseDto(userWithSpecialEmail);

      expect(dto.email).toBe('test+special@example-domain.co.uk');
    });
  });
});
