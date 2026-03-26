import { validate } from 'class-validator';
import { CreateUserDto } from '../create-user.dto';
import { plainToInstance } from 'class-transformer';

describe('CreateUserDto', () => {
  const validUserData = {
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User',
    roleId: '123e4567-e89b-12d3-a456-426614174000',
    isActive: true,
  };

  describe('validation', () => {
    it('should validate a valid user', async () => {
      const dto = plainToInstance(CreateUserDto, validUserData);
      const errors = await validate(dto);

      expect(errors.length).toBe(0);
    });

    it('should require email', async () => {
      const dto = plainToInstance(CreateUserDto, { ...validUserData, email: '' });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('email');
    });

    it('should validate email format', async () => {
      const dto = plainToInstance(CreateUserDto, { ...validUserData, email: 'invalid-email' });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('email');
    });

    it('should require password', async () => {
      const dto = plainToInstance(CreateUserDto, { ...validUserData, password: '' });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('password');
    });

    it('should validate password minimum length', async () => {
      const dto = plainToInstance(CreateUserDto, { ...validUserData, password: '123' });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('password');
    });

    it('should require name', async () => {
      const dto = plainToInstance(CreateUserDto, { ...validUserData, name: '' });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('name');
    });

    it('should validate name minimum length', async () => {
      const dto = plainToInstance(CreateUserDto, { ...validUserData, name: 'a' });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('name');
    });

    it('should accept valid optional fields', async () => {
      const dto = plainToInstance(CreateUserDto, {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      });
      const errors = await validate(dto);

      expect(errors.length).toBe(0);
    });

    it('should accept boolean isActive', async () => {
      const dto = plainToInstance(CreateUserDto, {
        ...validUserData,
        isActive: false,
      });
      const errors = await validate(dto);

      expect(errors.length).toBe(0);
      expect(dto.isActive).toBe(false);
    });

    it('should accept string roleId', async () => {
      const dto = plainToInstance(CreateUserDto, {
        ...validUserData,
        roleId: 'custom-role-id',
      });
      const errors = await validate(dto);

      expect(errors.length).toBe(0);
      expect(dto.roleId).toBe('custom-role-id');
    });
  });

  describe('constructor', () => {
    it('should create instance with partial data', () => {
      const partialData = {
        email: 'test@example.com',
        name: 'Test User',
      };

      const dto = new CreateUserDto();
      Object.assign(dto, partialData);

      expect(dto.email).toBe('test@example.com');
      expect(dto.name).toBe('Test User');
    });
  });
});
