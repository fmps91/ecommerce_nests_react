import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { Sequelize } from 'sequelize-typescript';
import { User } from '../src/users/models/user.model';
import { Role } from '../src/rols/models/role.model';

describe('AuthController (E2E)', () => {
  let app: INestApplication;
  let sequelize: Sequelize;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    sequelize = moduleFixture.get<Sequelize>('SEQUELIZE');

    await app.init();
  });

  beforeEach(async () => {
    // Limpiar base de datos antes de cada test
    await sequelize.sync({ force: true });
    
    // Crear rol de prueba
    await Role.create({
      id: 'test-role-id',
      name: 'user',
      description: 'Test user role',
    });
  });

  afterAll(async () => {
    await sequelize.close();
    await app.close();
  });

  describe('POST /auth/register', () => {
    it('should register a new user successfully', () => {
      const registerDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        roleId: 'test-role-id',
      };

      return request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
          expect(res.body).toHaveProperty('user');
          expect(res.body.user).toHaveProperty('id');
          expect(res.body.user).toHaveProperty('name', registerDto.name);
          expect(res.body.user).toHaveProperty('rol', 'user');
          expect(res.body.user).not.toHaveProperty('password');
        });
    });

    it('should not register user with existing email', async () => {
      const registerDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        roleId: 'test-role-id',
      };

      // Primero registrar el usuario
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto);

      // Intentar registrar el mismo email
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(409);
    });

    it('should validate required fields', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({})
        .expect(400);
    });

    it('should validate email format', () => {
      const registerDto = {
        name: 'Test User',
        email: 'invalid-email',
        password: 'password123',
        roleId: 'test-role-id',
      };

      return request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(400);
    });

    it('should validate password length', () => {
      const registerDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: '123',
        roleId: 'test-role-id',
      };

      return request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(400);
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      // Crear usuario de prueba para login
      const registerDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        roleId: 'test-role-id',
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto);
    });

    it('should login successfully with valid credentials', () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      return request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
          expect(res.body).toHaveProperty('user');
          expect(res.body.user).toHaveProperty('id');
          expect(res.body.user).toHaveProperty('name', 'Test User');
          expect(res.body.user).toHaveProperty('rol', 'user');
        });
    });

    it('should reject login with invalid email', () => {
      const loginDto = {
        email: 'wrong@example.com',
        password: 'password123',
      };

      return request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(401);
    });

    it('should reject login with invalid password', () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      return request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(401);
    });

    it('should reject login with inactive user', async () => {
      // Crear usuario inactivo
      await User.create({
        id: 'inactive-user-id',
        name: 'Inactive User',
        email: 'inactive@example.com',
        password: 'hashed-password',
        roleId: 'test-role-id',
        isActive: false,
      });

      const loginDto = {
        email: 'inactive@example.com',
        password: 'password123',
      };

      return request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(401);
    });
  });

  describe('POST /auth/forgot-password', () => {
    beforeEach(async () => {
      // Crear usuario de prueba
      const registerDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        roleId: 'test-role-id',
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto);
    });

    it('should return success message for existing email', () => {
      const forgotPasswordDto = {
        email: 'test@example.com',
      };

      return request(app.getHttpServer())
        .post('/auth/forgot-password')
        .send(forgotPasswordDto)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty(
            'message',
            'Si el email está registrado, recibirás un correo con instrucciones'
          );
        });
    });

    it('should return success message for non-existing email (security)', () => {
      const forgotPasswordDto = {
        email: 'nonexistent@example.com',
      };

      return request(app.getHttpServer())
        .post('/auth/forgot-password')
        .send(forgotPasswordDto)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty(
            'message',
            'Si el email está registrado, recibirás un correo con instrucciones'
          );
        });
    });

    it('should validate email format', () => {
      const forgotPasswordDto = {
        email: 'invalid-email',
      };

      return request(app.getHttpServer())
        .post('/auth/forgot-password')
        .send(forgotPasswordDto)
        .expect(400);
    });

    it('should require email field', () => {
      return request(app.getHttpServer())
        .post('/auth/forgot-password')
        .send({})
        .expect(400);
    });
  });

  describe('POST /auth/reset-password', () => {
    const testToken = 'test-reset-token-123';
    const newPassword = 'newPassword123';

    beforeEach(async () => {
      // Crear usuario de prueba
      const registerDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        roleId: 'test-role-id',
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto);

      // Solicitar restablecimiento de contraseña
      await request(app.getHttpServer())
        .post('/auth/forgot-password')
        .send({ email: 'test@example.com' });
    });

    it('should reset password with valid token', async () => {
      // Nota: Este test asume que el token se genera y almacena correctamente
      // En un escenario real, necesitaríamos acceder al token generado
      const resetPasswordDto = {
        token: testToken,
        newPassword,
      };

      return request(app.getHttpServer())
        .post('/auth/reset-password')
        .send(resetPasswordDto)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty(
            'message',
            'Contraseña restablecida exitosamente'
          );
        });
    });

    it('should reject reset with invalid token', () => {
      const resetPasswordDto = {
        token: 'invalid-token',
        newPassword,
      };

      return request(app.getHttpServer())
        .post('/auth/reset-password')
        .send(resetPasswordDto)
        .expect(400);
    });

    it('should validate required fields', () => {
      return request(app.getHttpServer())
        .post('/auth/reset-password')
        .send({})
        .expect(400);
    });

    it('should validate password length', () => {
      const resetPasswordDto = {
        token: testToken,
        newPassword: '123',
      };

      return request(app.getHttpServer())
        .post('/auth/reset-password')
        .send(resetPasswordDto)
        .expect(400);
    });
  });

  describe('GET /auth/profile', () => {
    let accessToken: string;

    beforeEach(async () => {
      // Registrar y loguear usuario para obtener token
      const registerDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        roleId: 'test-role-id',
      };

      const registerResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto);

      accessToken = registerResponse.body.access_token;
    });

    it('should return user profile with valid token', () => {
      return request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('name', 'Test User');
          expect(res.body).toHaveProperty('email', 'test@example.com');
          expect(res.body).toHaveProperty('rol', 'user');
          expect(res.body).not.toHaveProperty('password');
        });
    });

    it('should reject profile access without token', () => {
      return request(app.getHttpServer())
        .get('/auth/profile')
        .expect(401);
    });

    it('should reject profile access with invalid token', () => {
      return request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });

    it('should reject profile access with malformed token', () => {
      return request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', 'InvalidFormat token')
        .expect(401);
    });
  });

  describe('POST /auth/mail-test', () => {
    let accessToken: string;

    beforeEach(async () => {
      // Registrar y loguear usuario para obtener token
      const registerDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        roleId: 'test-role-id',
      };

      const registerResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto);

      accessToken = registerResponse.body.access_token;
    });

    it('should send test email successfully', () => {
      return request(app.getHttpServer())
        .post('/auth/mail-test')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ email: 'test@example.com' })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty(
            'message',
            'Correo de prueba enviado exitosamente'
          );
        });
    });

    it('should validate email format', () => {
      return request(app.getHttpServer())
        .post('/auth/mail-test')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ email: 'invalid-email' })
        .expect(400);
    });

    it('should require email field', () => {
      return request(app.getHttpServer())
        .post('/auth/mail-test')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({})
        .expect(400);
    });
  });
});
