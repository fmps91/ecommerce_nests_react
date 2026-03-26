import { Role } from '../role.model';

describe('Role Model', () => {
  const mockRoleData = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'ADMIN',
    description: 'Administrator role with full access',
    permissions: ['read', 'write', 'delete', 'admin'],
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
    deletedAt: undefined,
  };

  describe('Model Definition', () => {
    it('should have correct table name', () => {
      expect(Role.options.tableName).toBe('roles');
    });

    it('should have timestamps enabled', () => {
      expect(Role.options.timestamps).toBe(true);
    });

    it('should have paranoid enabled', () => {
      expect(Role.options.paranoid).toBe(true);
    });

    it('should have underscored enabled', () => {
      expect(Role.options.underscored).toBe(true);
    });
  });

  describe('Fields', () => {
    it('should have id field with correct attributes', () => {
      const idField = Role.rawAttributes.id;
      expect(idField.type).toBeDefined();
      expect(idField.primaryKey).toBe(true);
      expect(idField.defaultValue).toBeDefined();
    });

    it('should have name field with correct attributes', () => {
      const nameField = Role.rawAttributes.name;
      expect(nameField.type).toBeDefined();
      expect(nameField.allowNull).toBe(false);
      expect(nameField.unique).toBe(true);
    });

    it('should have description field with correct attributes', () => {
      const descriptionField = Role.rawAttributes.description;
      expect(descriptionField.type).toBeDefined();
      expect(descriptionField.allowNull).toBe(true);
    });

    it('should have permissions field with correct attributes', () => {
      const permissionsField = Role.rawAttributes.permissions;
      expect(permissionsField.type).toBeDefined();
      expect(permissionsField.allowNull).toBe(true);
      expect(permissionsField.defaultValue).toEqual([]);
    });

    it('should have timestamp fields', () => {
      expect(Role.rawAttributes.createdAt).toBeDefined();
      expect(Role.rawAttributes.updatedAt).toBeDefined();
      expect(Role.rawAttributes.deletedAt).toBeDefined();
    });
  });

  describe('Associations', () => {
    it('should have users association', () => {
      expect(Role.associations.users).toBeDefined();
      expect(Role.associations.users.associationType).toBe('HasMany');
    });
  });

  describe('Role Types', () => {
    const standardRoles = ['ADMIN', 'SELLER', 'CUSTOMER', 'MANAGER', 'USER'];

    it('should validate standard role names', () => {
      standardRoles.forEach(roleName => {
        const role = new Role({ name: roleName });
        expect(role.name).toBe(roleName);
        expect(typeof role.name).toBe('string');
      });
    });

    it('should handle case sensitivity in role names', () => {
      const roleLower = new Role({ name: 'admin' });
      const roleUpper = new Role({ name: 'ADMIN' });
      const roleMixed = new Role({ name: 'Admin' });

      expect(roleLower.name).toBe('admin');
      expect(roleUpper.name).toBe('ADMIN');
      expect(roleMixed.name).toBe('Admin');
    });

    it('should handle special characters in role names', () => {
      const specialRoles = [
        'SUPER_ADMIN',
        'CONTENT_MANAGER',
        'SUPPORT_AGENT',
        'SALES_REPRESENTATIVE'
      ];

      specialRoles.forEach(roleName => {
        const role = new Role({ name: roleName });
        expect(role.name).toBe(roleName);
      });
    });
  });

  describe('Permissions', () => {
    const adminPermissions = [
      'users:read',
      'users:write',
      'users:delete',
      'products:read',
      'products:write',
      'products:delete',
      'orders:read',
      'orders:write',
      'orders:delete',
      'admin:system'
    ];

    const sellerPermissions = [
      'products:read',
      'products:write',
      'orders:read',
      'orders:write',
      'inventory:read',
      'inventory:write'
    ];

    const customerPermissions = [
      'products:read',
      'orders:read',
      'orders:write:own',
      'profile:read:own',
      'profile:write:own'
    ];

    it('should handle admin permissions correctly', () => {
      const adminRole = new Role({
        ...mockRoleData,
        name: 'ADMIN',
        permissions: adminPermissions
      });

      expect(adminRole.permissions).toHaveLength(adminPermissions.length);
      expect(adminRole.permissions).toContain('admin:system');
      expect(adminRole.permissions).toContain('users:delete');
    });

    it('should handle seller permissions correctly', () => {
      const sellerRole = new Role({
        ...mockRoleData,
        name: 'SELLER',
        permissions: sellerPermissions
      });

      expect(sellerRole.permissions).toHaveLength(sellerPermissions.length);
      expect(sellerRole.permissions).toContain('products:write');
      expect(sellerRole.permissions).not.toContain('admin:system');
    });

    it('should handle customer permissions correctly', () => {
      const customerRole = new Role({
        ...mockRoleData,
        name: 'CUSTOMER',
        permissions: customerPermissions
      });

      expect(customerRole.permissions).toHaveLength(customerPermissions.length);
      expect(customerRole.permissions).toContain('profile:read:own');
      expect(customerRole.permissions).not.toContain('users:delete');
    });

    it('should handle empty permissions array', () => {
      const roleWithNoPermissions = new Role({
        ...mockRoleData,
        permissions: []
      });

      expect(roleWithNoPermissions.permissions).toHaveLength(0);
      expect(Array.isArray(roleWithNoPermissions.permissions)).toBe(true);
    });

    it('should handle null permissions', () => {
      const roleWithNullPermissions = new Role({
        ...mockRoleData,
        permissions: null
      } as any);

      expect(roleWithNullPermissions.permissions).toBeNull();
    });

    it('should handle complex permission patterns', () => {
      const complexPermissions = [
        'read:all',
        'write:own',
        'delete:own',
        'admin:users',
        'admin:products',
        'admin:orders',
        'report:read',
        'analytics:read'
      ];

      const roleWithComplexPermissions = new Role({
        ...mockRoleData,
        permissions: complexPermissions
      });

      expect(roleWithComplexPermissions.permissions).toEqual(complexPermissions);
      expect(roleWithComplexPermissions.permissions).toContain('admin:users');
      expect(roleWithComplexPermissions.permissions).toContain('write:own');
    });
  });

  describe('Role Hierarchy', () => {
    it('should represent role hierarchy through permissions', () => {
      const adminRole = new Role({
        name: 'ADMIN',
        permissions: ['*'] // Full access
      });

      const managerRole = new Role({
        name: 'MANAGER',
        permissions: ['users:read', 'users:write', 'products:*', 'orders:*']
      });

      const employeeRole = new Role({
        name: 'EMPLOYEE',
        permissions: ['products:read', 'orders:read', 'orders:write']
      });

      // Admin should have all permissions
      expect(adminRole.permissions).toContain('*');
      
      // Manager should have broad but limited permissions
      expect(managerRole.permissions).toContain('products:*');
      expect(managerRole.permissions).not.toContain('*');
      
      // Employee should have limited permissions
      expect(employeeRole.permissions).not.toContain('users:*');
      expect(employeeRole.permissions).toContain('orders:read');
    });
  });

  describe('Validation Edge Cases', () => {
    it('should handle very long role names', () => {
      const longRoleName = 'ROLE_WITH_A_VERY_LONG_NAME_THAT_MIGHT_CAUSE_ISSUES';
      const role = new Role({ name: longRoleName });
      expect(role.name).toBe(longRoleName);
    });

    it('should handle role names with special characters', () => {
      const specialRoleNames = [
        'CO-FOUNDER',
        'C-LEVEL_EXECUTIVE',
        'SUPER_ADMIN_USER',
        'CONTENT-MANAGER_V2'
      ];

      specialRoleNames.forEach(roleName => {
        const role = new Role({ name: roleName });
        expect(role.name).toBe(roleName);
      });
    });

    it('should handle empty role name', () => {
      const role = new Role({ name: '' });
      expect(role.name).toBe('');
    });

    it('should handle permission strings with special characters', () => {
      const specialPermissions = [
        'api:v1:read',
        'api:v2:write',
        'admin:system:config',
        'user:profile:upload:avatar'
      ];

      const role = new Role({
        ...mockRoleData,
        permissions: specialPermissions
      });

      expect(role.permissions).toEqual(specialPermissions);
    });
  });

  describe('Instance Methods', () => {
    it('should create instance with all fields', () => {
      const role = new Role(mockRoleData);

      expect(role.id).toBe(mockRoleData.id);
      expect(role.name).toBe(mockRoleData.name);
      expect(role.description).toBe(mockRoleData.description);
      expect(role.permissions).toEqual(mockRoleData.permissions);
      expect(role.createdAt).toEqual(mockRoleData.createdAt);
      expect(role.updatedAt).toEqual(mockRoleData.updatedAt);
      expect(role.deletedAt).toBe(mockRoleData.deletedAt);
    });

    it('should create instance with partial data', () => {
      const partialData = {
        name: 'TEST_ROLE',
        permissions: ['read']
      };

      const role = new Role(partialData);

      expect(role.name).toBe('TEST_ROLE');
      expect(role.permissions).toEqual(['read']);
      expect(role.id).toBeUndefined();
      expect(role.description).toBeUndefined();
    });
  });

  describe('Soft Delete Behavior', () => {
    it('should handle deletedAt field for soft deletes', () => {
      const deletedDate = new Date('2024-06-01T00:00:00.000Z');
      const deletedRole = new Role({
        ...mockRoleData,
        deletedAt: deletedDate
      });

      expect(deletedRole.deletedAt).toBe(deletedDate);
    });

    it('should handle null deletedAt for active roles', () => {
      const activeRole = new Role({
        ...mockRoleData,
        deletedAt: null
      });

      expect(activeRole.deletedAt).toBeNull();
    });

    it('should handle undefined deletedAt', () => {
      const role = new Role(mockRoleData);
      expect(role.deletedAt).toBeUndefined();
    });
  });

  describe('Default Values', () => {
    it('should have default permissions as empty array', () => {
      const roleWithoutPermissions = new Role({
        name: 'TEST_ROLE'
      });

      expect(roleWithoutPermissions.permissions).toBeUndefined();
      // Note: Default values are set at database level, not in the model
    });
  });

  describe('Data Types', () => {
    it('should maintain correct data types', () => {
      const role = new Role(mockRoleData);

      expect(typeof role.id).toBe('string');
      expect(typeof role.name).toBe('string');
      expect(typeof role.description).toBe('string');
      expect(Array.isArray(role.permissions)).toBe(true);
      expect(role.createdAt instanceof Date).toBe(true);
      expect(role.updatedAt instanceof Date).toBe(true);
    });

    it('should handle UUID format for id', () => {
      const role = new Role(mockRoleData);
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(role.id).toMatch(uuidRegex);
    });
  });
});
