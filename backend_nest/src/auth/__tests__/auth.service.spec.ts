import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';
import { RolesService } from '../../rols/roles.service';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../services/email.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';

// Mock de bcrypt
jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let rolesService: RolesService;
  let jwtService: JwtService;
  let emailService: EmailService;
  let mockBcrypt: jest.Mocked<typeof bcrypt>;

  const mockUser = {
    id: 'user-123',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashed-password',
    roleId: 'role-123',
    isActive: true,
  };

  const mockRole = {
    id: 'role-123',
    name: 'user',
  };

  beforeEach(async () => {
    mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
    mockBcrypt.compare = jest.fn();
    mockBcrypt.hash = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
            updatePassword: jest.fn(),
          },
        },
        {
          provide: RolesService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: EmailService,
          useValue: {
            sendPasswordResetEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    rolesService = module.get<RolesService>(RolesService);
    jwtService = module.get<JwtService>(JwtService);
    emailService = module.get<EmailService>(EmailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user data when credentials are valid', async () => {
      const loginDto: LoginDto = {
        email: 'john@example.com',
        password: 'password123',
      };

      (usersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (rolesService.findOne as jest.Mock).mockResolvedValue(mockRole);
      mockBcrypt.compare.mockResolvedValue(true);

      const result = await service.validateUser(loginDto.email, loginDto.password);

      expect(usersService.findByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(mockBcrypt.compare).toHaveBeenCalledWith(loginDto.password, mockUser.password);
      expect(result).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        rolId: mockUser.roleId,
      });
    });

    it('should return null when user does not exist', async () => {
      const loginDto: LoginDto = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);

      const result = await service.validateUser(loginDto.email, loginDto.password);

      expect(result).toBeNull();
      expect(mockBcrypt.compare).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when user is inactive', async () => {
      const loginDto: LoginDto = {
        email: 'inactive@example.com',
        password: 'password123',
      };

      const inactiveUser = { ...mockUser, isActive: false };
      (usersService.findByEmail as jest.Mock).mockResolvedValue(inactiveUser);

      await expect(service.validateUser(loginDto.email, loginDto.password)).rejects.toThrow(
        UnauthorizedException
      );
      expect(mockBcrypt.compare).not.toHaveBeenCalled();
    });

    it('should return null when password is invalid', async () => {
      const loginDto: LoginDto = {
        email: 'john@example.com',
        password: 'wrong-password',
      };

      (usersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      mockBcrypt.compare.mockResolvedValue(false);

      const result = await service.validateUser(loginDto.email, loginDto.password);

      expect(result).toBeNull();
      expect(mockBcrypt.compare).toHaveBeenCalledWith(loginDto.password, mockUser.password);
    });
  });

  describe('login', () => {
    it('should return access token and user data on successful login', async () => {
      const loginDto: LoginDto = {
        email: 'john@example.com',
        password: 'password123',
      };

      const expectedPayload = {
        sub: mockUser.id,
        name: mockUser.name,
        rol: mockRole.name,
      };

      const expectedToken = 'jwt-token';
      const expectedUserResponse = {
        id: mockUser.id,
        name: mockUser.name,
        rol: mockRole.name,
      };

      jest.spyOn(service, 'validateUser').mockResolvedValue({
        id: mockUser.id,
        name: mockUser.name,
        rolId: mockUser.roleId,
      });
      (rolesService.findOne as jest.Mock).mockResolvedValue(mockRole);
      (jwtService.sign as jest.Mock).mockReturnValue(expectedToken);

      const result = await service.login(loginDto);

      expect(service.validateUser).toHaveBeenCalledWith(loginDto.email, loginDto.password);
      expect(rolesService.findOne).toHaveBeenCalledWith(mockUser.roleId);
      expect(jwtService.sign).toHaveBeenCalledWith(expectedPayload);
      expect(result).toEqual({
        access_token: expectedToken,
        user: expectedUserResponse,
      });
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      const loginDto: LoginDto = {
        email: 'john@example.com',
        password: 'wrong-password',
      };

      jest.spyOn(service, 'validateUser').mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(jwtService.sign).not.toHaveBeenCalled();
    });
  });

  describe('register', () => {
    it('should return access token and user data on successful registration', async () => {
      const registerDto: RegisterDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        roleId: 'role-123',
      };

      const expectedPayload = {
        sub: mockUser.id,
        name: mockUser.name,
        rol: mockRole.name,
      };

      const expectedToken = 'jwt-token';
      const expectedUserResponse = {
        id: mockUser.id,
        name: mockUser.name,
        rol: mockRole.name,
      };

      (usersService.create as jest.Mock).mockResolvedValue(mockUser);
      (rolesService.findOne as jest.Mock).mockResolvedValue(mockRole);
      (jwtService.sign as jest.Mock).mockReturnValue(expectedToken);

      const result = await service.register(registerDto);

      expect(usersService.create).toHaveBeenCalledWith(registerDto);
      expect(rolesService.findOne).toHaveBeenCalledWith(mockUser.roleId);
      expect(jwtService.sign).toHaveBeenCalledWith(expectedPayload);
      expect(result).toEqual({
        access_token: expectedToken,
        user: expectedUserResponse,
      });
    });
  });

  describe('forgotPassword', () => {
    it('should send password reset email when user exists', async () => {
      const forgotPasswordDto: ForgotPasswordDto = {
        email: 'john@example.com',
      };

      (usersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (emailService.sendPasswordResetEmail as jest.Mock).mockResolvedValue(undefined);

      await service.forgotPassword(forgotPasswordDto);

      expect(usersService.findByEmail).toHaveBeenCalledWith(forgotPasswordDto.email);
      expect(emailService.sendPasswordResetEmail).toHaveBeenCalledWith(
        forgotPasswordDto.email,
        expect.any(String)
      );
    });

    it('should not reveal if email exists when user does not exist', async () => {
      const forgotPasswordDto: ForgotPasswordDto = {
        email: 'nonexistent@example.com',
      };

      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);

      await service.forgotPassword(forgotPasswordDto);

      expect(usersService.findByEmail).toHaveBeenCalledWith(forgotPasswordDto.email);
      expect(emailService.sendPasswordResetEmail).not.toHaveBeenCalled();
      // No debe lanzar error para no revelar si el email existe
    });

    it('should generate unique token for each request', async () => {
      const forgotPasswordDto: ForgotPasswordDto = {
        email: 'john@example.com',
      };

      (usersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (emailService.sendPasswordResetEmail as jest.Mock).mockResolvedValue(undefined);

      // Primera solicitud
      await service.forgotPassword(forgotPasswordDto);
      const firstCall = (emailService.sendPasswordResetEmail as jest.Mock).mock.calls[0];

      // Segunda solicitud
      await service.forgotPassword(forgotPasswordDto);
      const secondCall = (emailService.sendPasswordResetEmail as jest.Mock).mock.calls[1];

      expect(firstCall[1]).not.toBe(secondCall[1]); // Los tokens deben ser diferentes
    });
  });

  describe('resetPassword', () => {
    const testToken = 'valid-token-123';
    const newPassword = 'newPassword123';

    beforeEach(() => {
      // Simular que existe un token válido
      (service as any).passwordResetTokens.set(testToken, {
        email: mockUser.email,
        token: testToken,
        expiresAt: new Date(Date.now() + 3600000), // Expira en 1 hora
        isUsed: false,
        createdAt: new Date(),
      });
    });

    it('should reset password when token is valid', async () => {
      const resetPasswordDto: ResetPasswordDto = {
        token: testToken,
        newPassword,
      };

      const hashedPassword = 'hashed-new-password';
      mockBcrypt.hash.mockResolvedValue(hashedPassword);

      (usersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (usersService.updatePassword as jest.Mock).mockResolvedValue(undefined);

      await service.resetPassword(resetPasswordDto);

      expect(usersService.findByEmail).toHaveBeenCalledWith(mockUser.email);
      expect(mockBcrypt.hash).toHaveBeenCalledWith(newPassword, 10);
      expect(usersService.updatePassword).toHaveBeenCalledWith(mockUser.id, hashedPassword);
      
      // Verificar que el token fue eliminado
      expect((service as any).passwordResetTokens.has(testToken)).toBe(false);
    });

    it('should throw BadRequestException when token is invalid', async () => {
      const resetPasswordDto: ResetPasswordDto = {
        token: 'invalid-token',
        newPassword,
      };

      await expect(service.resetPassword(resetPasswordDto)).rejects.toThrow(
        BadRequestException
      );
      expect(usersService.findByEmail).not.toHaveBeenCalled();
      expect(usersService.updatePassword).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when token is expired', async () => {
      const expiredToken = 'expired-token-123';
      
      // Crear token expirado
      (service as any).passwordResetTokens.set(expiredToken, {
        email: mockUser.email,
        token: expiredToken,
        expiresAt: new Date(Date.now() - 1000), // Expirado
        isUsed: false,
        createdAt: new Date(),
      });

      const resetPasswordDto: ResetPasswordDto = {
        token: expiredToken,
        newPassword,
      };

      await expect(service.resetPassword(resetPasswordDto)).rejects.toThrow(
        BadRequestException
      );
    });

    it('should throw BadRequestException when token is already used', async () => {
      // Marcar token como usado
      const tokenData = (service as any).passwordResetTokens.get(testToken);
      tokenData.isUsed = true;

      const resetPasswordDto: ResetPasswordDto = {
        token: testToken,
        newPassword,
      };

      await expect(service.resetPassword(resetPasswordDto)).rejects.toThrow(
        BadRequestException
      );
    });

    it('should throw NotFoundException when user does not exist', async () => {
      const resetPasswordDto: ResetPasswordDto = {
        token: testToken,
        newPassword,
      };

      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);

      await expect(service.resetPassword(resetPasswordDto)).rejects.toThrow(
        NotFoundException
      );
      expect(usersService.updatePassword).not.toHaveBeenCalled();
    });
  });

  describe('sendTestEmail', () => {
    it('should send test email using email service', async () => {
      const testEmail = 'test@example.com';

      (emailService.sendEmail as jest.Mock).mockResolvedValue(undefined);

      await service.sendTestEmail(testEmail);

      expect(emailService.sendEmail).toHaveBeenCalledWith(
        testEmail,
        'Correo de prueba',
        '<p>Este es un correo de prueba para verificar la configuración del servicio de email.</p>'
      );
    });
  });

  describe('generateResetToken', () => {
    it('should generate unique tokens', () => {
      const token1 = (service as any).generateResetToken();
      const token2 = (service as any).generateResetToken();

      expect(token1).not.toBe(token2);
      expect(typeof token1).toBe('string');
      expect(typeof token2).toBe('string');
      expect(token1.length).toBeGreaterThan(0);
      expect(token2.length).toBeGreaterThan(0);
    });
  });
});
