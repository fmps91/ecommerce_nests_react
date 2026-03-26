import { RoleEntity } from '../role.entity';

describe('RoleEntity', () => {
  const mockRoleData = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'ADMIN',
    description: 'Administrator role with full access',
    permissions: ['read', 'write', 'delete', 'admin'],
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
    deletedAt: undefined,
    users: [],
  };

  describe('constructor', () => {
    it('should create instance with complete data', () => {
      const entity = new RoleEntity(mockRoleData);

      expect(entity.id).toBe(mockRoleData.id);
      expect(entity.name).toBe(mockRoleData.name);
      expect(entity.description).toBe(mockRoleData.description);
      expect(entity.permissions).toBe(mockRoleData.permissions);
      expect(entity.createdAt).toBe(mockRoleData.createdAt);
      expect(entity.updatedAt).toBe(mockRoleData.updatedAt);
      expect(entity.deletedAt).toBe(mockRoleData.deletedAt);
      expect(entity.users).toBe(mockRoleData.users);
    });

    it('should create instance with partial data', () => {
      const partialData = {
        id: 'test-id',
        name: 'USER',
        permissions: ['read'],
      };

      const entity = new RoleEntity(partialData);

      expect(entity.id).toBe('test-id');
      expect(entity.name).toBe('USER');
      expect(entity.permissions).toBe(['read']);
      expect(entity.description).toBeUndefined();
      expect(entity.createdAt).toBeUndefined();
      expect(entity.updatedAt).toBeUndefined();
    });

    it('should handle empty constructor', () => {
      const entity = new RoleEntity({});

      expect(entity.id).toBeUndefined();
      expect(entity.name).toBeUndefined();
      expect(entity.permissions).toBeUndefined();
      expect(entity.description).toBeUndefined();
    });
  });

  describe('field types', () => {
    it('should handle correct field types', () => {
      const entity = new RoleEntity(mockRoleData);

      expect(typeof entity.id).toBe('string');
      expect(typeof entity.name).toBe('string');
      expect(typeof entity.description).toBe('string');
      expect(Array.isArray(entity.permissions)).toBe(true);
      expect(entity.createdAt instanceof Date).toBe(true);
      expect(entity.updatedAt instanceof Date).toBe(true);
      expect(Array.isArray(entity.users)).toBe(true);
    });

    it('should handle UUID format for id', () => {
      const entity = new RoleEntity(mockRoleData);

      expect(entity.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should handle role name validation', () => {
      const entity = new RoleEntity(mockRoleData);

      expect(entity.name).toBe('ADMIN');
      expect(['ADMIN', 'SELLER', 'CUSTOMER', 'USER', 'MANAGER']).toContain(entity.name);
    });

    it('should handle permissions array', () => {
      const entity = new RoleEntity(mockRoleData);

      expect(entity.permissions).toHaveLength(4);
      expect(entity.permissions).toContain('read');
      expect(entity.permissions).toContain('write');
      expect(entity.permissions).toContain('delete');
      expect(entity.permissions).toContain('admin');
    });
  });

  describe('date handling', () => {
    it('should handle Date objects correctly', () => {
      const testDate = new Date('2024-12-25T15:30:00.000Z');
      const entityWithDates = {
        ...mockRoleData,
        createdAt: testDate,
        updatedAt: testDate,
      };

      const entity = new RoleEntity(entityWithDates);

      expect(entity.createdAt).toBe(testDate);
      expect(entity.updatedAt).toBe(testDate);
      expect(entity.createdAt instanceof Date).toBe(true);
      expect(entity.updatedAt instanceof Date).toBe(true);
    });

    it('should handle null deletedAt', () => {
      const entityWithNullDeletedAt = {
        ...mockRoleData,
        deletedAt: null,
      };

      const entity = new RoleEntity(entityWithNullDeletedAt as any);

      expect(entity.deletedAt).toBeNull();
    });

    it('should handle undefined deletedAt', () => {
      const entityWithUndefinedDeletedAt = {
        ...mockRoleData,
        deletedAt: undefined,
      };

      const entity = new RoleEntity(entityWithUndefinedDeletedAt);

      expect(entity.deletedAt).toBeUndefined();
    });
  });

  describe('permissions handling', () => {
    it('should handle empty permissions array', () => {
      const entityWithEmptyPermissions = {
        ...mockRoleData,
        permissions: [],
      };

      const entity = new RoleEntity(entityWithEmptyPermissions);

      expect(entity.permissions).toHaveLength(0);
      expect(Array.isArray(entity.permissions)).toBe(true);
    });

    it('should handle null permissions', () => {
      const entityWithNullPermissions = {
        ...mockRoleData,
        permissions: null,
      };

      const entity = new RoleEntity(entityWithNullPermissions as any);

      expect(entity.permissions).toBeNull();
    });

    it('should handle undefined permissions', () => {
      const entityWithUndefinedPermissions = {
        ...mockRoleData,
        permissions: undefined,
      };

      const entity = new RoleEntity(entityWithUndefinedPermissions);

      expect(entity.permissions).toBeUndefined();
    });

    it('should handle complex permissions', () => {
      const complexPermissions = [
        'users:read',
        'users:write',
        'users:delete',
        'products:read',
        'products:write',
        'orders:read',
        'orders:write',
        'admin:system',
      ];

      const entityWithComplexPermissions = {
        ...mockRoleData,
        permissions: complexPermissions,
      };

      const entity = new RoleEntity(entityWithComplexPermissions);

      expect(entity.permissions).toHaveLength(8);
      expect(entity.permissions).toEqual(complexPermissions);
    });
  });

  describe('users relationship', () => {
    it('should handle users array correctly', () => {
      const mockUsers = [
        { id: 'user-1', email: 'user1@example.com' },
        { id: 'user-2', email: 'user2@example.com' },
      ];

      const entityWithUsers = {
        ...mockRoleData,
        users: mockUsers,
      };

      const entity = new RoleEntity(entityWithUsers);

      expect(entity.users).toHaveLength(2);
      expect(entity.users?.[0]).toEqual(mockUsers[0]);
      expect(entity.users?.[1]).toEqual(mockUsers[1]);
    });

    it('should handle empty users array', () => {
      const entityWithEmptyUsers = {
        ...mockRoleData,
        users: [],
      };

      const entity = new RoleEntity(entityWithEmptyUsers);

      expect(entity.users).toHaveLength(0);
      expect(Array.isArray(entity.users)).toBe(true);
    });

    it('should handle null users', () => {
      const entityWithNullUsers = {
        ...mockRoleData,
        users: null,
      };

      const entity = new RoleEntity(entityWithNullUsers as any);

      expect(entity.users).toBeNull();
    });

    it('should handle undefined users', () => {
      const entityWithUndefinedUsers = {
        ...mockRoleData,
        users: undefined,
      };

      const entity = new RoleEntity(entityWithUndefinedUsers);

      expect(entity.users).toBeUndefined();
    });
  });

  describe('serialization', () => {
    it('should be serializable to JSON', () => {
      const entity = new RoleEntity(mockRoleData);
      const jsonString = JSON.stringify(entity);
      const parsed = JSON.parse(jsonString);

      expect(parsed.id).toBe(mockRoleData.id);
      expect(parsed.name).toBe(mockRoleData.name);
      expect(parsed.description).toBe(mockRoleData.description);
      expect(parsed.permissions).toEqual(mockRoleData.permissions);
      expect(parsed.createdAt).toBe(mockRoleData.createdAt.toISOString());
      expect(parsed.updatedAt).toBe(mockRoleData.updatedAt.toISOString());
      expect(parsed.deletedAt).toBeUndefined();
      expect(parsed.users).toEqual(mockRoleData.users);
    });

    it('should serialize partial data correctly', () => {
      const partialEntity = new RoleEntity({
        id: 'test-id',
        name: 'USER',
      });

      const jsonString = JSON.stringify(partialEntity);
      const parsed = JSON.parse(jsonString);

      expect(parsed.id).toBe('test-id');
      expect(parsed.name).toBe('USER');
      expect(parsed.description).toBeUndefined();
      expect(parsed.permissions).toBeUndefined();
    });

    it('should handle null values in serialization', () => {
      const entityWithNulls = new RoleEntity({
        id: 'test-id',
        deletedAt: null,
        users: null,
        permissions: null,
      } as any);

      const jsonString = JSON.stringify(entityWithNulls);
      const parsed = JSON.parse(jsonString);

      expect(parsed.id).toBe('test-id');
      expect(parsed.deletedAt).toBe(null);
      expect(parsed.users).toBe(null);
      expect(parsed.permissions).toBe(null);
    });
  });

  describe('edge cases', () => {
    it('should handle very long strings', () => {
      const longString = 'a'.repeat(1000);
      const entityWithLongStrings = {
        ...mockRoleData,
        description: longString,
      };

      const entity = new RoleEntity(entityWithLongStrings);

      expect(entity.description).toBe(longString);
      expect(typeof entity.description).toBe('string');
    });

    it('should handle special characters in strings', () => {
      const specialChars = 'Role with émojis 🎉 and special chars: @#$%^&*()';
      const entityWithSpecialChars = {
        ...mockRoleData,
        description: specialChars,
      };

      const entity = new RoleEntity(entityWithSpecialChars);

      expect(entity.description).toBe(specialChars);
      expect(typeof entity.description).toBe('string');
    });

    it('should handle empty name', () => {
      const entityWithEmptyName = {
        ...mockRoleData,
        name: '',
      };

      const entity = new RoleEntity(entityWithEmptyName);

      expect(entity.name).toBe('');
      expect(typeof entity.name).toBe('string');
    });

    it('should handle null description', () => {
      const entityWithNullDescription = {
        ...mockRoleData,
        description: null,
      };

      const entity = new RoleEntity(entityWithNullDescription as any);

      expect(entity.description).toBeNull();
    });
  });

  describe('Object.assign behavior', () => {
    it('should merge properties correctly using Object.assign', () => {
      const entity = new RoleEntity({});
      Object.assign(entity, mockRoleData);

      expect(entity.id).toBe(mockRoleData.id);
      expect(entity.name).toBe(mockRoleData.name);
      expect(entity.permissions).toBe(mockRoleData.permissions);
    });

    it('should overwrite existing properties with Object.assign', () => {
      const entity = new RoleEntity(mockRoleData);
      const newData = {
        name: 'UPDATED_ROLE',
        description: 'Updated description',
      };

      Object.assign(entity, newData);

      expect(entity.id).toBe(mockRoleData.id); // Should remain unchanged
      expect(entity.name).toBe('UPDATED_ROLE'); // Should be updated
      expect(entity.description).toBe('Updated description'); // Should be updated
    });
  });

  describe('calculated properties', () => {
    it('should handle permissionsCount getter', () => {
      const entity = new RoleEntity(mockRoleData);

      expect(entity.permissionsCount).toBeDefined();
      expect(typeof entity.permissionsCount).toBe('number');
      expect(entity.permissionsCount).toBe(4);
    });

    it('should return 0 for empty permissions', () => {
      const entityWithEmptyPermissions = new RoleEntity({
        ...mockRoleData,
        permissions: [],
      });

      expect(entityWithEmptyPermissions.permissionsCount).toBe(0);
    });

    it('should return 0 for null permissions', () => {
      const entityWithNullPermissions = new RoleEntity({
        ...mockRoleData,
        permissions: null,
      } as any);

      expect(entityWithNullPermissions.permissionsCount).toBe(0);
    });

    it('should return 0 for undefined permissions', () => {
      const entityWithUndefinedPermissions = new RoleEntity({
        ...mockRoleData,
        permissions: undefined,
      });

      expect(entityWithUndefinedPermissions.permissionsCount).toBe(0);
    });

    it('should handle hasPermissions getter', () => {
      const entity = new RoleEntity(mockRoleData);

      expect(entity.hasPermissions).toBeDefined();
      expect(typeof entity.hasPermissions).toBe('boolean');
      expect(entity.hasPermissions).toBe(true);
    });

    it('should return false for empty permissions', () => {
      const entityWithEmptyPermissions = new RoleEntity({
        ...mockRoleData,
        permissions: [],
      });

      expect(entityWithEmptyPermissions.hasPermissions).toBe(false);
    });

    it('should return false for null permissions', () => {
      const entityWithNullPermissions = new RoleEntity({
        ...mockRoleData,
        permissions: null,
      } as any);

      expect(entityWithNullPermissions.hasPermissions).toBe(false);
    });

    it('should return false for undefined permissions', () => {
      const entityWithUndefinedPermissions = new RoleEntity({
        ...mockRoleData,
        permissions: undefined,
      });

      expect(entityWithUndefinedPermissions.hasPermissions).toBe(false);
    });
  });
});
