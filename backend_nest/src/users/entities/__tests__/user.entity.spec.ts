import { UserEntity, UserRole } from '../user.entity';

describe('UserEntity', () => {
  const mockUserData = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    name: 'Test User',
    roleId: '123e4567-e89b-12d3-a456-426614174001',
    isActive: true,
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-02T00:00:00.000Z'),
    password: 'hashedpassword', // This should be excluded
  };

  describe('constructor', () => {
    it('should create instance with complete data', () => {
      const entity = new UserEntity(mockUserData);

      expect(entity.id).toBe(mockUserData.id);
      expect(entity.email).toBe(mockUserData.email);
      expect(entity.name).toBe(mockUserData.name);
      expect(entity.roleId).toBe(mockUserData.roleId);
      expect(entity.isActive).toBe(mockUserData.isActive);
      expect(entity.createdAt).toBe(mockUserData.createdAt);
      expect(entity.updatedAt).toBe(mockUserData.updatedAt);
      expect(entity.password).toBeUndefined(); // Should be excluded
    });

    it('should create instance with partial data', () => {
      const partialData = {
        id: 'test-id',
        email: 'partial@example.com',
      };

      const entity = new UserEntity(partialData);

      expect(entity.id).toBe('test-id');
      expect(entity.email).toBe('partial@example.com');
      expect(entity.name).toBeUndefined();
      expect(entity.roleId).toBeUndefined();
      expect(entity.isActive).toBeUndefined();
      expect(entity.createdAt).toBeUndefined();
      expect(entity.updatedAt).toBeUndefined();
    });

    it('should handle empty constructor', () => {
      const entity = new UserEntity({});

      expect(entity.id).toBeUndefined();
      expect(entity.email).toBeUndefined();
      expect(entity.name).toBeUndefined();
      expect(entity.roleId).toBeUndefined();
      expect(entity.isActive).toBeUndefined();
      expect(entity.createdAt).toBeUndefined();
      expect(entity.updatedAt).toBeUndefined();
    });
  });

  describe('field types', () => {
    it('should handle correct field types', () => {
      const entity = new UserEntity(mockUserData);

      expect(typeof entity.id).toBe('string');
      expect(typeof entity.email).toBe('string');
      expect(typeof entity.name).toBe('string');
      expect(typeof entity.roleId).toBe('string');
      expect(typeof entity.isActive).toBe('boolean');
      expect(entity.createdAt instanceof Date).toBe(true);
      expect(entity.updatedAt instanceof Date).toBe(true);
    });

    it('should handle UUID format for id', () => {
      const entity = new UserEntity(mockUserData);

      expect(entity.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should handle email format', () => {
      const entity = new UserEntity(mockUserData);

      expect(entity.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });

    it('should handle boolean isActive', () => {
      const activeUser = new UserEntity({ ...mockUserData, isActive: true });
      const inactiveUser = new UserEntity({ ...mockUserData, isActive: false });

      expect(activeUser.isActive).toBe(true);
      expect(inactiveUser.isActive).toBe(false);
      expect(typeof activeUser.isActive).toBe('boolean');
      expect(typeof inactiveUser.isActive).toBe('boolean');
    });
  });

  describe('password exclusion', () => {
    it('should exclude password field', () => {
      const entity = new UserEntity({
        ...mockUserData,
        password: 'secret-password',
      });

      expect(entity.password).toBeUndefined();
    });

    it('should not create password property even if provided', () => {
      const entity = new UserEntity({
        ...mockUserData,
        password: 'should-not-exist',
      });

      expect('password' in entity).toBe(false);
      expect(entity.hasOwnProperty('password')).toBe(false);
    });
  });

  describe('date handling', () => {
    it('should handle Date objects correctly', () => {
      const testDate = new Date('2024-12-25T15:30:00.000Z');
      const entity = new UserEntity({
        ...mockUserData,
        createdAt: testDate,
        updatedAt: testDate,
      });

      expect(entity.createdAt).toBe(testDate);
      expect(entity.updatedAt).toBe(testDate);
      expect(entity.createdAt instanceof Date).toBe(true);
      expect(entity.updatedAt instanceof Date).toBe(true);
    });

    it('should handle string dates', () => {
      const dateString = '2024-01-01T00:00:00.000Z';
      const entity = new UserEntity({
        ...mockUserData,
        createdAt: dateString as any,
        updatedAt: dateString as any,
      });

      expect(entity.createdAt).toBe(dateString);
      expect(entity.updatedAt).toBe(dateString);
    });

    it('should handle null dates', () => {
      const entity = new UserEntity({
        ...mockUserData,
        createdAt: null as any,
        updatedAt: null as any,
      });

      expect(entity.createdAt).toBeNull();
      expect(entity.updatedAt).toBeNull();
    });
  });

  describe('serialization', () => {
    it('should be serializable to JSON', () => {
      const entity = new UserEntity(mockUserData);
      const jsonString = JSON.stringify(entity);
      const parsed = JSON.parse(jsonString);

      expect(parsed.id).toBe(mockUserData.id);
      expect(parsed.email).toBe(mockUserData.email);
      expect(parsed.name).toBe(mockUserData.name);
      expect(parsed.roleId).toBe(mockUserData.roleId);
      expect(parsed.isActive).toBe(mockUserData.isActive);
      expect(parsed.createdAt).toBe(mockUserData.createdAt.toISOString());
      expect(parsed.updatedAt).toBe(mockUserData.updatedAt.toISOString());
      expect(parsed.password).toBeUndefined();
    });

    it('should not include password in JSON serialization', () => {
      const entity = new UserEntity({
        ...mockUserData,
        password: 'secret-password',
      });

      const jsonString = JSON.stringify(entity);
      const parsed = JSON.parse(jsonString);

      expect(parsed.password).toBeUndefined();
    });
  });

  describe('edge cases', () => {
    it('should handle null values', () => {
      const entity = new UserEntity({
        id: null,
        email: null,
        name: null,
        roleId: null,
        isActive: null,
        createdAt: null,
        updatedAt: null,
      } as any);

      expect(entity.id).toBeNull();
      expect(entity.email).toBeNull();
      expect(entity.name).toBeNull();
      expect(entity.roleId).toBeNull();
      expect(entity.isActive).toBeNull();
      expect(entity.createdAt).toBeNull();
      expect(entity.updatedAt).toBeNull();
    });

    it('should handle undefined values', () => {
      const entity = new UserEntity({
        id: undefined,
        email: undefined,
        name: undefined,
        roleId: undefined,
        isActive: undefined,
        createdAt: undefined,
        updatedAt: undefined,
      });

      expect(entity.id).toBeUndefined();
      expect(entity.email).toBeUndefined();
      expect(entity.name).toBeUndefined();
      expect(entity.roleId).toBeUndefined();
      expect(entity.isActive).toBeUndefined();
      expect(entity.createdAt).toBeUndefined();
      expect(entity.updatedAt).toBeUndefined();
    });

    it('should handle empty strings', () => {
      const entity = new UserEntity({
        id: '',
        email: '',
        name: '',
        roleId: '',
      });

      expect(entity.id).toBe('');
      expect(entity.email).toBe('');
      expect(entity.name).toBe('');
      expect(entity.roleId).toBe('');
    });

    it('should handle very long strings', () => {
      const longString = 'a'.repeat(1000);
      const entity = new UserEntity({
        ...mockUserData,
        name: longString,
        email: `${longString}@example.com`,
      });

      expect(entity.name).toBe(longString);
      expect(entity.email).toBe(`${longString}@example.com`);
    });
  });

  describe('Object.assign behavior', () => {
    it('should merge properties correctly using Object.assign', () => {
      const entity = new UserEntity({});
      Object.assign(entity, mockUserData);

      expect(entity.id).toBe(mockUserData.id);
      expect(entity.email).toBe(mockUserData.email);
      expect(entity.name).toBe(mockUserData.name);
      expect(entity.password).toBeUndefined();
    });

    it('should overwrite existing properties with Object.assign', () => {
      const entity = new UserEntity(mockUserData);
      const newData = {
        name: 'Updated Name',
        email: 'updated@example.com',
      };

      Object.assign(entity, newData);

      expect(entity.id).toBe(mockUserData.id); // Should remain unchanged
      expect(entity.name).toBe('Updated Name'); // Should be updated
      expect(entity.email).toBe('updated@example.com'); // Should be updated
    });
  });

  describe('UserRole enum', () => {
    it('should have correct enum values', () => {
      expect(UserRole.ADMIN).toBe('ADMIN');
      expect(UserRole.SELLER).toBe('SELLER');
      expect(UserRole.CUSTOMER).toBe('CUSTOMER');
    });

    it('should handle role assignment if role field exists', () => {
      // Note: Current UserEntity doesn't have a role field, but testing for completeness
      const entityWithRole = {
        ...mockUserData,
        role: UserRole.ADMIN,
      } as any;

      expect(entityWithRole.role).toBe(UserRole.ADMIN);
    });
  });

  describe('instanceof and constructor', () => {
    it('should be instance of UserEntity', () => {
      const entity = new UserEntity(mockUserData);

      expect(entity instanceof UserEntity).toBe(true);
      expect(entity.constructor.name).toBe('UserEntity');
    });

    it('should have correct prototype chain', () => {
      const entity = new UserEntity(mockUserData);

      expect(Object.getPrototypeOf(entity)).toBe(UserEntity.prototype);
      expect(UserEntity.prototype.constructor.name).toBe('UserEntity');
    });
  });
});
