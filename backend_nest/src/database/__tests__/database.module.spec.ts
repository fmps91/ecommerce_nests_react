import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DatabaseModule } from '../database.module';
import { Sequelize } from 'sequelize-typescript';

describe('DatabaseModule', () => {
  let app: INestApplication;
  let sequelize: Sequelize;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    sequelize = moduleFixture.get<Sequelize>('SEQUELIZE');
    
    await app.init();
  });

  afterAll(async () => {
    if (sequelize) {
      await sequelize.close();
    }
    if (app) {
      await app.close();
    }
  });

  describe('Conexión a la base de datos', () => {
    it('debería proporcionar la instancia de Sequelize', () => {
      expect(sequelize).toBeDefined();
      expect(sequelize).toBeInstanceOf(Sequelize);
    });

    it('debería estar conectado a la base de datos', async () => {
      const isConnected = await sequelize.authenticate();
      expect(isConnected).toBeDefined();
    });

    it('debería tener los modelos registrados', () => {
      const models = sequelize.models;
      expect(models).toBeDefined();
      expect(Object.keys(models)).toContain('User');
      expect(Object.keys(models)).toContain('Role');
      expect(Object.keys(models)).toContain('Order');
      expect(Object.keys(models)).toContain('OrderDetail');
      expect(Object.keys(models)).toContain('Product');
    });

    it('debería poder ejecutar una consulta simple', async () => {
      const result = await sequelize.query('SELECT 1 as test');
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('debería verificar variables de entorno', () => {
      expect(process.env.DB_HOST).toBeDefined();
      expect(process.env.DB_USER).toBeDefined();
      expect(process.env.DB_NAME).toBeDefined();
    });
  });

  describe('Sincronización de modelos', () => {
    it('debería poder verificar la tabla de usuarios', async () => {
      const tableExists = await sequelize.getQueryInterface().tableExists('users');
      expect(typeof tableExists).toBe('boolean');
    });

    it('debería poder verificar la tabla de roles', async () => {
      const tableExists = await sequelize.getQueryInterface().tableExists('roles');
      expect(typeof tableExists).toBe('boolean');
    });

    it('debería poder verificar la tabla de orders', async () => {
      const tableExists = await sequelize.getQueryInterface().tableExists('orders');
      expect(typeof tableExists).toBe('boolean');
    });
  });

  describe('Manejo de errores', () => {
    it('debería manejar correctamente la desconexión', async () => {
      await expect(sequelize.close()).resolves.not.toThrow();
    });
  });
});
