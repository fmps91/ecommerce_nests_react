import { databaseProviders } from '../database.providers';
import { Sequelize } from 'sequelize-typescript';

describe('DatabaseProviders', () => {
  describe('Configuración del provider', () => {
    it('debería tener el provider SEQUELIZE definido', () => {
      expect(databaseProviders).toHaveLength(1);
      expect(databaseProviders[0].provide).toBe('SEQUELIZE');
      expect(databaseProviders[0].useFactory).toBeDefined();
    });

    it('debería tener una función factory', () => {
      const provider = databaseProviders[0];
      expect(typeof provider.useFactory).toBe('function');
    });
  });

  describe('Configuración de Sequelize', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      jest.resetModules();
      process.env = {
        ...originalEnv,
        DB_HOST: 'localhost',
        DB_PORT: '5432',
        DB_USER: 'test_user',
        DB_PASSWORD: 'test_password',
        DB_NAME: 'test_db',
        NODE_ENV: 'test',
        DB_SSL: 'false'
      };
    });

    afterAll(() => {
      process.env = originalEnv;
    });

    it('debería crear instancia de Sequelize con configuración correcta', async () => {
      const provider = databaseProviders[0];
      
      // Mock de Sequelize para evitar conexión real
      const mockSequelize = {
        authenticate: jest.fn().mockResolvedValue(true),
        addModels: jest.fn(),
        sync: jest.fn().mockResolvedValue(true),
        query: jest.fn().mockResolvedValue([{ test: 1 }]),
        close: jest.fn().mockResolvedValue(true),
        models: {},
        config: {
          dialect: 'postgres',
          host: 'localhost',
          username: 'test_user',
          database: 'test_db'
        }
      };

      // Mock del constructor de Sequelize
      jest.doMock('sequelize-typescript', () => {
        return {
          Sequelize: jest.fn().mockImplementation(() => mockSequelize)
        };
      });

      const sequelize = await provider.useFactory();
      
      expect(sequelize).toBeDefined();
      expect(mockSequelize.authenticate).toHaveBeenCalled();
      expect(mockSequelize.addModels).toHaveBeenCalled();
      expect(mockSequelize.sync).toHaveBeenCalledWith({
        alter: false,
        force: false
      });
    });

    it('debería usar SSL si DB_SSL es true', async () => {
      process.env.DB_SSL = 'true';
      
      const mockSequelize = {
        authenticate: jest.fn().mockResolvedValue(true),
        addModels: jest.fn(),
        sync: jest.fn().mockResolvedValue(true),
        close: jest.fn().mockResolvedValue(true),
        models: {}
      };

      jest.doMock('sequelize-typescript', () => {
        const { Sequelize } = require('sequelize-typescript');
        return {
          Sequelize: jest.fn().mockImplementation((config) => {
            expect(config.dialectOptions.ssl).toEqual({
              require: true,
              rejectUnauthorized: false
            });
            return mockSequelize;
          })
        };
      });

      const provider = databaseProviders[0];
      await provider.useFactory();
    });

    it('debería configurar logging en desarrollo', async () => {
      process.env.NODE_ENV = 'development';
      
      const mockSequelize = {
        authenticate: jest.fn().mockResolvedValue(true),
        addModels: jest.fn(),
        sync: jest.fn().mockResolvedValue(true),
        close: jest.fn().mockResolvedValue(true),
        models: {}
      };

      jest.doMock('sequelize-typescript', () => {
        return {
          Sequelize: jest.fn().mockImplementation((config) => {
            expect(config.logging).toBe(console.log);
            return mockSequelize;
          })
        };
      });

      const provider = databaseProviders[0];
      await provider.useFactory();
    });

    it('debería desactivar logging en producción', async () => {
      process.env.NODE_ENV = 'production';
      
      const mockSequelize = {
        authenticate: jest.fn().mockResolvedValue(true),
        addModels: jest.fn(),
        sync: jest.fn().mockResolvedValue(true),
        close: jest.fn().mockResolvedValue(true),
        models: {}
      };

      jest.doMock('sequelize-typescript', () => {
        return {
          Sequelize: jest.fn().mockImplementation((config) => {
            expect(config.logging).toBe(false);
            return mockSequelize;
          })
        };
      });

      const provider = databaseProviders[0];
      await provider.useFactory();
    });
  });
});
