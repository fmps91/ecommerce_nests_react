import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { Sequelize } from 'sequelize-typescript';
import { User } from '../src/users/models/user.model';
import { Role } from '../src/rols/models/role.model';

describe('Roles API (e2e)', () => {
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
    await sequelize.getRepository(Role).create({
      id: 'test-role-id',
      name: 'USER',
      description: 'Test user role',
      permissions: ['read', 'write'],
    });
  });

  afterAll(async () => {
    await sequelize.close();
    await app.close();
  });

  describe('POST /roles', () => {
    it('should create a new role successfully', () => {
      const createRoleDto = {
        name: 'ADMIN',
        description: 'Administrator role',
        permissions: ['read', 'write', 'delete'],
      };

      return request(app.getHttpServer())
        .post('/roles')
        .send(createRoleDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toBe(createRoleDto.name);
          expect(res.body.description).toBe(createRoleDto.description);
          expect(res.body.permissions).toEqual(createRoleDto.permissions);
          expect(res.body).toHaveProperty('permissionsCount', 3);
        });
    });

    it('should return 409 when role name already exists', () => {
      const createRoleDto = {
        name: 'USER', // Already exists from beforeEach
        description: 'Duplicate role',
      };

      return request(app.getHttpServer())
        .post('/roles')
        .send(createRoleDto)
        .expect(409);
    });

    it('should return 400 when name is too short', () => {
      const createRoleDto = {
        name: 'AB', // Less than 3 characters
        description: 'Invalid role',
      };

      return request(app.getHttpServer())
        .post('/roles')
        .send(createRoleDto)
        .expect(400);
    });

    it('should return 400 when permissions is not an array', () => {
      const createRoleDto = {
        name: 'TEST',
        permissions: 'not-an-array',
      };

      return request(app.getHttpServer())
        .post('/roles')
        .send(createRoleDto)
        .expect(400);
    });
  });

  describe('GET /roles', () => {
    it('should return all roles', () => {
      return request(app.getHttpServer())
        .get('/roles')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0]).toHaveProperty('id');
          expect(res.body[0]).toHaveProperty('name');
          expect(res.body[0]).toHaveProperty('permissionsCount');
        });
    });
  });

  describe('GET /roles/default', () => {
    it('should return default role', () => {
      return request(app.getHttpServer())
        .get('/roles/default')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toBe('CUSTOMER');
          expect(res.body).toHaveProperty('permissions');
          expect(res.body).toHaveProperty('permissionsCount');
        });
    });
  });

  describe('GET /roles/:id', () => {
    it('should return a role by id', () => {
      return request(app.getHttpServer())
        .get('/roles/test-role-id')
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe('test-role-id');
          expect(res.body.name).toBe('USER');
          expect(res.body.description).toBe('Test user role');
          expect(res.body.permissions).toEqual(['read', 'write']);
        });
    });

    it('should return 404 when role not found', () => {
      return request(app.getHttpServer())
        .get('/roles/non-existent-id')
        .expect(404);
    });
  });

  describe('GET /roles/name/:name', () => {
    it('should return a role by name', () => {
      return request(app.getHttpServer())
        .get('/roles/name/USER')
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe('USER');
          expect(res.body.description).toBe('Test user role');
          expect(res.body.permissions).toEqual(['read', 'write']);
        });
    });

    it('should return 404 when role name not found', () => {
      return request(app.getHttpServer())
        .get('/roles/name/NON_EXISTENT')
        .expect(404);
    });
  });

  describe('GET /roles/:id/permissions', () => {
    it('should return role permissions', () => {
      return request(app.getHttpServer())
        .get('/roles/test-role-id/permissions')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body).toEqual(['read', 'write']);
        });
    });

    it('should return 404 when role not found', () => {
      return request(app.getHttpServer())
        .get('/roles/non-existent-id/permissions')
        .expect(404);
    });
  });

  describe('PATCH /roles/:id', () => {
    it('should update a role successfully', () => {
      const updateRoleDto = {
        description: 'Updated user role',
        permissions: ['read', 'write', 'execute'],
      };

      return request(app.getHttpServer())
        .patch('/roles/test-role-id')
        .send(updateRoleDto)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe('test-role-id');
          expect(res.body.name).toBe('USER');
          expect(res.body.description).toBe('Updated user role');
          expect(res.body.permissions).toEqual(['read', 'write', 'execute']);
          expect(res.body.permissionsCount).toBe(3);
        });
    });

    it('should return 404 when role to update not found', () => {
      const updateRoleDto = {
        description: 'Updated role',
      };

      return request(app.getHttpServer())
        .patch('/roles/non-existent-id')
        .send(updateRoleDto)
        .expect(404);
    });

    it('should return 409 when updating to existing name', async () => {
      // Create another role first
      await sequelize.getRepository(Role).create({
        id: 'another-role-id',
        name: 'MANAGER',
        description: 'Manager role',
        permissions: ['read'],
      });

      const updateRoleDto = {
        name: 'MANAGER', // Try to update to existing name
      };

      return request(app.getHttpServer())
        .patch('/roles/test-role-id')
        .send(updateRoleDto)
        .expect(409);
    });
  });

  describe('PATCH /roles/:id/permissions/add', () => {
    it('should add permissions to role successfully', () => {
      const permissionsToAdd = ['delete', 'execute'];

      return request(app.getHttpServer())
        .patch('/roles/test-role-id/permissions/add')
        .send({ permissions: permissionsToAdd })
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe('test-role-id');
          expect(res.body.permissions).toContain('read');
          expect(res.body.permissions).toContain('write');
          expect(res.body.permissions).toContain('delete');
          expect(res.body.permissions).toContain('execute');
          expect(res.body.permissionsCount).toBe(4);
        });
    });

    it('should return 404 when role not found', () => {
      return request(app.getHttpServer())
        .patch('/roles/non-existent-id/permissions/add')
        .send({ permissions: ['read'] })
        .expect(404);
    });

    it('should handle duplicate permissions gracefully', () => {
      const permissionsToAdd = ['read', 'write']; // Already exist

      return request(app.getHttpServer())
        .patch('/roles/test-role-id/permissions/add')
        .send({ permissions: permissionsToAdd })
        .expect(200)
        .expect((res) => {
          expect(res.body.permissions).toEqual(['read', 'write']);
          expect(res.body.permissionsCount).toBe(2);
        });
    });
  });

  describe('PATCH /roles/:id/permissions/remove', () => {
    it('should remove permissions from role successfully', () => {
      const permissionsToRemove = ['write'];

      return request(app.getHttpServer())
        .patch('/roles/test-role-id/permissions/remove')
        .send(permissionsToRemove)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe('test-role-id');
          expect(res.body.permissions).toEqual(['read']);
          expect(res.body.permissionsCount).toBe(1);
        });
    });

    it('should return 404 when role not found', () => {
      return request(app.getHttpServer())
        .patch('/roles/non-existent-id/permissions/remove')
        .send(['read'])
        .expect(404);
    });

    it('should handle non-existent permissions gracefully', () => {
      const permissionsToRemove = ['non-existent'];

      return request(app.getHttpServer())
        .patch('/roles/test-role-id/permissions/remove')
        .send(permissionsToRemove)
        .expect(200)
        .expect((res) => {
          expect(res.body.permissions).toEqual(['read', 'write']);
          expect(res.body.permissionsCount).toBe(2);
        });
    });
  });

  describe('POST /roles/assign', () => {
    beforeEach(async () => {
      // Create a test user
      await sequelize.getRepository(User).create({
        id: 'test-user-id',
        email: 'test@example.com',
        password: 'hashedpassword',
        roleId: null,
      });
    });

    it('should assign role to user successfully', () => {
      const assignRoleDto = {
        userId: 'test-user-id',
        roleId: 'test-role-id',
      };

      return request(app.getHttpServer())
        .post('/roles/assign')
        .send(assignRoleDto)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('message', 'Role assigned successfully');
          expect(res.body.user).toHaveProperty('id', 'test-user-id');
          expect(res.body.user).toHaveProperty('email', 'test@example.com');
          expect(res.body.user).toHaveProperty('roleId', 'test-role-id');
        });
    });

    it('should return 404 when user not found', () => {
      const assignRoleDto = {
        userId: 'non-existent-user',
        roleId: 'test-role-id',
      };

      return request(app.getHttpServer())
        .post('/roles/assign')
        .send(assignRoleDto)
        .expect(404);
    });

    it('should return 404 when role not found', () => {
      const assignRoleDto = {
        userId: 'test-user-id',
        roleId: 'non-existent-role',
      };

      return request(app.getHttpServer())
        .post('/roles/assign')
        .send(assignRoleDto)
        .expect(404);
    });

    it('should return 400 when userId is not a valid UUID', () => {
      const assignRoleDto = {
        userId: 'invalid-uuid',
        roleId: 'test-role-id',
      };

      return request(app.getHttpServer())
        .post('/roles/assign')
        .send(assignRoleDto)
        .expect(400);
    });
  });

  describe('DELETE /roles/:id', () => {
    it('should delete a role successfully', () => {
      return request(app.getHttpServer())
        .delete('/roles/test-role-id')
        .expect(204);
    });

    it('should return 404 when role to delete not found', () => {
      return request(app.getHttpServer())
        .delete('/roles/non-existent-id')
        .expect(404);
    });

    it('should return 409 when role has assigned users', async () => {
      // Create a user with the role
      await sequelize.getRepository(User).create({
        id: 'test-user-id',
        email: 'test@example.com',
        password: 'hashedpassword',
        roleId: 'test-role-id',
      });

      return request(app.getHttpServer())
        .delete('/roles/test-role-id')
        .expect(409);
    });
  });

  describe('DELETE /roles/delete/:id', () => {
    it('should hard delete a role successfully', () => {
      return request(app.getHttpServer())
        .delete('/roles/delete/test-role-id')
        .expect(204);
    });

    it('should return 404 when role to hard delete not found', () => {
      return request(app.getHttpServer())
        .delete('/roles/delete/non-existent-id')
        .expect(404);
    });
  });

  describe('Error handling', () => {
    it('should handle malformed JSON gracefully', () => {
      return request(app.getHttpServer())
        .post('/roles')
        .set('Content-Type', 'application/json')
        .send('{"name": "test", invalid}')
        .expect(400);
    });

    it('should handle missing required fields', () => {
      return request(app.getHttpServer())
        .post('/roles')
        .send({})
        .expect(400);
    });

    it('should handle invalid data types', () => {
      const invalidData = {
        name: 123, // Should be string
        permissions: 'not-array', // Should be array
      };

      return request(app.getHttpServer())
        .post('/roles')
        .send(invalidData)
        .expect(400);
    });
  });

  describe('Response format consistency', () => {
    it('should consistently return RoleResponseDto format', async () => {
      // Test POST response format
      const createResponse = await request(app.getHttpServer())
        .post('/roles')
        .send({
          name: 'TEST_ROLE',
          description: 'Test role',
          permissions: ['read'],
        })
        .expect(201);

      const roleId = createResponse.body.id;

      // Test GET response format
      await request(app.getHttpServer())
        .get(`/roles/${roleId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('name');
          expect(res.body).toHaveProperty('description');
          expect(res.body).toHaveProperty('permissions');
          expect(res.body).toHaveProperty('createdAt');
          expect(res.body).toHaveProperty('updatedAt');
          expect(res.body).toHaveProperty('permissionsCount');
          expect(res.body).not.toHaveProperty('deletedAt'); // Should be excluded
        });

      // Test PATCH response format
      await request(app.getHttpServer())
        .patch(`/roles/${roleId}`)
        .send({ description: 'Updated description' })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('permissionsCount');
          expect(res.body.description).toBe('Updated description');
        });
    });
  });

  describe('Performance and limits', () => {
    it('should handle large permissions array', async () => {
      const largePermissions = Array.from({ length: 100 }, (_, i) => `permission-${i}`);
      
      return request(app.getHttpServer())
        .post('/roles')
        .send({
          name: 'LARGE_PERMISSIONS_ROLE',
          permissions: largePermissions,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.permissions).toHaveLength(100);
          expect(res.body.permissionsCount).toBe(100);
        });
    });

    it('should handle long role names within limits', () => {
      const longName = 'A'.repeat(50); // Maximum allowed length
      
      return request(app.getHttpServer())
        .post('/roles')
        .send({
          name: longName,
          description: 'Role with long name',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.name).toBe(longName);
        });
    });

    it('should reject role names exceeding limits', () => {
      const tooLongName = 'A'.repeat(51); // Exceeds maximum length
      
      return request(app.getHttpServer())
        .post('/roles')
        .send({
          name: tooLongName,
          description: 'Role with too long name',
        })
        .expect(400);
    });
  });
});
