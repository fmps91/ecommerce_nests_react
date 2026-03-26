import { validate } from 'class-validator';
import { ResetPasswordDto } from '../reset-password.dto';

describe('ResetPasswordDto', () => {
  it('should validate a valid reset password DTO', async () => {
    const resetPasswordDto = new ResetPasswordDto();
    resetPasswordDto.token = 'valid-token-123';
    resetPasswordDto.newPassword = 'newPassword123';

    const errors = await validate(resetPasswordDto);
    expect(errors).toHaveLength(0);
  });

  it('should reject empty token', async () => {
    const resetPasswordDto = new ResetPasswordDto();
    resetPasswordDto.token = '';
    resetPasswordDto.newPassword = 'newPassword123';

    const errors = await validate(resetPasswordDto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('token');
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should reject short password', async () => {
    const resetPasswordDto = new ResetPasswordDto();
    resetPasswordDto.token = 'valid-token-123';
    resetPasswordDto.newPassword = '123';

    const errors = await validate(resetPasswordDto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('newPassword');
    expect(errors[0].constraints).toHaveProperty('minLength');
  });

  it('should reject empty password', async () => {
    const resetPasswordDto = new ResetPasswordDto();
    resetPasswordDto.token = 'valid-token-123';
    resetPasswordDto.newPassword = '';

    const errors = await validate(resetPasswordDto);
    expect(errors).toHaveLength(2); // isNotEmpty y minLength
  });

  it('should reject missing fields', async () => {
    const resetPasswordDto = new ResetPasswordDto();

    const errors = await validate(resetPasswordDto);
    expect(errors).toHaveLength(4); // token: isNotEmpty; newPassword: isNotEmpty, minLength
  });
});
