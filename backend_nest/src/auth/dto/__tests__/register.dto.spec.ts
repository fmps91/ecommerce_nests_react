import { validate } from 'class-validator';
import { RegisterDto } from '../register.dto';

describe('RegisterDto', () => {
  it('should validate a valid register DTO', async () => {
    const registerDto = new RegisterDto();
    registerDto.name = 'John Doe';
    registerDto.email = 'john@example.com';
    registerDto.password = 'password123';
    registerDto.roleId = 'user-role-id';

    const errors = await validate(registerDto);
    expect(errors).toHaveLength(0);
  });

  it('should reject invalid email', async () => {
    const registerDto = new RegisterDto();
    registerDto.name = 'John Doe';
    registerDto.email = 'invalid-email';
    registerDto.password = 'password123';
    registerDto.roleId = 'user-role-id';

    const errors = await validate(registerDto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('email');
  });

  it('should reject short password', async () => {
    const registerDto = new RegisterDto();
    registerDto.name = 'John Doe';
    registerDto.email = 'john@example.com';
    registerDto.password = '123';
    registerDto.roleId = 'user-role-id';

    const errors = await validate(registerDto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('password');
    expect(errors[0].constraints).toHaveProperty('minLength');
  });

  it('should reject empty name', async () => {
    const registerDto = new RegisterDto();
    registerDto.name = '';
    registerDto.email = 'john@example.com';
    registerDto.password = 'password123';
    registerDto.roleId = 'user-role-id';

    const errors = await validate(registerDto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('name');
  });

  it('should reject empty roleId', async () => {
    const registerDto = new RegisterDto();
    registerDto.name = 'John Doe';
    registerDto.email = 'john@example.com';
    registerDto.password = 'password123';
    registerDto.roleId = '';

    const errors = await validate(registerDto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('roleId');
  });
});
