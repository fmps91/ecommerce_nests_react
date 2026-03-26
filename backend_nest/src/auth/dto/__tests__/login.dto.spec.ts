import { validate } from 'class-validator';
import { LoginDto } from '../login.dto';

describe('LoginDto', () => {
  it('should validate a valid login DTO', async () => {
    const loginDto = new LoginDto();
    loginDto.email = 'test@example.com';
    loginDto.password = 'password123';

    const errors = await validate(loginDto);
    expect(errors).toHaveLength(0);
  });

  it('should reject invalid email', async () => {
    const loginDto = new LoginDto();
    loginDto.email = 'invalid-email';
    loginDto.password = 'password123';

    const errors = await validate(loginDto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('email');
    expect(errors[0].constraints).toHaveProperty('isEmail');
  });

  it('should reject empty email', async () => {
    const loginDto = new LoginDto();
    loginDto.email = '';
    loginDto.password = 'password123';

    const errors = await validate(loginDto);
    expect(errors).toHaveLength(2); // isEmail y isNotEmpty
  });

  it('should reject empty password', async () => {
    const loginDto = new LoginDto();
    loginDto.email = 'test@example.com';
    loginDto.password = '';

    const errors = await validate(loginDto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('password');
  });

  it('should reject missing fields', async () => {
    const loginDto = new LoginDto();

    const errors = await validate(loginDto);
    expect(errors).toHaveLength(4); // email: isEmail, isNotEmpty; password: isNotEmpty
  });
});
