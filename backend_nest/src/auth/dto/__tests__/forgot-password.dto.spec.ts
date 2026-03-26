import { validate } from 'class-validator';
import { ForgotPasswordDto } from '../forgot-password.dto';

describe('ForgotPasswordDto', () => {
  it('should validate a valid forgot password DTO', async () => {
    const forgotPasswordDto = new ForgotPasswordDto();
    forgotPasswordDto.email = 'test@example.com';

    const errors = await validate(forgotPasswordDto);
    expect(errors).toHaveLength(0);
  });

  it('should reject invalid email', async () => {
    const forgotPasswordDto = new ForgotPasswordDto();
    forgotPasswordDto.email = 'invalid-email';

    const errors = await validate(forgotPasswordDto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('email');
    expect(errors[0].constraints).toHaveProperty('isEmail');
  });

  it('should reject empty email', async () => {
    const forgotPasswordDto = new ForgotPasswordDto();
    forgotPasswordDto.email = '';

    const errors = await validate(forgotPasswordDto);
    expect(errors).toHaveLength(2); // isEmail y isNotEmpty
  });

  it('should reject missing email', async () => {
    const forgotPasswordDto = new ForgotPasswordDto();

    const errors = await validate(forgotPasswordDto);
    expect(errors).toHaveLength(2);
  });
});
