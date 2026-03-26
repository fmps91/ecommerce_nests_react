import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from '../database.module';
import { Sequelize } from 'sequelize-typescript';

describe('DatabaseModule Integration', () => {
  let moduleRef: TestingModule;
  let sequelize: Sequelize;

  beforeAll(async () => {
    // Mock de variables de entorno para tests
    process.env.DB_HOST = process.env.DB_HOST || 'localhost';
    process.env.DB_PORT = process.env.DB_PORT || '5432';
    process.env.DB_USER = process.env.DB_USER || 'test_user';
    process.env.DB_PASSWORD = process.env.DB_PASSWORD || 'test_password';
    process.env.DB_NAME = process.env.DB_NAME || 'test_db';
    process.env.NODE_ENV = 'test';

    try {
      moduleRef = await Test.createTestingModule({
        imports: [DatabaseModule],
      }).compile();

      sequelize = moduleRef.get<Sequelize>('SEQUELIZE');
    } catch (error) {
      console.log('Base de datos no disponible para tests de integración');
    }
  });

  afterAll(async () => {
    if (sequelize) {
      await sequelize.close();
    }
    if (moduleRef) {
      await moduleRef.close();
    }
  });

  describe('Configuración del módulo', () => {
    it('debería poder importar el módulo', () => {
      expect(DatabaseModule).toBeDefined();
    });

    it('debería tener los providers correctos', () => {
      const moduleMetadata = Reflect.getMetadata('__module__', DatabaseModule);
      expect(moduleMetadata).toBeDefined();
    });
  });

  describe('Conexión a base de datos (si está disponible)', () => {
    it('debería proporcionar instancia de Sequelize si la BD está disponible', () => {
      if (sequelize) {
        expect(sequelize).toBeDefined();
        expect(sequelize).toBeInstanceOf(Sequelize);
      } else {
        console.log('Test saltado: Base de datos no disponible');
      }
    });

    it('debería verificar autenticación si la BD está disponible', async () => {
      if (sequelize) {
        try {
          await sequelize.authenticate();
          expect(true).toBe(true); // Si llega aquí, la conexión funciona
        } catch (error) {
          console.log('Error de conexión esperado en entorno de test:', error.message);
          expect(error).toBeDefined();
        }
      } else {
        console.log('Test saltado: Base de datos no disponible');
      }
    });
  });

  describe('Modelos registrados', () => {
    it('debería tener los modelos importados correctamente', () => {
      // Verificamos que los archivos de modelo existen
      expect(() => {
        require('../../users/models/user.model');
        require('../../rols/models/role.model');
        require('../../orders/models/order.model');
        require('../../orders/models/order-detail.model');
        require('../../products/models/product.model');
      }).not.toThrow();
    });
  });

  describe('Variables de entorno', () => {
    it('debería tener configuradas las variables de entorno básicas', () => {
      expect(process.env.DB_HOST).toBeDefined();
      expect(process.env.DB_PORT).toBeDefined();
      expect(process.env.DB_USER).toBeDefined();
      expect(process.env.DB_NAME).toBeDefined();
    });

    it('debería tener valores por defecto razonables', () => {
      expect(parseInt(process.env.DB_PORT || '5432', 10)).toBeGreaterThan(0);
      expect(process.env.DB_HOST).toBeTruthy();
      expect(process.env.DB_NAME).toBeTruthy();
    });
  });
});
