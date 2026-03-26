import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';

describe('AuthController (Integration)', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn(),
    register: jest.fn(),
    forgotPassword: jest.fn(),
    resetPassword: jest.fn(),
    sendTestEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(authService).toBeDefined();
  });

  describe('POST /auth/login', () => {
    it('should return access token and user data on successful login', async () => {
      const loginDto: LoginDto = {
        email: 'john@example.com',
        password: 'password123',
      };

      const expectedResponse = {
        access_token: 'jwt-token',
        user: {
          id: 'user-123',
          name: 'John Doe',
          rol: 'user',
        },
      };

      mockAuthService.login.mockResolvedValue(expectedResponse);

      const result = await controller.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(expectedResponse);
    });

    it('should throw UnauthorizedException on invalid credentials', async () => {
      const loginDto: LoginDto = {
        email: 'john@example.com',
        password: 'wrong-password',
      };

      mockAuthService.login.mockRejectedValue(new UnauthorizedException());

      await expect(controller.login(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });
  });

  describe('POST /auth/register', () => {
    it('should return access token and user data on successful registration', async () => {
      const registerDto: RegisterDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        roleId: 'role-123',
      };

      const expectedResponse = {
        access_token: 'jwt-token',
        user: {
          id: 'user-123',
          name: 'John Doe',
          rol: 'user',
        },
      };

      mockAuthService.register.mockResolvedValue(expectedResponse);

      const result = await controller.register(registerDto);

      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(expectedResponse);
    });

    it('should handle registration errors appropriately', async () => {
      const registerDto: RegisterDto = {
        name: 'John Doe',
        email: 'existing@example.com',
        password: 'password123',
        roleId: 'role-123',
      };

      mockAuthService.register.mockRejectedValue(new Error('Email already exists'));

      await expect(controller.register(registerDto)).rejects.toThrow('Email already exists');
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('POST /auth/forgot-password', () => {
    it('should return success message for existing email', async () => {
      const forgotPasswordDto: ForgotPasswordDto = {
        email: 'john@example.com',
      };

      mockAuthService.forgotPassword.mockResolvedValue(undefined);

      const result = await controller.forgotPassword(forgotPasswordDto);

      expect(authService.forgotPassword).toHaveBeenCalledWith(forgotPasswordDto);
      expect(result).toEqual({
        message: 'Si el email está registrado, recibirás un correo con instrucciones'
      });
    });

    it('should return success message for non-existing email (security)', async () => {
      const forgotPasswordDto: ForgotPasswordDto = {
        email: 'nonexistent@example.com',
      };

      mockAuthService.forgotPassword.mockResolvedValue(undefined);

      const result = await controller.forgotPassword(forgotPasswordDto);

      expect(authService.forgotPassword).toHaveBeenCalledWith(forgotPasswordDto);
      expect(result).toEqual({
        message: 'Si el email está registrado, recibirás un correo con instrucciones'
      });
    });

    it('should handle email service errors gracefully', async () => {
      const forgotPasswordDto: ForgotPasswordDto = {
        email: 'john@example.com',
      };

      mockAuthService.forgotPassword.mockRejectedValue(new Error('Email service failed'));

      // El controller no debe lanzar error por seguridad
      await expect(controller.forgotPassword(forgotPasswordDto)).resolves.toEqual({
        message: 'Si el email está registrado, recibirás un correo con instrucciones'
      });
    });
  });

  describe('POST /auth/reset-password', () => {
    it('should return success message on successful password reset', async () => {
      const resetPasswordDto: ResetPasswordDto = {
        token: 'valid-token-123',
        newPassword: 'newPassword123',
      };

      mockAuthService.resetPassword.mockResolvedValue(undefined);

      const result = await controller.resetPassword(resetPasswordDto);

      expect(authService.resetPassword).toHaveBeenCalledWith(resetPasswordDto);
      expect(result).toEqual({
        message: 'Contraseña restablecida exitosamente'
      });
    });

    it('should throw BadRequestException for invalid token', async () => {
      const resetPasswordDto: ResetPasswordDto = {
        token: 'invalid-token',
        newPassword: 'newPassword123',
      };

      mockAuthService.resetPassword.mockRejectedValue(new BadRequestException('Token inválido'));

      await expect(controller.resetPassword(resetPasswordDto)).rejects.toThrow(BadRequestException);
      expect(authService.resetPassword).toHaveBeenCalledWith(resetPasswordDto);
    });

    it('should handle service errors appropriately', async () => {
      const resetPasswordDto: ResetPasswordDto = {
        token: 'valid-token-123',
        newPassword: 'newPassword123',
      };

      mockAuthService.resetPassword.mockRejectedValue(new Error('Database error'));

      await expect(controller.resetPassword(resetPasswordDto)).rejects.toThrow('Database error');
      expect(authService.resetPassword).toHaveBeenCalledWith(resetPasswordDto);
    });
  });

  describe('POST /auth/mail-test', () => {
    it('should send test email successfully', async () => {
      const testEmail = 'test@example.com';

      mockAuthService.sendTestEmail.mockResolvedValue(undefined);

      const result = await controller.sendEmail({ email: testEmail });

      expect(authService.sendTestEmail).toHaveBeenCalledWith(testEmail);
      expect(result).toEqual({
        message: 'Correo de prueba enviado exitosamente'
      });
    });

    it('should handle email sending errors', async () => {
      const testEmail = 'test@example.com';

      mockAuthService.sendTestEmail.mockRejectedValue(new Error('SMTP failed'));

      await expect(controller.sendEmail({ email: testEmail })).rejects.toThrow('SMTP failed');
      expect(authService.sendTestEmail).toHaveBeenCalledWith(testEmail);
    });
  });

  describe('GET /auth/profile', () => {
    it('should return user profile from request', async () => {
      const mockUser = {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        rol: 'user',
      };

      const mockRequest = {
        user: mockUser,
      };

      const result = controller.getProfile(mockRequest);

      expect(result).toEqual(mockUser);
    });

    it('should handle missing user in request', async () => {
      const mockRequest = {
        user: null,
      };

      const result = controller.getProfile(mockRequest);

      expect(result).toBeNull();
    });
  });
});
