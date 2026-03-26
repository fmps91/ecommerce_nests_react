import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UpdateRoleDto } from '../update-role.dto';

describe('UpdateRoleDto', () => {
  describe('partial update validation', () => {
    it('should pass with empty object (no fields to update)', async () => {
      const dto = plainToInstance(UpdateRoleDto, {});

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass with only name field', async () => {
      const dto = plainToInstance(UpdateRoleDto, {
        name: 'UPDATED_ROLE',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass with only description field', async () => {
      const dto = plainToInstance(UpdateRoleDto, {
        description: 'Updated role description',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass with only permissions field', async () => {
      const dto = plainToInstance(UpdateRoleDto, {
        permissions: ['read', 'write'],
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass with all fields', async () => {
      const dto = plainToInstance(UpdateRoleDto, {
        name: 'UPDATED_ROLE',
        description: 'Updated role description',
        permissions: ['read', 'write', 'execute'],
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });

  describe('name validation', () => {
    it('should pass with valid name', async () => {
      const dto = plainToInstance(UpdateRoleDto, {
        name: 'ADMIN',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail when name is empty string', async () => {
      const dto = plainToInstance(UpdateRoleDto, {
        name: '',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('minLength');
    });

    it('should fail when name is too short (less than 3 characters)', async () => {
      const dto = plainToInstance(UpdateRoleDto, {
        name: 'AB',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('minLength');
    });

    it('should fail when name is too long (more than 50 characters)', async () => {
      const dto = plainToInstance(UpdateRoleDto, {
        name: 'A'.repeat(51),
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('maxLength');
    });

    it('should fail when name is not a string', async () => {
      const dto = plainToInstance(UpdateRoleDto, {
        name: 123,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isString');
    });
  });

  describe('description validation', () => {
    it('should pass with valid description', async () => {
      const dto = plainToInstance(UpdateRoleDto, {
        description: 'Updated role description',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass when description is empty string', async () => {
      const dto = plainToInstance(UpdateRoleDto, {
        description: '',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail when description is too long (more than 200 characters)', async () => {
      const dto = plainToInstance(UpdateRoleDto, {
        description: 'A'.repeat(201),
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('maxLength');
    });

    it('should fail when description is not a string', async () => {
      const dto = plainToInstance(UpdateRoleDto, {
        description: 123,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isString');
    });
  });

  describe('permissions validation', () => {
    it('should pass with valid permissions array', async () => {
      const dto = plainToInstance(UpdateRoleDto, {
        permissions: ['read', 'write', 'delete'],
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass when permissions is empty array', async () => {
      const dto = plainToInstance(UpdateRoleDto, {
        permissions: [],
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail when permissions is not an array', async () => {
      const dto = plainToInstance(UpdateRoleDto, {
        permissions: 'read,write',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isArray');
    });

    it('should fail when permissions array contains non-string elements', async () => {
      const dto = plainToInstance(UpdateRoleDto, {
        permissions: ['read', 123, 'write'],
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isString');
    });

    it('should fail when permissions array contains null elements', async () => {
      const dto = plainToInstance(UpdateRoleDto, {
        permissions: ['read', null, 'write'],
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isString');
    });
  });

  describe('edge cases', () => {
    it('should pass with name at minimum length (3 characters)', async () => {
      const dto = plainToInstance(UpdateRoleDto, {
        name: 'USR',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass with name at maximum length (50 characters)', async () => {
      const dto = plainToInstance(UpdateRoleDto, {
        name: 'A'.repeat(50),
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass with description at maximum length (200 characters)', async () => {
      const dto = plainToInstance(UpdateRoleDto, {
        description: 'A'.repeat(200),
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass with special characters in name', async () => {
      const dto = plainToInstance(UpdateRoleDto, {
        name: 'ROLE_123',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass with spaces in name', async () => {
      const dto = plainToInstance(UpdateRoleDto, {
        name: 'Role Name',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass with complex permissions array', async () => {
      const dto = plainToInstance(UpdateRoleDto, {
        permissions: [
          'read:users',
          'write:users',
          'delete:users',
          'manage:roles',
          'system:admin',
        ],
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass with null values for optional fields', async () => {
      const dto = plainToInstance(UpdateRoleDto, {
        name: null,
        description: null,
        permissions: null,
      });

      const errors = await validate(dto);
      // Note: This behavior depends on how class-transformer handles null values
      // In most cases, null values for optional fields should be acceptable
      expect(errors).toHaveLength(0);
    });
  });

  describe('transformation', () => {
    it('should transform plain object to UpdateRoleDto instance', () => {
      const plainData = {
        name: 'UPDATED_ROLE',
        description: 'Updated description',
        permissions: ['read', 'write'],
      };

      const dto = plainToInstance(UpdateRoleDto, plainData);

      expect(dto).toBeInstanceOf(UpdateRoleDto);
      expect(dto.name).toBe('UPDATED_ROLE');
      expect(dto.description).toBe('Updated description');
      expect(dto.permissions).toEqual(['read', 'write']);
    });

    it('should handle null input gracefully', () => {
      const dto = plainToInstance(UpdateRoleDto, null);

      expect(dto).toBeInstanceOf(UpdateRoleDto);
    });

    it('should handle undefined input gracefully', () => {
      const dto = plainToInstance(UpdateRoleDto, undefined);

      expect(dto).toBeInstanceOf(UpdateRoleDto);
    });

    it('should preserve only provided fields', () => {
      const plainData = {
        name: 'UPDATED_ROLE',
        // description and permissions are intentionally omitted
      };

      const dto = plainToInstance(UpdateRoleDto, plainData);

      expect(dto.name).toBe('UPDATED_ROLE');
      expect(dto.description).toBeUndefined();
      expect(dto.permissions).toBeUndefined();
    });
  });

  describe('inheritance from CreateRoleDto', () => {
    it('should inherit validation rules from CreateRoleDto', async () => {
      // Test that the same validation rules apply
      const invalidDto = plainToInstance(UpdateRoleDto, {
        name: 'AB', // Too short
        description: 'A'.repeat(201), // Too long
        permissions: 'not-an-array', // Wrong type
      });

      const errors = await validate(invalidDto);
      expect(errors.length).toBeGreaterThan(0);
      
      // Check for specific validation errors
      const errorConstraints = errors.flatMap(error => Object.keys(error.constraints || {}));
      expect(errorConstraints).toContain('minLength');
      expect(errorConstraints).toContain('maxLength');
      expect(errorConstraints).toContain('isArray');
    });

    it('should allow partial updates unlike CreateRoleDto', async () => {
      // UpdateRoleDto should allow empty objects (no fields to update)
      const updateDto = plainToInstance(UpdateRoleDto, {});
      const updateErrors = await validate(updateDto);
      expect(updateErrors).toHaveLength(0);

      // CreateRoleDto would require at least the name field
      // This test confirms the partial nature of UpdateRoleDto
    });
  });
});
