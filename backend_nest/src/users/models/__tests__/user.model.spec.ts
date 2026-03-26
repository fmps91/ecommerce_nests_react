import { User } from '../user.model';

// Mock Role to avoid circular dependency issues
const mockRoleData = {
  id: '123e4567-e89b-12d3-a456-426614174001',
  name: 'ADMIN',
  description: 'Administrator role',
  permissions: ['read', 'write', 'delete'],
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  updatedAt: new Date('2024-01-01T00:00:00.000Z'),
  deletedAt: undefined,
};

describe('User Model', () => {
  const mockUserData = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'admin@example.com',
    password: 'hashedPassword123',
    name: 'Admin User',
    roleId: '123e4567-e89b-12d3-a456-426614174001',
    isActive: true,
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
    deletedAt: undefined,
    role: mockRoleData,
  };

  describe('model structure', () => {
    it('should have correct table configuration', () => {
      // Test that the User model extends Sequelize Model
      expect(User.prototype.constructor.name).toBe('User');
    });

    it('should have all required fields', () => {
      const user = new User(mockUserData);

      expect(user.id).toBeDefined();
      expect(user.email).toBeDefined();
      expect(user.password).toBeDefined();
      expect(user.name).toBeDefined();
      expect(user.roleId).toBeDefined();
      expect(user.isActive).toBeDefined();
      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();
      expect(user.deletedAt).toBeDefined();
    });
  });

  describe('field types and validation', () => {
    it('should handle correct field types', () => {
      const user = new User(mockUserData);

      expect(typeof user.id).toBe('string');
      expect(typeof user.email).toBe('string');
      expect(typeof user.password).toBe('string');
      expect(typeof user.name).toBe('string');
      expect(typeof user.roleId).toBe('string');
      expect(typeof user.isActive).toBe('boolean');
      expect(user.createdAt instanceof Date).toBe(true);
      expect(user.updatedAt instanceof Date).toBe(true);
    });

    it('should handle UUID format for id', () => {
      const user = new User(mockUserData);

      expect(user.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should handle UUID format for roleId', () => {
      const user = new User(mockUserData);

      expect(user.roleId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should handle email format', () => {
      const user = new User(mockUserData);

      expect(user.email).toBe('admin@example.com');
      expect(user.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });

    it('should handle boolean isActive field', () => {
      const activeUser = new User({ ...mockUserData, isActive: true });
      const inactiveUser = new User({ ...mockUserData, isActive: false });

      expect(activeUser.isActive).toBe(true);
      expect(inactiveUser.isActive).toBe(false);
      expect(typeof activeUser.isActive).toBe('boolean');
      expect(typeof inactiveUser.isActive).toBe('boolean');
    });
  });

  describe('date handling', () => {
    it('should handle Date objects correctly', () => {
      const testDate = new Date('2024-12-25T15:30:00.000Z');
      const userWithDates = {
        ...mockUserData,
        createdAt: testDate,
        updatedAt: testDate,
      };

      const user = new User(userWithDates);

      expect(user.createdAt).toBe(testDate);
      expect(user.updatedAt).toBe(testDate);
      expect(user.createdAt instanceof Date).toBe(true);
      expect(user.updatedAt instanceof Date).toBe(true);
    });

    it('should handle null deletedAt', () => {
      const userWithNullDeletedAt = {
        ...mockUserData,
        deletedAt: null,
      };

      const user = new User(userWithNullDeletedAt);

      expect(user.deletedAt).toBeNull();
    });

    it('should handle undefined deletedAt', () => {
      const userWithUndefinedDeletedAt = {
        ...mockUserData,
        deletedAt: undefined,
      };

      const user = new User(userWithUndefinedDeletedAt);

      expect(user.deletedAt).toBeUndefined();
    });

    it('should handle deletedAt as Date', () => {
      const deletedDate = new Date('2024-06-01T00:00:00.000Z');
      const userWithDeletedAt = {
        ...mockUserData,
        deletedAt: deletedDate,
      };

      const user = new User(userWithDeletedAt);

      expect(user.deletedAt).toBe(deletedDate);
      expect(user.deletedAt instanceof Date).toBe(true);
    });
  });

  describe('email handling', () => {
    it('should handle valid email formats', () => {
      const validEmails = [
        'user@example.com',
        'test.email+tag@domain.co.uk',
        'user123@test-domain.com',
        'firstname.lastname@company.org',
      ];

      validEmails.forEach(email => {
        const user = new User({ ...mockUserData, email });
        expect(user.email).toBe(email);
        expect(typeof user.email).toBe('string');
      });
    });

    it('should handle edge case emails', () => {
      const edgeEmails = [
        'a@b.co',
        'very.long.email.address@very.long.domain.name.com',
        'user@sub.domain.com',
      ];

      edgeEmails.forEach(email => {
        const user = new User({ ...mockUserData, email });
        expect(user.email).toBe(email);
        expect(typeof user.email).toBe('string');
      });
    });

    it('should handle empty email', () => {
      const userWithEmptyEmail = new User({ ...mockUserData, email: '' });

      expect(userWithEmptyEmail.email).toBe('');
      expect(typeof userWithEmptyEmail.email).toBe('string');
    });
  });

  describe('password handling', () => {
    it('should handle password field correctly', () => {
      const user = new User(mockUserData);

      expect(user.password).toBe('hashedPassword123');
      expect(typeof user.password).toBe('string');
    });

    it('should handle empty password', () => {
      const userWithEmptyPassword = new User({ ...mockUserData, password: '' });

      expect(userWithEmptyPassword.password).toBe('');
      expect(typeof userWithEmptyPassword.password).toBe('string');
    });

    it('should handle long password', () => {
      const longPassword = 'a'.repeat(100);
      const userWithLongPassword = new User({ ...mockUserData, password: longPassword });

      expect(userWithLongPassword.password).toBe(longPassword);
      expect(typeof userWithLongPassword.password).toBe('string');
    });

    it('should handle special characters in password', () => {
      const specialPassword = 'P@$$w0rd!@#$%^&*()_+-=[]{}|;:,.<>?';
      const userWithSpecialPassword = new User({ ...mockUserData, password: specialPassword });

      expect(userWithSpecialPassword.password).toBe(specialPassword);
      expect(typeof userWithSpecialPassword.password).toBe('string');
    });
  });

  describe('name handling', () => {
    it('should handle name field correctly', () => {
      const user = new User(mockUserData);

      expect(user.name).toBe('Admin User');
      expect(typeof user.name).toBe('string');
    });

    it('should handle empty name', () => {
      const userWithEmptyName = new User({ ...mockUserData, name: '' });

      expect(userWithEmptyName.name).toBe('');
      expect(typeof userWithEmptyName.name).toBe('string');
    });

    it('should handle very long name', () => {
      const longName = 'a'.repeat(100);
      const userWithLongName = new User({ ...mockUserData, name: longName });

      expect(userWithLongName.name).toBe(longName);
      expect(typeof userWithLongName.name).toBe('string');
    });

    it('should handle special characters in name', () => {
      const specialName = 'José María García-Ñiño 🎉';
      const userWithSpecialName = new User({ ...mockUserData, name: specialName });

      expect(userWithSpecialName.name).toBe(specialName);
      expect(typeof userWithSpecialName.name).toBe('string');
    });
  });

  describe('role relationship', () => {
    it('should handle role object correctly', () => {
      const user = new User(mockUserData);

      expect(user.role).toBeDefined();
      expect(user.role.id).toBe(mockRoleData.id);
      expect(user.role.name).toBe(mockRoleData.name);
      expect(user.role.description).toBe(mockRoleData.description);
    });

    it('should handle null role', () => {
      const userWithNullRole = {
        ...mockUserData,
        role: null,
      };

      const user = new User(userWithNullRole);

      expect(user.role).toBeNull();
    });

    it('should handle undefined role', () => {
      const userWithUndefinedRole = {
        ...mockUserData,
        role: undefined,
      };

      const user = new User(userWithUndefinedRole);

      expect(user.role).toBeUndefined();
    });
  });

  describe('serialization', () => {
    it('should be serializable to JSON', () => {
      const user = new User(mockUserData);
      const jsonString = JSON.stringify(user);
      const parsed = JSON.parse(jsonString);

      expect(parsed.id).toBe(mockUserData.id);
      expect(parsed.email).toBe(mockUserData.email);
      expect(parsed.name).toBe(mockUserData.name);
      expect(parsed.roleId).toBe(mockUserData.roleId);
      expect(parsed.isActive).toBe(mockUserData.isActive);
      expect(parsed.createdAt).toBe(mockUserData.createdAt.toISOString());
      expect(parsed.updatedAt).toBe(mockUserData.updatedAt.toISOString());
      expect(parsed.deletedAt).toBeUndefined();
    });

    it('should exclude password from serialization', () => {
      const user = new User(mockUserData);
      const jsonString = JSON.stringify(user);
      const parsed = JSON.parse(jsonString);

      expect(parsed.password).toBeUndefined();
    });

    it('should serialize partial data correctly', () => {
      const partialUser = new User({
        id: 'test-id',
        email: 'test@example.com',
        name: 'Test User',
      });

      const jsonString = JSON.stringify(partialUser);
      const parsed = JSON.parse(jsonString);

      expect(parsed.id).toBe('test-id');
      expect(parsed.email).toBe('test@example.com');
      expect(parsed.name).toBe('Test User');
      expect(parsed.roleId).toBeUndefined();
      expect(parsed.isActive).toBeUndefined();
    });

    it('should handle null values in serialization', () => {
      const userWithNulls = new User({
        id: 'test-id',
        deletedAt: null,
        role: null,
      } as any);

      const jsonString = JSON.stringify(userWithNulls);
      const parsed = JSON.parse(jsonString);

      expect(parsed.id).toBe('test-id');
      expect(parsed.deletedAt).toBe(null);
      expect(parsed.role).toBe(null);
    });
  });

  describe('edge cases', () => {
    it('should handle minimal data', () => {
      const minimalUser = new User({
        id: 'minimal-id',
        email: 'minimal@example.com',
        name: 'Minimal User',
        password: 'password',
        roleId: 'role-id',
      });

      expect(minimalUser.id).toBe('minimal-id');
      expect(minimalUser.email).toBe('minimal@example.com');
      expect(minimalUser.name).toBe('Minimal User');
      expect(minimalUser.password).toBe('password');
      expect(minimalUser.roleId).toBe('role-id');
    });

    it('should handle very long email', () => {
      const longEmail = 'very.long.email.address.that.exceeds.normal.length@very.long.domain.name.that.is.also.extremely.long.com';
      const userWithLongEmail = new User({ ...mockUserData, email: longEmail });

      expect(userWithLongEmail.email).toBe(longEmail);
      expect(typeof userWithLongEmail.email).toBe('string');
    });

    it('should handle boolean conversion', () => {
      const userWithTruthy = new User({ ...mockUserData, isActive: 1 } as any);
      const userWithFalsy = new User({ ...mockUserData, isActive: 0 } as any);

      // Note: Sequelize handles boolean conversion, this tests the raw assignment
      expect(typeof userWithTruthy.isActive).toBe('number');
      expect(typeof userWithFalsy.isActive).toBe('number');
    });
  });

  describe('model methods and behavior', () => {
    it('should handle Sequelize model methods', () => {
      const user = new User(mockUserData);

      // Test that it's a Sequelize Model instance
      expect(typeof user.save).toBe('function');
      expect(typeof user.reload).toBe('function');
      expect(typeof user.destroy).toBe('function');
      expect(typeof user.update).toBe('function');
    });

    it('should handle dataValues property', () => {
      const user = new User(mockUserData);

      // Sequelize models have dataValues property
      expect(user.dataValues).toBeDefined();
      expect(typeof user.dataValues).toBe('object');
    });

    it('should handle isNewRecord property', () => {
      const user = new User(mockUserData);

      // Sequelize models have isNewRecord property
      expect(typeof user.isNewRecord).toBe('boolean');
    });
  });
});
