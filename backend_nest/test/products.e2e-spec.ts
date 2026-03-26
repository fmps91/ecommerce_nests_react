import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { Sequelize } from 'sequelize-typescript';
import { Product } from '../src/products/models/product.model';
import { Role } from '../src/rols/models/role.model';

describe('ProductController (E2E)', () => {
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

  describe('POST /products', () => {
    it('should create a new product successfully', () => {
      const createProductDto = {
        nombre: 'Test Product',
        precio: 99.99,
        stock: 10,
        descripcion: 'Test description',
        imagen: 'https://example.com/image.jpg',
      };

      return request(app.getHttpServer())
        .post('/products')
        .send(createProductDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('nombre', createProductDto.nombre);
          expect(res.body).toHaveProperty('precio', createProductDto.precio);
          expect(res.body).toHaveProperty('stock', createProductDto.stock);
          expect(res.body).toHaveProperty('descripcion', createProductDto.descripcion);
          expect(res.body).toHaveProperty('imagen', createProductDto.imagen);
        });
    });

    it('should validate required fields', () => {
      return request(app.getHttpServer())
        .post('/products')
        .send({})
        .expect(400);
    });

    it('should validate nombre field', () => {
      const createProductDto = {
        nombre: '',
        precio: 99.99,
        stock: 10,
      };

      return request(app.getHttpServer())
        .post('/products')
        .send(createProductDto)
        .expect(400);
    });

    it('should validate precio field', () => {
      const createProductDto = {
        nombre: 'Test Product',
        precio: -10,
        stock: 10,
      };

      return request(app.getHttpServer())
        .post('/products')
        .send(createProductDto)
        .expect(400);
    });

    it('should validate stock field', () => {
      const createProductDto = {
        nombre: 'Test Product',
        precio: 99.99,
        stock: -5,
      };

      return request(app.getHttpServer())
        .post('/products')
        .send(createProductDto)
        .expect(400);
    });
  });

  describe('GET /products', () => {
    beforeEach(async () => {
      // Crear productos de prueba
      await Product.create({
        id: 'product-1',
        nombre: 'Product 1',
        precio: 99.99,
        stock: 10,
        descripcion: 'Description 1',
        imagen: 'https://example.com/image1.jpg',
      });

      await Product.create({
        id: 'product-2',
        nombre: 'Product 2',
        precio: 149.99,
        stock: 5,
        descripcion: 'Description 2',
        imagen: 'https://example.com/image2.jpg',
      });
    });

    it('should return paginated products with default values', () => {
      return request(app.getHttpServer())
        .get('/products')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(res.body).toHaveProperty('meta');
          expect(res.body.data).toHaveLength(2);
          expect(res.body.meta.total).toBe(2);
          expect(res.body.meta.page).toBe(1);
          expect(res.body.meta.limit).toBe(10);
          expect(res.body.meta.totalPages).toBe(1);
          expect(res.body.meta.hasNextPage).toBe(false);
          expect(res.body.meta.hasPreviousPage).toBe(false);
        });
    });

    it('should return paginated products with custom values', () => {
      return request(app.getHttpServer())
        .get('/products?page=2&limit=1')
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toHaveLength(1);
          expect(res.body.meta.page).toBe(2);
          expect(res.body.meta.limit).toBe(1);
          expect(res.body.meta.totalPages).toBe(2);
          expect(res.body.meta.hasNextPage).toBe(false);
          expect(res.body.meta.hasPreviousPage).toBe(true);
        });
    });

    it('should handle invalid pagination values', () => {
      return request(app.getHttpServer())
        .get('/products?page=0&limit=-5')
        .expect(200)
        .expect((res) => {
          // Debe usar valores por defecto
          expect(res.body.meta.page).toBe(1);
          expect(res.body.meta.limit).toBe(10);
        });
    });
  });

  describe('GET /products/:id', () => {
    beforeEach(async () => {
      // Crear producto de prueba
      await Product.create({
        id: 'product-123',
        nombre: 'Test Product',
        precio: 99.99,
        stock: 10,
        descripcion: 'Test description',
        imagen: 'https://example.com/image.jpg',
      });
    });

    it('should return a product by id', () => {
      return request(app.getHttpServer())
        .get('/products/product-123')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', 'product-123');
          expect(res.body).toHaveProperty('nombre', 'Test Product');
          expect(res.body).toHaveProperty('precio', 99.99);
          expect(res.body).toHaveProperty('stock', 10);
          expect(res.body).toHaveProperty('descripcion', 'Test description');
          expect(res.body).toHaveProperty('imagen', 'https://example.com/image.jpg');
        });
    });

    it('should return 404 for non-existent product', () => {
      return request(app.getHttpServer())
        .get('/products/nonexistent-id')
        .expect(404);
    });

    it('should validate id format', () => {
      return request(app.getHttpServer())
        .get('/products/invalid-uuid')
        .expect(400);
    });
  });

  describe('PATCH /products/:id', () => {
    beforeEach(async () => {
      // Crear producto de prueba
      await Product.create({
        id: 'product-123',
        nombre: 'Original Product',
        precio: 99.99,
        stock: 10,
        descripcion: 'Original description',
        imagen: 'https://example.com/image.jpg',
      });
    });

    it('should update a product successfully', () => {
      const updateProductDto = {
        nombre: 'Updated Product',
        precio: 149.99,
      };

      return request(app.getHttpServer())
        .patch('/products/product-123')
        .send(updateProductDto)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', 'product-123');
          expect(res.body).toHaveProperty('nombre', 'Updated Product');
          expect(res.body).toHaveProperty('precio', 149.99);
          expect(res.body).toHaveProperty('stock', 10); // unchanged
          expect(res.body).toHaveProperty('descripcion', 'Original description'); // unchanged
        });
    });

    it('should return 404 when updating non-existent product', () => {
      const updateProductDto = {
        nombre: 'Updated Product',
      };

      return request(app.getHttpServer())
        .patch('/products/nonexistent-id')
        .send(updateProductDto)
        .expect(404);
    });

    it('should validate update data', () => {
      const updateProductDto = {
        precio: -10, // invalid
        stock: -5,   // invalid
      };

      return request(app.getHttpServer())
        .patch('/products/product-123')
        .send(updateProductDto)
        .expect(400);
    });
  });

  describe('DELETE /products/:id', () => {
    beforeEach(async () => {
      // Crear producto de prueba
      await Product.create({
        id: 'product-123',
        nombre: 'Test Product',
        precio: 99.99,
        stock: 10,
        descripcion: 'Test description',
        imagen: 'https://example.com/image.jpg',
      });
    });

    it('should delete a product successfully', () => {
      return request(app.getHttpServer())
        .delete('/products/product-123')
        .expect(204);
    });

    it('should return 404 when deleting non-existent product', () => {
      return request(app.getHttpServer())
        .delete('/products/nonexistent-id')
        .expect(404);
    });
  });

  describe('GET /products/all', () => {
    beforeEach(async () => {
      // Crear productos de prueba
      await Product.create({
        id: 'product-1',
        nombre: 'Product 1',
        precio: 99.99,
        stock: 10,
        descripcion: 'Description 1',
        imagen: 'https://example.com/image1.jpg',
      });

      await Product.create({
        id: 'product-2',
        nombre: 'Product 2',
        precio: 149.99,
        stock: 5,
        descripcion: 'Description 2',
        imagen: 'https://example.com/image2.jpg',
      });
    });

    it('should return all products without pagination', () => {
      return request(app.getHttpServer())
        .get('/products/all')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body).toHaveLength(2);
          expect(res.body[0]).toHaveProperty('id', 'product-1');
          expect(res.body[1]).toHaveProperty('id', 'product-2');
        });
    });
  });

  describe('DELETE /products/delete/:id', () => {
    beforeEach(async () => {
      // Crear producto de prueba
      await Product.create({
        id: 'product-123',
        nombre: 'Test Product',
        precio: 99.99,
        stock: 10,
        descripcion: 'Test description',
        imagen: 'https://example.com/image.jpg',
      });
    });

    it('should hard delete a product successfully', () => {
      return request(app.getHttpServer())
        .delete('/products/delete/product-123')
        .expect(204);
    });

    it('should return 404 when hard deleting non-existent product', () => {
      return request(app.getHttpServer())
        .delete('/products/delete/nonexistent-id')
        .expect(404);
    });
  });
});
