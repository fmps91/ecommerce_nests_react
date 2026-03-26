import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateRoleDto } from '../create-role.dto';

describe('CreateRoleDto', () => {
  describe('name validation', () => {
    it('should pass with valid name', async () => {
      const dto = plainToInstance(CreateRoleDto, {
        name: 'ADMIN',
        description: 'Administrator role',
        permissions: ['read', 'write'],
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail when name is empty', async () => {
      const dto = plainToInstance(CreateRoleDto, {
        name: '',
        description: 'Administrator role',
        permissions: ['read', 'write'],
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isString');
      expect(errors[0].constraints).toHaveProperty('minLength');
    });

    it('should fail when name is too short (less than 3 characters)', async () => {
      const dto = plainToInstance(CreateRoleDto, {
        name: 'AB',
        description: 'Administrator role',
        permissions: ['read', 'write'],
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('minLength');
    });

    it('should fail when name is too long (more than 50 characters)', async () => {
      const dto = plainToInstance(CreateRoleDto, {
        name: 'A'.repeat(51),
        description: 'Administrator role',
        permissions: ['read', 'write'],
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('maxLength');
    });

    it('should fail when name is not a string', async () => {
      const dto = plainToInstance(CreateRoleDto, {
        name: 123,
        description: 'Administrator role',
        permissions: ['read', 'write'],
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isString');
    });

    it('should fail when name is missing', async () => {
      const dto = plainToInstance(CreateRoleDto, {
        description: 'Administrator role',
        permissions: ['read', 'write'],
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isString');
    });
  });

  describe('description validation', () => {
    it('should pass with valid description', async () => {
      const dto = plainToInstance(CreateRoleDto, {
        name: 'ADMIN',
        description: 'Administrator role with full permissions',
        permissions: ['read', 'write'],
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass when description is missing (optional field)', async () => {
      const dto = plainToInstance(CreateRoleDto, {
        name: 'ADMIN',
        permissions: ['read', 'write'],
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass when description is empty string', async () => {
      const dto = plainToInstance(CreateRoleDto, {
        name: 'ADMIN',
        description: '',
        permissions: ['read', 'write'],
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail when description is too long (more than 200 characters)', async () => {
      const dto = plainToInstance(CreateRoleDto, {
        name: 'ADMIN',
        description: 'A'.repeat(201),
        permissions: ['read', 'write'],
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('maxLength');
    });

    it('should fail when description is not a string', async () => {
      const dto = plainToInstance(CreateRoleDto, {
        name: 'ADMIN',
        description: 123,
        permissions: ['read', 'write'],
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isString');
    });
  });

  describe('permissions validation', () => {
    it('should pass with valid permissions array', async () => {
      const dto = plainToInstance(CreateRoleDto, {
        name: 'ADMIN',
        description: 'Administrator role',
        permissions: ['read', 'write', 'delete', 'execute'],
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass when permissions is missing (optional field)', async () => {
      const dto = plainToInstance(CreateRoleDto, {
        name: 'ADMIN',
        description: 'Administrator role',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass when permissions is empty array', async () => {
      const dto = plainToInstance(CreateRoleDto, {
        name: 'ADMIN',
        description: 'Administrator role',
        permissions: [],
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail when permissions is not an array', async () => {
      const dto = plainToInstance(CreateRoleDto, {
        name: 'ADMIN',
        description: 'Administrator role',
        permissions: 'read,write',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isArray');
    });

    it('should fail when permissions array contains non-string elements', async () => {
      const dto = plainToInstance(CreateRoleDto, {
        name: 'ADMIN',
        description: 'Administrator role',
        permissions: ['read', 123, 'write'],
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isString');
    });

    it('should fail when permissions array contains null elements', async () => {
      const dto = plainToInstance(CreateRoleDto, {
        name: 'ADMIN',
        description: 'Administrator role',
        permissions: ['read', null, 'write'],
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isString');
    });

    it('should fail when permissions array contains undefined elements', async () => {
      const dto = plainToInstance(CreateRoleDto, {
        name: 'ADMIN',
        description: 'Administrator role',
        permissions: ['read', undefined, 'write'],
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isString');
    });
  });

  describe('edge cases', () => {
    it('should pass with minimum valid data (only name)', async () => {
      const dto = plainToInstance(CreateRoleDto, {
        name: 'USER',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass with name at minimum length (3 characters)', async () => {
      const dto = plainToInstance(CreateRoleDto, {
        name: 'USR',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass with name at maximum length (50 characters)', async () => {
      const dto = plainToInstance(CreateRoleDto, {
        name: 'A'.repeat(50),
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass with description at maximum length (200 characters)', async () => {
      const dto = plainToInstance(CreateRoleDto, {
        name: 'ADMIN',
        description: 'A'.repeat(200),
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass with special characters in name', async () => {
      const dto = plainToInstance(CreateRoleDto, {
        name: 'ROLE_123',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass with spaces in name', async () => {
      const dto = plainToInstance(CreateRoleDto, {
        name: 'Role Name',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass with complex permissions array', async () => {
      const dto = plainToInstance(CreateRoleDto, {
        name: 'ADMIN',
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
  });

  describe('transformation', () => {
    it('should transform plain object to CreateRoleDto instance', () => {
      const plainData = {
        name: 'ADMIN',
        description: 'Administrator role',
        permissions: ['read', 'write'],
      };

      const dto = plainToInstance(CreateRoleDto, plainData);

      expect(dto).toBeInstanceOf(CreateRoleDto);
      expect(dto.name).toBe('ADMIN');
      expect(dto.description).toBe('Administrator role');
      expect(dto.permissions).toEqual(['read', 'write']);
    });

    it('should handle null input gracefully', () => {
      const dto = plainToInstance(CreateRoleDto, null);

      expect(dto).toBeInstanceOf(CreateRoleDto);
    });

    it('should handle undefined input gracefully', () => {
      const dto = plainToInstance(CreateRoleDto, undefined);

      expect(dto).toBeInstanceOf(CreateRoleDto);
    });
  });
});
