import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { AppModule } from '../src/app.module';
import { User } from '../src/users/models/user.model';
const request = require('supertest');

describe('Users E2E', () => {
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

  afterAll(async () => {
    await sequelize.close();
    await app.close();
  });

  beforeEach(async () => {
    // Clean up database before each test
    await User.destroy({ where: {}, force: true });
  });

  describe('/users (POST)', () => {
    it('should create a user successfully', () => {
      const createUserDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        roleId: '123e4567-e89b-12d3-a456-426614174001',
        isActive: true,
      };

      return request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.email).toBe(createUserDto.email);
          expect(res.body.name).toBe(createUserDto.name);
          expect(res.body).not.toHaveProperty('password');
        });
    });

    it('should return 400 for invalid email', () => {
      const invalidUser = {
        email: 'invalid-email',
        password: 'password123',
        name: 'Test User',
        roleId: '123e4567-e89b-12d3-a456-426614174001',
      };

      return request(app.getHttpServer())
        .post('/users')
        .send(invalidUser)
        .expect(400);
    });

    it('should return 400 for short password', () => {
      const invalidUser = {
        email: 'test@example.com',
        password: '123',
        name: 'Test User',
        roleId: '123e4567-e89b-12d3-a456-426614174001',
      };

      return request(app.getHttpServer())
        .post('/users')
        .send(invalidUser)
        .expect(400);
    });

    it('should return 409 for duplicate email', async () => {
      const createUserDto = {
        email: 'duplicate@example.com',
        password: 'password123',
        name: 'Test User',
        roleId: '123e4567-e89b-12d3-a456-426614174001',
      };

      // Create first user
      await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(201);

      // Try to create duplicate
      return request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(409);
    });
  });

  describe('/users (GET)', () => {
    beforeEach(async () => {
      // Create test users
      await User.bulkCreate([
        {
          email: 'user1@example.com',
          password: 'hashedpassword1',
          name: 'User One',
          roleId: '123e4567-e89b-12d3-a456-426614174001',
          isActive: true,
        },
        {
          email: 'user2@example.com',
          password: 'hashedpassword2',
          name: 'User Two',
          roleId: '123e4567-e89b-12d3-a456-426614174001',
          isActive: true,
        },
      ]);
    });

    it('should return paginated users', () => {
      return request(app.getHttpServer())
        .get('/users')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(res.body).toHaveProperty('meta');
          expect(Array.isArray(res.body.data)).toBe(true);
          expect(res.body.data.length).toBeGreaterThan(0);
          expect(res.body.meta).toHaveProperty('total');
          expect(res.body.meta).toHaveProperty('page');
          expect(res.body.meta).toHaveProperty('limit');
        });
    });

    it('should return users with custom pagination', () => {
      return request(app.getHttpServer())
        .get('/users?page=1&limit=5')
        .expect(200)
        .expect((res) => {
          expect(res.body.meta.page).toBe(1);
          expect(res.body.meta.limit).toBe(5);
        });
    });

    it('should return empty array when no users exist', async () => {
      await User.destroy({ where: {}, force: true });

      return request(app.getHttpServer())
        .get('/users')
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toHaveLength(0);
          expect(res.body.meta.total).toBe(0);
        });
    });
  });

  describe('/users/all-simple (GET)', () => {
    beforeEach(async () => {
      await User.bulkCreate([
        {
          email: 'simple1@example.com',
          password: 'hashedpassword1',
          name: 'Simple User One',
          roleId: '123e4567-e89b-12d3-a456-426614174001',
          isActive: true,
        },
        {
          email: 'simple2@example.com',
          password: 'hashedpassword2',
          name: 'Simple User Two',
          roleId: '123e4567-e89b-12d3-a456-426614174001',
          isActive: true,
        },
      ]);
    });

    it('should return all users without pagination', () => {
      return request(app.getHttpServer())
        .get('/users/all-simple')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBe(2);
          expect(res.body[0]).not.toHaveProperty('password');
        });
    });
  });

  describe('/users/:id (GET)', () => {
    let testUser: any;

    beforeEach(async () => {
      testUser = await User.create({
        email: 'getuser@example.com',
        password: 'hashedpassword',
        name: 'Get User',
        roleId: '123e4567-e89b-12d3-a456-426614174001',
        isActive: true,
      });
    });

    it('should return user by ID', () => {
      return request(app.getHttpServer())
        .get(`/users/${testUser.id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(testUser.id);
          expect(res.body.email).toBe(testUser.email);
          expect(res.body).not.toHaveProperty('password');
        });
    });

    it('should return 404 for non-existent user', () => {
      const nonExistentId = '123e4567-e89b-12d3-a456-426614174999';
      
      return request(app.getHttpServer())
        .get(`/users/${nonExistentId}`)
        .expect(404);
    });

    it('should return 400 for invalid UUID format', () => {
      return request(app.getHttpServer())
        .get('/users/invalid-uuid')
        .expect(400);
    });
  });

  describe('/users/:id (PATCH)', () => {
    let testUser: any;

    beforeEach(async () => {
      testUser = await User.create({
        email: 'updateuser@example.com',
        password: 'hashedpassword',
        name: 'Update User',
        roleId: '123e4567-e89b-12d3-a456-426614174001',
        isActive: true,
      });
    });

    it('should update user successfully', () => {
      const updateData = {
        name: 'Updated Name',
        email: 'updated@example.com',
      };

      return request(app.getHttpServer())
        .patch(`/users/${testUser.id}`)
        .send(updateData)
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe(updateData.name);
          expect(res.body.email).toBe(updateData.email);
        });
    });

    it('should update user password', () => {
      const updateData = {
        password: 'newpassword123',
      };

      return request(app.getHttpServer())
        .patch(`/users/${testUser.id}`)
        .send(updateData)
        .expect(200)
        .expect((res) => {
          expect(res.body).not.toHaveProperty('password');
        });
    });

    it('should return 404 for non-existent user', () => {
      const nonExistentId = '123e4567-e89b-12d3-a456-426614174999';
      
      return request(app.getHttpServer())
        .patch(`/users/${nonExistentId}`)
        .send({ name: 'Updated' })
        .expect(404);
    });

    it('should return 400 for invalid email format', () => {
      return request(app.getHttpServer())
        .patch(`/users/${testUser.id}`)
        .send({ email: 'invalid-email' })
        .expect(400);
    });
  });

  describe('/users/:id (DELETE)', () => {
    let testUser: any;

    beforeEach(async () => {
      testUser = await User.create({
        email: 'deleteuser@example.com',
        password: 'hashedpassword',
        name: 'Delete User',
        roleId: '123e4567-e89b-12d3-a456-426614174001',
        isActive: true,
      });
    });

    it('should soft delete user successfully', () => {
      return request(app.getHttpServer())
        .delete(`/users/${testUser.id}`)
        .expect(204);
    });

    it('should return 404 for non-existent user', () => {
      const nonExistentId = '123e4567-e89b-12d3-a456-426614174999';
      
      return request(app.getHttpServer())
        .delete(`/users/${nonExistentId}`)
        .expect(404);
    });
  });

  describe('/users/delete/:id (DELETE)', () => {
    let testUser: any;

    beforeEach(async () => {
      testUser = await User.create({
        email: 'harddelete@example.com',
        password: 'hashedpassword',
        name: 'Hard Delete User',
        roleId: '123e4567-e89b-12d3-a456-426614174001',
        isActive: true,
      });
    });

    it('should hard delete user successfully', () => {
      return request(app.getHttpServer())
        .delete(`/users/delete/${testUser.id}`)
        .expect(204);
    });

    it('should return 404 for non-existent user', () => {
      const nonExistentId = '123e4567-e89b-12d3-a456-426614174999';
      
      return request(app.getHttpServer())
        .delete(`/users/delete/${nonExistentId}`)
        .expect(404);
    });
  });

  describe('/users/:id/toggle-active (PUT)', () => {
    let testUser: any;

    beforeEach(async () => {
      testUser = await User.create({
        email: 'toggleuser@example.com',
        password: 'hashedpassword',
        name: 'Toggle User',
        roleId: '123e4567-e89b-12d3-a456-426614174001',
        isActive: true,
      });
    });

    it('should toggle user active status', () => {
      return request(app.getHttpServer())
        .put(`/users/${testUser.id}/toggle-active`)
        .expect(200)
        .expect((res) => {
          expect(res.body.isActive).toBe(false);
        });
    });

    it('should toggle from inactive to active', async () => {
      // First make user inactive
      await testUser.update({ isActive: false });

      return request(app.getHttpServer())
        .put(`/users/${testUser.id}/toggle-active`)
        .expect(200)
        .expect((res) => {
          expect(res.body.isActive).toBe(true);
        });
    });

    it('should return 404 for non-existent user', () => {
      const nonExistentId = '123e4567-e89b-12d3-a456-426614174999';
      
      return request(app.getHttpServer())
        .put(`/users/${nonExistentId}/toggle-active`)
        .expect(404);
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete user lifecycle', async () => {
      // Create user
      const createUserDto = {
        email: 'lifecycle@example.com',
        password: 'password123',
        name: 'Lifecycle User',
        roleId: '123e4567-e89b-12d3-a456-426614174001',
        isActive: true,
      };

      const createResponse = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(201);

      const userId = createResponse.body.id;

      // Get user
      await request(app.getHttpServer())
        .get(`/users/${userId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.email).toBe(createUserDto.email);
        });

      // Update user
      await request(app.getHttpServer())
        .patch(`/users/${userId}`)
        .send({ name: 'Updated Lifecycle User' })
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe('Updated Lifecycle User');
        });

      // Toggle active
      await request(app.getHttpServer())
        .put(`/users/${userId}/toggle-active`)
        .expect(200)
        .expect((res) => {
          expect(res.body.isActive).toBe(false);
        });

      // Soft delete
      await request(app.getHttpServer())
        .delete(`/users/${userId}`)
        .expect(204);

      // Verify user is soft deleted (should still exist but not in active queries)
      const softDeletedUser = await User.findByPk(userId, { paranoid: false });
      expect(softDeletedUser).toBeDefined();
      expect(softDeletedUser?.deletedAt).toBeDefined();

      // Hard delete
      await request(app.getHttpServer())
        .delete(`/users/delete/${userId}`)
        .expect(204);

      // Verify user is completely deleted
      const hardDeletedUser = await User.findByPk(userId, { paranoid: false });
      expect(hardDeletedUser).toBeNull();
    });
  });
});
