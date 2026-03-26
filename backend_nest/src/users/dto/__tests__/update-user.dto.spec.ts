import { validate } from 'class-validator';
import { UpdateUserDto } from '../update-user.dto';
import { plainToInstance } from 'class-transformer';

describe('UpdateUserDto', () => {
  const validUpdateData = {
    email: 'updated@example.com',
    name: 'Updated Name',
    roleId: 'updated-role-id',
    isActive: false,
  };

  describe('validation', () => {
    it('should validate with all fields', async () => {
      const dto = plainToInstance(UpdateUserDto, validUpdateData);
      const errors = await validate(dto);

      expect(errors.length).toBe(0);
    });

    it('should validate with partial data', async () => {
      const dto = plainToInstance(UpdateUserDto, {
        name: 'Updated Name Only',
      });
      const errors = await validate(dto);

      expect(errors.length).toBe(0);
    });

    it('should validate with single field', async () => {
      const dto = plainToInstance(UpdateUserDto, {
        email: 'single@example.com',
      });
      const errors = await validate(dto);

      expect(errors.length).toBe(0);
    });

    it('should validate empty object', async () => {
      const dto = plainToInstance(UpdateUserDto, {});
      const errors = await validate(dto);

      expect(errors.length).toBe(0);
    });

    it('should validate email format when provided', async () => {
      const dto = plainToInstance(UpdateUserDto, {
        email: 'invalid-email-format',
      });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('email');
    });

    it('should validate name minimum length when provided', async () => {
      const dto = plainToInstance(UpdateUserDto, {
        name: 'a',
      });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('name');
    });

    it('should validate password minimum length when provided', async () => {
      const dto = plainToInstance(UpdateUserDto, {
        password: '123',
      });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('password');
    });

    it('should accept valid password when provided', async () => {
      const dto = plainToInstance(UpdateUserDto, {
        password: 'validpassword123',
      });
      const errors = await validate(dto);

      expect(errors.length).toBe(0);
    });

    it('should accept boolean isActive', async () => {
      const dto = plainToInstance(UpdateUserDto, {
        isActive: true,
      });
      const errors = await validate(dto);

      expect(errors.length).toBe(0);
      expect(dto.isActive).toBe(true);
    });

    it('should accept string roleId', async () => {
      const dto = plainToInstance(UpdateUserDto, {
        roleId: 'new-role-id-123',
      });
      const errors = await validate(dto);

      expect(errors.length).toBe(0);
      expect(dto.roleId).toBe('new-role-id-123');
    });

    it('should handle multiple valid fields', async () => {
      const dto = plainToInstance(UpdateUserDto, {
        email: 'multi@example.com',
        name: 'Multi Update',
        isActive: false,
      });
      const errors = await validate(dto);

      expect(errors.length).toBe(0);
      expect(dto.email).toBe('multi@example.com');
      expect(dto.name).toBe('Multi Update');
      expect(dto.isActive).toBe(false);
    });
  });

  describe('inheritance', () => {
    it('should inherit validation rules from CreateUserDto', async () => {
      // Test that it inherits the same validation rules
      const invalidDto = plainToInstance(UpdateUserDto, {
        email: 'invalid-email',
        name: 'a',
        password: '123',
      });
      const errors = await validate(invalidDto);

      expect(errors.length).toBeGreaterThan(0);
      
      const errorProperties = errors.map(error => error.property);
      expect(errorProperties).toContain('email');
      expect(errorProperties).toContain('name');
      expect(errorProperties).toContain('password');
    });

    it('should allow all CreateUserDto fields to be optional', async () => {
      // Test that all fields that are required in CreateUserDto are now optional
      const dto = plainToInstance(UpdateUserDto, {});
      const errors = await validate(dto);

      expect(errors.length).toBe(0);
    });
  });

  describe('constructor', () => {
    it('should create instance with partial data', () => {
      const partialData = {
        email: 'constructor@example.com',
        name: 'Constructor Test',
      };

      const dto = new UpdateUserDto();
      Object.assign(dto, partialData);

      expect(dto.email).toBe('constructor@example.com');
      expect(dto.name).toBe('Constructor Test');
    });

    it('should initialize with undefined for missing fields', () => {
      const dto = new UpdateUserDto();

      expect(dto.email).toBeUndefined();
      expect(dto.name).toBeUndefined();
      expect(dto.password).toBeUndefined();
      expect(dto.roleId).toBeUndefined();
      expect(dto.isActive).toBeUndefined();
    });
  });
});
