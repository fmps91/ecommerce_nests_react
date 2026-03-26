import { User } from '../user.model';
import { Role } from '../../../rols/models/role.model';

describe('User Model - Role Related Tests', () => {
  const mockRoleData = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'ADMIN',
    description: 'Administrator role with full access',
    permissions: ['users:read', 'users:write', 'users:delete', 'admin:system'],
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
  };

  const mockUserData = {
    id: '123e4567-e89b-12d3-a456-426614174001',
    email: 'admin@example.com',
    password: 'hashedpassword',
    name: 'Admin User',
    roleId: mockRoleData.id,
    isActive: true,
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
  };

  describe('Role Association', () => {
    it('should have roleId field with correct attributes', () => {
      const roleIdField = User.rawAttributes.roleId;
      expect(roleIdField.type).toBeDefined();
      expect(roleIdField.allowNull).toBe(false);
      expect(roleIdField.field).toBe('role_id');
    });

    it('should have role association defined', () => {
      expect(User.associations.role).toBeDefined();
      expect(User.associations.role.associationType).toBe('BelongsTo');
    });

    it('should have foreign key constraint to Role', () => {
      const roleAssociation = User.associations.role;
      expect(roleAssociation.foreignKey).toBe('roleId');
      expect(roleAssociation.target).toBe(Role);
    });
  });

  describe('Role Assignment', () => {
    it('should assign admin role correctly', () => {
      const adminUser = new User({
        ...mockUserData,
        roleId: mockRoleData.id
      });

      expect(adminUser.roleId).toBe(mockRoleData.id);
      expect(typeof adminUser.roleId).toBe('string');
    });

    it('should assign different role types', () => {
      const sellerRoleId = '123e4567-e89b-12d3-a456-426614174002';
      const customerRoleId = '123e4567-e89b-12d3-a456-426614174003';

      const sellerUser = new User({
        ...mockUserData,
        roleId: sellerRoleId
      });

      const customerUser = new User({
        ...mockUserData,
        roleId: customerRoleId
      });

      expect(sellerUser.roleId).toBe(sellerRoleId);
      expect(customerUser.roleId).toBe(customerRoleId);
    });

    it('should handle null roleId (should not happen due to allowNull: false)', () => {
      const userWithoutRole = new User({
        ...mockUserData,
        roleId: null
      } as any);

      expect(userWithoutRole.roleId).toBeNull();
    });

    it('should handle undefined roleId', () => {
      const userWithoutRoleId = new User({
        ...mockUserData,
        roleId: undefined
      });

      expect(userWithoutRoleId.roleId).toBeUndefined();
    });
  });

  describe('Role Population', () => {
    it('should handle role object when populated', () => {
      const userWithRole = new User({
        ...mockUserData,
        role: mockRoleData
      });

      expect(userWithRole.role).toBeDefined();
      expect(userWithRole.role).toBeInstanceOf(Role);
      expect(userWithRole.role.id).toBe(mockRoleData.id);
      expect(userWithRole.role.name).toBe('ADMIN');
    });

    it('should handle role object with different role types', () => {
      const sellerRole = {
        ...mockRoleData,
        id: '123e4567-e89b-12d3-a456-426614174002',
        name: 'SELLER',
        permissions: ['products:read', 'products:write', 'orders:read']
      };

      const sellerUser = new User({
        ...mockUserData,
        roleId: sellerRole.id,
        role: sellerRole
      });

      expect(sellerUser.role.name).toBe('SELLER');
      expect(sellerUser.role.permissions).toContain('products:write');
      expect(sellerUser.role.permissions).not.toContain('admin:system');
    });

    it('should handle null role', () => {
      const userWithNullRole = new User({
        ...mockUserData,
        role: null
      } as any);

      expect(userWithNullRole.role).toBeNull();
    });

    it('should handle undefined role', () => {
      const userWithUndefinedRole = new User({
        ...mockUserData,
        role: undefined
      });

      expect(userWithUndefinedRole.role).toBeUndefined();
    });
  });

  describe('Role-Based User Creation', () => {
    it('should create admin user with correct role', () => {
      const adminUser = new User({
        email: 'admin@company.com',
        name: 'System Administrator',
        password: 'securehashedpassword',
        roleId: mockRoleData.id,
        isActive: true
      });

      expect(adminUser.email).toBe('admin@company.com');
      expect(adminUser.name).toBe('System Administrator');
      expect(adminUser.roleId).toBe(mockRoleData.id);
      expect(adminUser.isActive).toBe(true);
      expect(adminUser.password).toBeDefined(); // Should be excluded in serialization
    });

    it('should create seller user with seller role', () => {
      const sellerRoleId = 'seller-role-id';
      const sellerUser = new User({
        email: 'seller@shop.com',
        name: 'Shop Owner',
        password: 'sellerhashedpassword',
        roleId: sellerRoleId,
        isActive: true
      });

      expect(sellerUser.roleId).toBe(sellerRoleId);
      expect(sellerUser.email).toBe('seller@shop.com');
    });

    it('should create customer user with customer role', () => {
      const customerRoleId = 'customer-role-id';
      const customerUser = new User({
        email: 'customer@email.com',
        name: 'John Customer',
        password: 'customerhashedpassword',
        roleId: customerRoleId,
        isActive: true
      });

      expect(customerUser.roleId).toBe(customerRoleId);
      expect(customerUser.email).toBe('customer@email.com');
    });

    it('should create inactive user with role', () => {
      const inactiveUser = new User({
        ...mockUserData,
        isActive: false
      });

      expect(inactiveUser.isActive).toBe(false);
      expect(inactiveUser.roleId).toBe(mockRoleData.id);
    });
  });

  describe('Role Validation', () => {
    it('should validate UUID format for roleId', () => {
      const user = new User(mockUserData);
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(user.roleId).toMatch(uuidRegex);
    });

    it('should handle invalid roleId format (validation should happen at service level)', () => {
      const userWithInvalidRoleId = new User({
        ...mockUserData,
        roleId: 'invalid-uuid'
      });

      expect(userWithInvalidRoleId.roleId).toBe('invalid-uuid');
      // Note: Validation should be implemented at service or DTO level
    });

    it('should handle empty roleId', () => {
      const userWithEmptyRoleId = new User({
        ...mockUserData,
        roleId: ''
      });

      expect(userWithEmptyRoleId.roleId).toBe('');
    });
  });

  describe('Role-Based User Behavior', () => {
    it('should represent different user types through roles', () => {
      const adminRoleId = 'admin-role-id';
      const sellerRoleId = 'seller-role-id';
      const customerRoleId = 'customer-role-id';

      const adminUser = new User({ ...mockUserData, roleId: adminRoleId, email: 'admin@company.com' });
      const sellerUser = new User({ ...mockUserData, roleId: sellerRoleId, email: 'seller@shop.com' });
      const customerUser = new User({ ...mockUserData, roleId: customerRoleId, email: 'customer@email.com' });

      expect(adminUser.roleId).toBe(adminRoleId);
      expect(sellerUser.roleId).toBe(sellerRoleId);
      expect(customerUser.roleId).toBe(customerRoleId);

      expect(adminUser.email).toBe('admin@company.com');
      expect(sellerUser.email).toBe('seller@shop.com');
      expect(customerUser.email).toBe('customer@email.com');
    });

    it('should handle role changes', () => {
      const user = new User(mockUserData);
      const originalRoleId = user.roleId;

      // Simulate role change
      const newRoleId = 'new-role-id';
      user.roleId = newRoleId;

      expect(user.roleId).toBe(newRoleId);
      expect(user.roleId).not.toBe(originalRoleId);
    });

    it('should maintain user data when role changes', () => {
      const user = new User(mockUserData);
      const originalEmail = user.email;
      const originalName = user.name;

      user.roleId = 'different-role-id';

      expect(user.email).toBe(originalEmail);
      expect(user.name).toBe(originalName);
      expect(user.roleId).toBe('different-role-id');
    });
  });

  describe('Role and User Status Combinations', () => {
    it('should handle active admin user', () => {
      const activeAdmin = new User({
        ...mockUserData,
        roleId: mockRoleData.id,
        isActive: true
      });

      expect(activeAdmin.isActive).toBe(true);
      expect(activeAdmin.roleId).toBe(mockRoleData.id);
    });

    it('should handle inactive admin user', () => {
      const inactiveAdmin = new User({
        ...mockUserData,
        roleId: mockRoleData.id,
        isActive: false
      });

      expect(inactiveAdmin.isActive).toBe(false);
      expect(inactiveAdmin.roleId).toBe(mockRoleData.id);
    });

    it('should handle active seller user', () => {
      const activeSeller = new User({
        ...mockUserData,
        roleId: 'seller-role-id',
        isActive: true
      });

      expect(activeSeller.isActive).toBe(true);
      expect(activeSeller.roleId).toBe('seller-role-id');
    });

    it('should handle inactive customer user', () => {
      const inactiveCustomer = new User({
        ...mockUserData,
        roleId: 'customer-role-id',
        isActive: false
      });

      expect(inactiveCustomer.isActive).toBe(false);
      expect(inactiveCustomer.roleId).toBe('customer-role-id');
    });
  });

  describe('Edge Cases', () => {
    it('should handle user with role but no other data', () => {
      const userWithOnlyRole = new User({
        roleId: mockRoleData.id
      });

      expect(userWithOnlyRole.roleId).toBe(mockRoleData.id);
      expect(userWithOnlyRole.email).toBeUndefined();
      expect(userWithOnlyRole.name).toBeUndefined();
    });

    it('should handle user with all data including role', () => {
      const completeUser = new User({
        id: 'complete-user-id',
        email: 'complete@example.com',
        name: 'Complete User',
        password: 'hashedpassword',
        roleId: mockRoleData.id,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: undefined
      });

      expect(completeUser.roleId).toBe(mockRoleData.id);
      expect(completeUser.email).toBe('complete@example.com');
      expect(completeUser.name).toBe('Complete User');
      expect(completeUser.isActive).toBe(true);
    });

    it('should handle role assignment with special characters in roleId', () => {
      // Though roleId should be UUID, test edge case
      const userWithSpecialRoleId = new User({
        ...mockUserData,
        roleId: 'role-with-special-chars_123'
      });

      expect(userWithSpecialRoleId.roleId).toBe('role-with-special-chars_123');
    });
  });

  describe('Serialization and Role Data', () => {
    it('should include roleId in JSON serialization', () => {
      const user = new User(mockUserData);
      const jsonString = JSON.stringify(user);
      const parsed = JSON.parse(jsonString);

      expect(parsed.roleId).toBe(mockRoleData.id);
      expect(parsed.password).toBeUndefined(); // Should be excluded
    });

    it('should include role object in JSON when populated', () => {
      const userWithRole = new User({
        ...mockUserData,
        role: mockRoleData
      });

      const jsonString = JSON.stringify(userWithRole);
      const parsed = JSON.parse(jsonString);

      expect(parsed.role).toBeDefined();
      expect(parsed.role.id).toBe(mockRoleData.id);
      expect(parsed.role.name).toBe('ADMIN');
    });

    it('should handle role object serialization with permissions', () => {
      const roleWithPermissions = {
        ...mockRoleData,
        permissions: ['users:read', 'users:write', 'admin:system']
      };

      const userWithRole = new User({
        ...mockUserData,
        role: roleWithPermissions
      });

      const jsonString = JSON.stringify(userWithRole);
      const parsed = JSON.parse(jsonString);

      expect(parsed.role.permissions).toEqual(['users:read', 'users:write', 'admin:system']);
    });
  });

  describe('Database Field Mapping', () => {
    it('should map roleId to role_id in database', () => {
      const roleIdField = User.rawAttributes.roleId;
      expect(roleIdField.field).toBe('role_id');
    });

    it('should maintain roleId in application code', () => {
      const user = new User(mockUserData);
      expect(user.roleId).toBe(mockRoleData.id);
      expect(user['role_id']).toBeUndefined(); // Should not have snake_case version
    });
  });
});
