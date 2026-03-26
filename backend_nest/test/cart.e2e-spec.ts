import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { Sequelize } from 'sequelize-typescript';
import { Cart } from '../src/cart/models/cart.model';
import { CartItem } from '../src/cart/models/cart-item.model';
import { Product } from '../src/products/models/product.model';
import { User } from '../src/users/models/user.model';

describe('Cart API (e2e)', () => {
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
    
    // Crear producto de prueba
    await sequelize.getRepository(Product).create({
      id: 'test-product-id',
      nombre: 'Test Product',
      descripcion: 'Test product description',
      precio: 50.00,
      stock: 10,
      imagen: 'test-image.jpg',
    });

    // Crear usuario de prueba
    await sequelize.getRepository(User).create({
      id: 'test-user-id',
      email: 'test@example.com',
      password: 'hashedpassword',
      roleId: 'test-role-id',
    });
  });

  afterAll(async () => {
    await sequelize.close();
    await app.close();
  });

  describe('POST /cart', () => {
    it('should create a new cart successfully', () => {
      const createCartDto = {
        user_id: 'test-user-id',
      };

      return request(app.getHttpServer())
        .post('/cart')
        .send(createCartDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.user_id).toBe(createCartDto.user_id);
          expect(res.body.status).toBe('active');
          expect(res.body.total).toBe(0);
          expect(res.body).toHaveProperty('created_at');
          expect(res.body).toHaveProperty('updated_at');
          expect(Array.isArray(res.body.items)).toBe(true);
        });
    });

    it('should create a cart without user_id (guest cart)', () => {
      return request(app.getHttpServer())
        .post('/cart')
        .send({})
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.user_id).toBeUndefined();
          expect(res.body.status).toBe('active');
          expect(res.body.total).toBe(0);
        });
    });

    it('should return 400 when user_id is not a valid UUID', () => {
      const createCartDto = {
        user_id: 'invalid-uuid',
      };

      return request(app.getHttpServer())
        .post('/cart')
        .send(createCartDto)
        .expect(400);
    });
  });

  describe('POST /cart/:id/items', () => {
    beforeEach(async () => {
      // Crear carrito de prueba
      await sequelize.getRepository(Cart).create({
        id: 'test-cart-id',
        user_id: 'test-user-id',
        status: 'active',
        total: 0,
      });
    });

    it('should add item to cart successfully', () => {
      const addItemDto = {
        product_id: 'test-product-id',
        quantity: 2,
      };

      return request(app.getHttpServer())
        .post('/cart/test-cart-id/items')
        .send(addItemDto)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe('test-cart-id');
          expect(res.body.items).toHaveLength(1);
          expect(res.body.items[0].product_id).toBe(addItemDto.product_id);
          expect(res.body.items[0].quantity).toBe(addItemDto.quantity);
          expect(res.body.items[0].unit_price).toBe(50.00);
          expect(res.body.items[0].subtotal).toBe(100.00);
          expect(res.body.total).toBe(100.00);
          expect(res.body.items[0].product).toHaveProperty('id');
          expect(res.body.items[0].product).toHaveProperty('nombre');
          expect(res.body.items[0].product).toHaveProperty('precio');
        });
    });

    it('should add item to non-existent cart (creates new cart)', () => {
      const addItemDto = {
        product_id: 'test-product-id',
        quantity: 1,
      };

      return request(app.getHttpServer())
        .post('/cart/non-existent-cart-id/items')
        .send(addItemDto)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.items).toHaveLength(1);
          expect(res.body.total).toBe(50.00);
        });
    });

    it('should return 404 when product not found', () => {
      const addItemDto = {
        product_id: 'non-existent-product-id',
        quantity: 2,
      };

      return request(app.getHttpServer())
        .post('/cart/test-cart-id/items')
        .send(addItemDto)
        .expect(404);
    });

    it('should return 400 when insufficient stock', async () => {
      // Crear producto con stock limitado
      await sequelize.getRepository(Product).create({
        id: 'low-stock-product-id',
        nombre: 'Low Stock Product',
        precio: 25.00,
        stock: 1,
      });

      const addItemDto = {
        product_id: 'low-stock-product-id',
        quantity: 5, // Más que el stock disponible
      };

      return request(app.getHttpServer())
        .post('/cart/test-cart-id/items')
        .send(addItemDto)
        .expect(400);
    });

    it('should return 400 when quantity is invalid', () => {
      const addItemDto = {
        product_id: 'test-product-id',
        quantity: 0, // Cantidad inválida
      };

      return request(app.getHttpServer())
        .post('/cart/test-cart-id/items')
        .send(addItemDto)
        .expect(400);
    });

    it('should return 400 when product_id is not a valid UUID', () => {
      const addItemDto = {
        product_id: 'invalid-uuid',
        quantity: 2,
      };

      return request(app.getHttpServer())
        .post('/cart/test-cart-id/items')
        .send(addItemDto)
        .expect(400);
    });

    it('should update existing item quantity', async () => {
      // Primero agregar un item
      await request(app.getHttpServer())
        .post('/cart/test-cart-id/items')
        .send({
          product_id: 'test-product-id',
          quantity: 2,
        });

      // Luego agregar más del mismo producto
      return request(app.getHttpServer())
        .post('/cart/test-cart-id/items')
        .send({
          product_id: 'test-product-id',
          quantity: 1,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.items).toHaveLength(1);
          expect(res.body.items[0].quantity).toBe(3); // 2 + 1
          expect(res.body.items[0].subtotal).toBe(150.00); // 3 * 50
          expect(res.body.total).toBe(150.00);
        });
    });
  });

  describe('GET /cart/:id', () => {
    beforeEach(async () => {
      // Crear carrito con items
      const cart = await sequelize.getRepository(Cart).create({
        id: 'test-cart-id',
        user_id: 'test-user-id',
        status: 'active',
        total: 100,
      });

      await sequelize.getRepository(CartItem).create({
        id: 'test-item-id',
        cart_id: cart.id,
        product_id: 'test-product-id',
        quantity: 2,
        unit_price: 50.00,
        subtotal: 100.00,
      });
    });

    it('should return cart by id', () => {
      return request(app.getHttpServer())
        .get('/cart/test-cart-id')
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe('test-cart-id');
          expect(res.body.user_id).toBe('test-user-id');
          expect(res.body.status).toBe('active');
          expect(res.body.total).toBe(100);
          expect(res.body.items).toHaveLength(1);
          expect(res.body.items[0].product_id).toBe('test-product-id');
          expect(res.body.items[0].product).toHaveProperty('nombre');
        });
    });

    it('should return 404 when cart not found', () => {
      return request(app.getHttpServer())
        .get('/cart/non-existent-id')
        .expect(404);
    });

    it('should return 400 when cart id is not a valid UUID', () => {
      return request(app.getHttpServer())
        .get('/cart/invalid-uuid')
        .expect(400);
    });
  });

  describe('PUT /cart/:id/items/:productId', () => {
    beforeEach(async () => {
      // Crear carrito con items
      const cart = await sequelize.getRepository(Cart).create({
        id: 'test-cart-id',
        user_id: 'test-user-id',
        status: 'active',
        total: 100,
      });

      await sequelize.getRepository(CartItem).create({
        id: 'test-item-id',
        cart_id: cart.id,
        product_id: 'test-product-id',
        quantity: 2,
        unit_price: 50.00,
        subtotal: 100.00,
      });
    });

    it('should update item quantity successfully', () => {
      const updateItemDto = {
        quantity: 5,
      };

      return request(app.getHttpServer())
        .put('/cart/test-cart-id/items/test-product-id')
        .send(updateItemDto)
        .expect(200)
        .expect((res) => {
          expect(res.body.items).toHaveLength(1);
          expect(res.body.items[0].quantity).toBe(5);
          expect(res.body.items[0].subtotal).toBe(250.00); // 5 * 50
          expect(res.body.total).toBe(250.00);
        });
    });

    it('should return 404 when cart not found', () => {
      const updateItemDto = {
        quantity: 3,
      };

      return request(app.getHttpServer())
        .put('/cart/non-existent-id/items/test-product-id')
        .send(updateItemDto)
        .expect(404);
    });

    it('should return 404 when item not found in cart', () => {
      const updateItemDto = {
        quantity: 3,
      };

      return request(app.getHttpServer())
        .put('/cart/test-cart-id/items/non-existent-product-id')
        .send(updateItemDto)
        .expect(404);
    });

    it('should return 400 when quantity is invalid', () => {
      const updateItemDto = {
        quantity: 0,
      };

      return request(app.getHttpServer())
        .put('/cart/test-cart-id/items/test-product-id')
        .send(updateItemDto)
        .expect(400);
    });

    it('should return 400 when insufficient stock for increase', async () => {
      // Actualizar stock del producto a un valor bajo
      await sequelize.getRepository(Product).update(
        { stock: 2 },
        { where: { id: 'test-product-id' } }
      );

      const updateItemDto = {
        quantity: 5, // Intentar aumentar a 5 (solo hay 2 disponibles)
      };

      return request(app.getHttpServer())
        .put('/cart/test-cart-id/items/test-product-id')
        .send(updateItemDto)
        .expect(400);
    });
  });

  describe('DELETE /cart/:id/items/:productId', () => {
    beforeEach(async () => {
      // Crear carrito con items
      const cart = await sequelize.getRepository(Cart).create({
        id: 'test-cart-id',
        user_id: 'test-user-id',
        status: 'active',
        total: 100,
      });

      await sequelize.getRepository(CartItem).create({
        id: 'test-item-id',
        cart_id: cart.id,
        product_id: 'test-product-id',
        quantity: 2,
        unit_price: 50.00,
        subtotal: 100.00,
      });
    });

    it('should remove item from cart successfully', () => {
      return request(app.getHttpServer())
        .delete('/cart/test-cart-id/items/test-product-id')
        .expect(200)
        .expect((res) => {
          expect(res.body.items).toHaveLength(0);
          expect(res.body.total).toBe(0);
        });
    });

    it('should return 404 when cart not found', () => {
      return request(app.getHttpServer())
        .delete('/cart/non-existent-id/items/test-product-id')
        .expect(404);
    });

    it('should return 404 when item not found in cart', () => {
      return request(app.getHttpServer())
        .delete('/cart/test-cart-id/items/non-existent-product-id')
        .expect(404);
    });

    it('should restore product stock when item is removed', async () => {
      // Verificar stock inicial
      const productBefore = await sequelize.getRepository(Product).findByPk('test-product-id');
      const initialStock = productBefore?.stock || 0;

      // Remover item del carrito
      await request(app.getHttpServer())
        .delete('/cart/test-cart-id/items/test-product-id')
        .expect(200);

      // Verificar que el stock fue restaurado
      const productAfter = await sequelize.getRepository(Product).findByPk('test-product-id');
      expect(productAfter?.stock).toBe(initialStock + 2); // Stock restaurado
    });
  });

  describe('DELETE /cart/:id/clear', () => {
    beforeEach(async () => {
      // Crear carrito con múltiples items
      const cart = await sequelize.getRepository(Cart).create({
        id: 'test-cart-id',
        user_id: 'test-user-id',
        status: 'active',
        total: 200,
      });

      await sequelize.getRepository(CartItem).create({
        id: 'test-item-1',
        cart_id: cart.id,
        product_id: 'test-product-id',
        quantity: 2,
        unit_price: 50.00,
        subtotal: 100.00,
      });

      await sequelize.getRepository(CartItem).create({
        id: 'test-item-2',
        cart_id: cart.id,
        product_id: 'test-product-id',
        quantity: 2,
        unit_price: 50.00,
        subtotal: 100.00,
      });
    });

    it('should clear cart successfully', () => {
      return request(app.getHttpServer())
        .delete('/cart/test-cart-id/clear')
        .expect(200)
        .expect((res) => {
          expect(res.body.items).toHaveLength(0);
          expect(res.body.total).toBe(0);
        });
    });

    it('should return 404 when cart not found', () => {
      return request(app.getHttpServer())
        .delete('/cart/non-existent-id/clear')
        .expect(404);
    });

    it('should restore stock for all items when cart is cleared', async () => {
      // Verificar stock inicial
      const productBefore = await sequelize.getRepository(Product).findByPk('test-product-id');
      const initialStock = productBefore?.stock || 0;

      // Limpiar carrito
      await request(app.getHttpServer())
        .delete('/cart/test-cart-id/clear')
        .expect(200);

      // Verificar que el stock fue restaurado (4 items en total)
      const productAfter = await sequelize.getRepository(Product).findByPk('test-product-id');
      expect(productAfter?.stock).toBe(initialStock + 4);
    });
  });

  describe('Complex workflows', () => {
    it('should handle complete cart lifecycle', async () => {
      // 1. Crear carrito
      const createResponse = await request(app.getHttpServer())
        .post('/cart')
        .send({ user_id: 'test-user-id' })
        .expect(201);

      const cartId = createResponse.body.id;

      // 2. Agregar primer item
      await request(app.getHttpServer())
        .post(`/cart/${cartId}/items`)
        .send({
          product_id: 'test-product-id',
          quantity: 2,
        })
        .expect(200);

      // 3. Agregar más del mismo item
      await request(app.getHttpServer())
        .post(`/cart/${cartId}/items`)
        .send({
          product_id: 'test-product-id',
          quantity: 1,
        })
        .expect(200);

      // 4. Actualizar cantidad
      await request(app.getHttpServer())
        .put(`/cart/${cartId}/items/test-product-id`)
        .send({
          quantity: 5,
        })
        .expect(200);

      // 5. Ver carrito
      const cartResponse = await request(app.getHttpServer())
        .get(`/cart/${cartId}`)
        .expect(200);

      expect(cartResponse.body.items).toHaveLength(1);
      expect(cartResponse.body.items[0].quantity).toBe(5);
      expect(cartResponse.body.total).toBe(250.00);

      // 6. Limpiar carrito
      await request(app.getHttpServer())
        .delete(`/cart/${cartId}/clear`)
        .expect(200);

      // 7. Verificar carrito vacío
      const finalCartResponse = await request(app.getHttpServer())
        .get(`/cart/${cartId}`)
        .expect(200);

      expect(finalCartResponse.body.items).toHaveLength(0);
      expect(finalCartResponse.body.total).toBe(0);
    });

    it('should handle multiple different products', async () => {
      // Crear segundo producto
      await sequelize.getRepository(Product).create({
        id: 'test-product-2-id',
        nombre: 'Test Product 2',
        precio: 25.00,
        stock: 5,
      });

      // Crear carrito
      const createResponse = await request(app.getHttpServer())
        .post('/cart')
        .send({ user_id: 'test-user-id' })
        .expect(201);

      const cartId = createResponse.body.id;

      // Agregar primer producto
      await request(app.getHttpServer())
        .post(`/cart/${cartId}/items`)
        .send({
          product_id: 'test-product-id',
          quantity: 2,
        })
        .expect(200);

      // Agregar segundo producto
      await request(app.getHttpServer())
        .post(`/cart/${cartId}/items`)
        .send({
          product_id: 'test-product-2-id',
          quantity: 3,
        })
        .expect(200);

      // Ver carrito
      const cartResponse = await request(app.getHttpServer())
        .get(`/cart/${cartId}`)
        .expect(200);

      expect(cartResponse.body.items).toHaveLength(2);
      expect(cartResponse.body.total).toBe(175.00); // (2 * 50) + (3 * 25)
    });
  });

  describe('Error handling', () => {
    it('should handle malformed JSON gracefully', () => {
      return request(app.getHttpServer())
        .post('/cart')
        .set('Content-Type', 'application/json')
        .send('{"user_id": "test", invalid}')
        .expect(400);
    });

    it('should handle missing required fields', () => {
      return request(app.getHttpServer())
        .post('/cart/test-cart-id/items')
        .send({})
        .expect(400);
    });

    it('should handle invalid data types', () => {
      const invalidData = {
        product_id: 123, // Should be string UUID
        quantity: 'not-a-number', // Should be number
      };

      return request(app.getHttpServer())
        .post('/cart/test-cart-id/items')
        .send(invalidData)
        .expect(400);
    });

    it('should handle concurrent operations on same cart', async () => {
      // Crear carrito
      const createResponse = await request(app.getHttpServer())
        .post('/cart')
        .send({ user_id: 'test-user-id' })
        .expect(201);

      const cartId = createResponse.body.id;

      // Intentar agregar el mismo producto concurrentemente
      const addItemDto = {
        product_id: 'test-product-id',
        quantity: 1,
      };

      // Estas operaciones deberían manejarse correctamente con transacciones
      const promise1 = request(app.getHttpServer())
        .post(`/cart/${cartId}/items`)
        .send(addItemDto);

      const promise2 = request(app.getHttpServer())
        .post(`/cart/${cartId}/items`)
        .send(addItemDto);

      const [response1, response2] = await Promise.allSettled([promise1, promise2]);

      // Al menos una debería tener éxito
      expect(
        response1.status === 'fulfilled' || response2.status === 'fulfilled'
      ).toBe(true);
    });
  });

  describe('Performance and limits', () => {
    it('should handle large quantities within limits', async () => {
      // Crear producto con mucho stock
      await sequelize.getRepository(Product).create({
        id: 'high-stock-product-id',
        nombre: 'High Stock Product',
        precio: 1.00,
        stock: 1000,
      });

      // Crear carrito
      const createResponse = await request(app.getHttpServer())
        .post('/cart')
        .send({ user_id: 'test-user-id' })
        .expect(201);

      const cartId = createResponse.body.id;

      // Agregar gran cantidad
      return request(app.getHttpServer())
        .post(`/cart/${cartId}/items`)
        .send({
          product_id: 'high-stock-product-id',
          quantity: 500,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.items[0].quantity).toBe(500);
          expect(res.body.total).toBe(500.00);
        });
    });

    it('should handle decimal prices correctly', async () => {
      // Crear producto con precio decimal
      await sequelize.getRepository(Product).create({
        id: 'decimal-price-product-id',
        nombre: 'Decimal Price Product',
        precio: 99.99,
        stock: 10,
      });

      // Crear carrito
      const createResponse = await request(app.getHttpServer())
        .post('/cart')
        .send({ user_id: 'test-user-id' })
        .expect(201);

      const cartId = createResponse.body.id;

      // Agregar item
      return request(app.getHttpServer())
        .post(`/cart/${cartId}/items`)
        .send({
          product_id: 'decimal-price-product-id',
          quantity: 3,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.items[0].subtotal).toBeCloseTo(299.97, 2);
          expect(res.body.total).toBeCloseTo(299.97, 2);
        });
    });
  });
});
