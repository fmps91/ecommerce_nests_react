import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../email.service';
import * as nodemailer from 'nodemailer';

// Mock de nodemailer
jest.mock('nodemailer');

describe('EmailService', () => {
  let service: EmailService;
  let configService: ConfigService;
  let mockTransporter: jest.Mocked<nodemailer.Transporter>;

  beforeEach(async () => {
    mockTransporter = {
      verify: jest.fn(),
      sendMail: jest.fn().mockResolvedValue({
        messageId: 'test-message-id',
        getTestMessageUrl: jest.fn().mockReturnValue('http://test-url.com'),
      }),
    } as any;

    (nodemailer.createTransport as jest.Mock).mockReturnValue(mockTransporter);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const config = {
                'SMTP_HOST': 'smtp.gmail.com',
                'SMTP_PORT': '587',
                'SMTP_SECURE': 'false',
                'SMTP_USER': 'test@gmail.com',
                'SMTP_PASS': 'test-password',
                'EMAIL_FROM': 'test@gmail.com',
                'EMAIL_FROM_NAME': 'Test App',
                'FRONTEND_URL': 'http://localhost:3000',
                'LOGO_URL': '',
                'NODE_ENV': 'test',
              };
              return config[key];
            }),
          },
        },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('constructor', () => {
    it('should initialize transporter with correct config', () => {
      expect(nodemailer.createTransport).toHaveBeenCalledWith({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'test@gmail.com',
          pass: 'test-password',
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
    });

    it('should verify connection on initialization', () => {
      expect(mockTransporter.verify).toHaveBeenCalled();
    });
  });

  describe('sendPasswordResetEmail', () => {
    const testEmail = 'user@example.com';
    const testToken = 'test-token-123';

    it('should send password reset email successfully', async () => {
      await service.sendPasswordResetEmail(testEmail, testToken);

      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: '"Test App" <test@gmail.com>',
        to: testEmail,
        subject: '🔑 Restablecimiento de Contraseña - Ecommerce App',
        html: expect.stringContaining('Restablecimiento de Contraseña'),
      });
    });

    it('should include correct reset URL in email', async () => {
      await service.sendPasswordResetEmail(testEmail, testToken);

      const callArgs = (mockTransporter.sendMail as jest.Mock).mock.calls[0][0];
      expect(callArgs.html).toContain('http://localhost:3000/reset-password?token=test-token-123');
    });

    it('should include token in email', async () => {
      await service.sendPasswordResetEmail(testEmail, testToken);

      const callArgs = (mockTransporter.sendMail as jest.Mock).mock.calls[0][0];
      expect(callArgs.html).toContain('test-token-123');
    });

    it('should handle sendMail error gracefully', async () => {
      const errorMessage = 'SMTP connection failed';
      mockTransporter.sendMail.mockRejectedValue(new Error(errorMessage));

      await expect(service.sendPasswordResetEmail(testEmail, testToken)).rejects.toThrow(
        'No se pudo enviar el correo de restablecimiento'
      );
    });

    it('should use custom config values', async () => {
      // Crear un nuevo servicio con configuración personalizada
      const customModule: TestingModule = await Test.createTestingModule({
        providers: [
          EmailService,
          {
            provide: ConfigService,
            useValue: {
              get: jest.fn((key: string) => {
                const config = {
                  'SMTP_HOST': 'custom.smtp.com',
                  'SMTP_PORT': '465',
                  'SMTP_SECURE': 'true',
                  'SMTP_USER': 'custom@example.com',
                  'SMTP_PASS': 'custom-pass',
                  'EMAIL_FROM': 'sender@example.com',
                  'EMAIL_FROM_NAME': 'Custom App',
                  'FRONTEND_URL': 'https://custom-app.com',
                  'LOGO_URL': 'https://custom-app.com/logo.png',
                  'NODE_ENV': 'test',
                };
                return config[key];
              }),
            },
          },
        ],
      }).compile();

      const customService = customModule.get<EmailService>(EmailService);
      await customService.sendPasswordResetEmail(testEmail, testToken);

      expect(nodemailer.createTransport).toHaveBeenCalledWith(
        expect.objectContaining({
          host: 'custom.smtp.com',
          port: 465,
          secure: true,
        })
      );

      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          from: '"Custom App" <sender@example.com>',
        })
      );
    });
  });

  describe('sendEmail', () => {
    const testEmail = 'recipient@example.com';
    const testSubject = 'Test Subject';
    const testHtml = '<p>Test HTML content</p>';

    it('should send generic email successfully', async () => {
      await service.sendEmail(testEmail, testSubject, testHtml);

      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: '"Test App" <test@gmail.com>',
        to: testEmail,
        subject: testSubject,
        html: testHtml,
      });
    });

    it('should handle sendMail error in generic email', async () => {
      mockTransporter.sendMail.mockRejectedValue(new Error('Generic email failed'));

      await expect(service.sendEmail(testEmail, testSubject, testHtml)).rejects.toThrow(
        'No se pudo enviar el correo'
      );
    });
  });

  describe('generatePasswordResetTemplate', () => {
    const testUrl = 'http://localhost:3000/reset-password?token=test-token';
    const testToken = 'test-token';

    it('should generate HTML template with correct structure', () => {
      const template = (service as any).generatePasswordResetTemplate(testUrl, testToken);

      expect(template).toContain('<!DOCTYPE html>');
      expect(template).toContain('<html lang="es">');
      expect(template).toContain('Restablecimiento de Contraseña');
      expect(template).toContain(testUrl);
      expect(template).toContain(testToken);
    });

    it('should include security warnings', () => {
      const template = (service as any).generatePasswordResetTemplate(testUrl, testToken);

      expect(template).toContain('⚠️ Importante');
      expect(template).toContain('Este enlace expirará en 1 hora');
      expect(template).toContain('Si no solicitaste este cambio');
    });

    it('should include logo when configured', async () => {
      const logoModule: TestingModule = await Test.createTestingModule({
        providers: [
          EmailService,
          {
            provide: ConfigService,
            useValue: {
              get: jest.fn((key: string) => {
                const config = {
                  'SMTP_HOST': 'smtp.gmail.com',
                  'SMTP_PORT': '587',
                  'SMTP_SECURE': 'false',
                  'SMTP_USER': 'test@gmail.com',
                  'SMTP_PASS': 'test-password',
                  'EMAIL_FROM': 'test@gmail.com',
                  'EMAIL_FROM_NAME': 'Test App',
                  'FRONTEND_URL': 'http://localhost:3000',
                  'NODE_ENV': 'test',
                };
                return config[key];
              }),
            },
          },
        ],
      }).compile();

      const logoService = logoModule.get<EmailService>(EmailService);
      const template = (logoService as any).generatePasswordResetTemplate(testUrl, testToken);

      expect(template).toContain('https://example.com/logo.png');
    });
  });
});
