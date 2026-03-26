import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { AppModule } from '../src/app.module';
import { Order } from '../src/orders/models/order.model';
import { OrderDetail } from '../src/orders/models/order-detail.model';
import { User } from '../src/users/models/user.model';
import { Product } from '../src/products/models/product.model';
import { OrderStatus } from '../src/orders/models/order.model';
const request = require('supertest');

describe('Orders E2E', () => {
  let app: INestApplication;
  let sequelize: Sequelize;
  let testUser: any;
  let testProduct: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    sequelize = moduleFixture.get<Sequelize>('SEQUELIZE');

    await app.init();
  });

  beforeEach(async () => {
    // Clean up database
    await OrderDetail.destroy({ where: {}, force: true });
    await Order.destroy({ where: {}, force: true });
    await Product.destroy({ where: {}, force: true });
    await User.destroy({ where: {}, force: true });

    // Create test user
    testUser = await User.create({
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      phone: '1234567890'
    } as any);

    // Create test product
    testProduct = await Product.create({
      name: 'Test Product',
      description: 'Test Description',
      price: 10.99,
      category: 'Test Category',
      stock: 100,
      sku: 'TEST-001'
    } as any);
  });

  afterAll(async () => {
    await sequelize.close();
    await app.close();
  });

  describe('/orders (POST)', () => {
    it('should create a new order successfully', async () => {
      const createOrderDto = {
        userId: testUser.id,
        items: [
          {
            productId: testProduct.id,
            productName: testProduct.name,
            quantity: 2,
            unitPrice: testProduct.price,
            subtotal: testProduct.price * 2
          }
        ],
        subtotal: testProduct.price * 2,
        total: testProduct.price * 2,
        shippingAddress: {
          street: '123 Main St',
          city: 'Test City',
          state: 'Test State',
          zipCode: '12345',
          country: 'Test Country'
        }
      };

      return request(app.getHttpServer())
        .post('/orders')
        .send(createOrderDto)
        .expect(201)
        .expect((res) => {
          expect(res.body.id).toBeDefined();
          expect(res.body.userId).toBe(testUser.id);
          expect(res.body.items).toHaveLength(1);
          expect(res.body.items[0].productId).toBe(testProduct.id);
          expect(res.body.isPaid).toBe(false);
          expect(res.body.isShipped).toBe(false);
          expect(res.body.isDelivered).toBe(false);
          expect(res.body.formattedTotal).toBe(`${createOrderDto.total}`);
          expect(res.body.createdAt).toBeDefined();
        });
    });

    it('should return 400 for invalid order data', async () => {
      const invalidOrderDto = {
        userId: 'invalid-uuid',
        items: [],
        subtotal: -10,
        total: -10
      };

      return request(app.getHttpServer())
        .post('/orders')
        .send(invalidOrderDto)
        .expect(400);
    });

    it('should return 400 when user does not exist', async () => {
      const createOrderDto = {
        userId: '123e4567-e89b-12d3-a456-426614174999',
        items: [
          {
            productId: testProduct.id,
            productName: testProduct.name,
            quantity: 1,
            unitPrice: testProduct.price,
            subtotal: testProduct.price
          }
        ],
        subtotal: testProduct.price,
        total: testProduct.price
      };

      return request(app.getHttpServer())
        .post('/orders')
        .send(createOrderDto)
        .expect(400);
    });
  });

  describe('/orders (GET)', () => {
    beforeEach(async () => {
      // Create test orders
      await Order.bulkCreate([
        {
          userId: testUser.id,
          total: 100.50,
          status: OrderStatus.PENDING,
          isPaid: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as any,
        {
          userId: testUser.id,
          total: 75.25,
          status: OrderStatus.COMPLETED,
          isPaid: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as any,
      ]);
    });

    it('should return paginated orders', () => {
      return request(app.getHttpServer())
        .get('/orders')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(res.body).toHaveProperty('meta');
          expect(Array.isArray(res.body.data)).toBe(true);
          expect(res.body.data.length).toBeGreaterThan(0);
          expect(res.body.meta).toHaveProperty('total_items');
          expect(res.body.meta).toHaveProperty('page');
          expect(res.body.meta).toHaveProperty('limit');
        });
    });

    it('should respect pagination parameters', () => {
      return request(app.getHttpServer())
        .get('/orders?page=1&limit=5')
        .expect(200)
        .expect((res) => {
          expect(res.body.meta.page).toBe(1);
          expect(res.body.meta.limit).toBe(5);
        });
    });
  });

  describe('/orders/all (GET)', () => {
    beforeEach(async () => {
      await Order.bulkCreate([
        {
          userId: testUser.id,
          total: 100,
          status: OrderStatus.PENDING,
          isPaid: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as any,
        {
          userId: testUser.id,
          total: 200,
          status: OrderStatus.COMPLETED,
          isPaid: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as any,
      ]);
    });

    it('should return all orders without pagination', () => {
      return request(app.getHttpServer())
        .get('/orders/all')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBe(2);
        });
    });
  });

  describe('/orders/my-orders/:userId (GET)', () => {
    beforeEach(async () => {
      await Order.bulkCreate([
        {
          userId: testUser.id,
          total: 100,
          status: OrderStatus.PENDING,
          isPaid: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as any,
        {
          userId: '123e4567-e89b-12d3-a456-426614174999',
          total: 200,
          status: OrderStatus.COMPLETED,
          isPaid: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as any,
      ]);
    });

    it('should return orders for specific user', () => {
      return request(app.getHttpServer())
        .get(`/orders/my-orders/${testUser.id}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBe(1);
          expect(res.body[0].userId).toBe(testUser.id);
        });
    });

    it('should return empty array for user with no orders', () => {
      return request(app.getHttpServer())
        .get('/orders/my-orders/123e4567-e89b-12d3-a456-426614888')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBe(0);
        });
    });
  });

  describe('/orders/stats (GET)', () => {
    beforeEach(async () => {
      await Order.bulkCreate([
        {
          userId: testUser.id,
          total: 100,
          status: OrderStatus.PENDING,
          isPaid: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as any,
        {
          userId: testUser.id,
          total: 200,
          status: OrderStatus.COMPLETED,
          isPaid: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as any,
        {
          userId: testUser.id,
          total: 150,
          status: OrderStatus.CANCELLED,
          isPaid: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as any,
      ]);
    });

    it('should return order statistics', () => {
      return request(app.getHttpServer())
        .get('/orders/stats')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('totalOrders');
          expect(res.body).toHaveProperty('totalRevenue');
          expect(res.body).toHaveProperty('ordersByStatus');
          expect(typeof res.body.totalOrders).toBe('number');
          expect(typeof res.body.totalRevenue).toBe('number');
        });
    });
  });

  describe('/orders/:id (GET)', () => {
    let testOrder: any;

    beforeEach(async () => {
      testOrder = await Order.create({
        userId: testUser.id,
        total: 100.50,
        status: OrderStatus.PENDING,
        isPaid: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);
    });

    it('should return order by ID', () => {
      return request(app.getHttpServer())
        .get(`/orders/${testOrder.id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(testOrder.id);
          expect(res.body.userId).toBe(testUser.id);
          expect(res.body.status).toBe(OrderStatus.PENDING);
          expect(res.body.isPaid).toBe(false);
        });
    });

    it('should return 404 for non-existent order', () => {
      return request(app.getHttpServer())
        .get('/orders/123e4567-e89b-12d3-a456-426614174999')
        .expect(404);
    });
  });

  describe('/orders/:id (PATCH)', () => {
    let testOrder: any;

    beforeEach(async () => {
      testOrder = await Order.create({
        userId: testUser.id,
        total: 100.50,
        status: OrderStatus.PENDING,
        isPaid: false,
        notes: 'Original note',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);
    });

    it('should update order successfully', () => {
      const updateData = {
        status: OrderStatus.PROCESSING,
        notes: 'Updated note'
      };

      return request(app.getHttpServer())
        .patch(`/orders/${testOrder.id}`)
        .send(updateData)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(testOrder.id);
          expect(res.body.status).toBe(OrderStatus.PROCESSING);
          expect(res.body.notes).toBe('Updated note');
        });
    });

    it('should return 404 for non-existent order', () => {
      return request(app.getHttpServer())
        .patch('/orders/123e4567-e89b-12d3-a456-426614174999')
        .send({ status: OrderStatus.PROCESSING })
        .expect(404);
    });
  });

  describe('/orders/:id/status (PATCH)', () => {
    let testOrder: any;

    beforeEach(async () => {
      testOrder = await Order.create({
        userId: testUser.id,
        total: 100.50,
        status: OrderStatus.PENDING,
        isPaid: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);
    });

    it('should update order status successfully', () => {
      return request(app.getHttpServer())
        .patch(`/orders/${testOrder.id}/status`)
        .send({ status: OrderStatus.COMPLETED })
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(testOrder.id);
          expect(res.body.status).toBe(OrderStatus.COMPLETED);
        });
    });

    it('should return 400 for invalid status', () => {
      return request(app.getHttpServer())
        .patch(`/orders/${testOrder.id}/status`)
        .send({ status: 'INVALID_STATUS' })
        .expect(400);
    });

    it('should return 404 for non-existent order', () => {
      return request(app.getHttpServer())
        .patch('/orders/123e4567-e89b-12d3-a456-426614174999/status')
        .send({ status: OrderStatus.COMPLETED })
        .expect(404);
    });
  });

  describe('/orders/:id/mark-paid (PATCH)', () => {
    let testOrder: any;

    beforeEach(async () => {
      testOrder = await Order.create({
        userId: testUser.id,
        total: 100.50,
        status: OrderStatus.PENDING,
        isPaid: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);
    });

    it('should mark order as paid successfully', () => {
      return request(app.getHttpServer())
        .patch(`/orders/${testOrder.id}/mark-paid`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(testOrder.id);
          expect(res.body.isPaid).toBe(true);
        });
    });

    it('should return 404 for non-existent order', () => {
      return request(app.getHttpServer())
        .patch('/orders/123e4567-e89b-12d3-a456-426614174999/mark-paid')
        .expect(404);
    });
  });

  describe('/orders/:id (DELETE)', () => {
    let testOrder: any;

    beforeEach(async () => {
      testOrder = await Order.create({
        userId: testUser.id,
        total: 100.50,
        status: OrderStatus.PENDING,
        isPaid: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);
    });

    it('should delete order successfully', () => {
      return request(app.getHttpServer())
        .delete(`/orders/${testOrder.id}`)
        .expect(204);
    });

    it('should return 404 for non-existent order', () => {
      return request(app.getHttpServer())
        .delete('/orders/123e4567-e89b-12d3-a456-426614174999')
        .expect(404);
    });
  });

  describe('/orders/delete/:id (DELETE)', () => {
    let testOrder: any;

    beforeEach(async () => {
      testOrder = await Order.create({
        userId: testUser.id,
        total: 100.50,
        status: OrderStatus.PENDING,
        isPaid: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);
    });

    it('should hard delete order successfully', () => {
      return request(app.getHttpServer())
        .delete(`/orders/delete/${testOrder.id}`)
        .expect(204);
    });

    it('should return 404 for non-existent order', () => {
      return request(app.getHttpServer())
        .delete('/orders/delete/123e4567-e89b-12d3-a456-426614174999')
        .expect(404);
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete order lifecycle', async () => {
      // 1. Create order
      const createOrderDto = {
        userId: testUser.id,
        items: [
          {
            productId: testProduct.id,
            productName: testProduct.name,
            quantity: 2,
            unitPrice: testProduct.price,
            subtotal: testProduct.price * 2
          }
        ],
        subtotal: testProduct.price * 2,
        total: testProduct.price * 2
      };

      const createResponse = await request(app.getHttpServer())
        .post('/orders')
        .send(createOrderDto)
        .expect(201);

      const orderId = createResponse.body.id;

      // 2. Get order by ID
      await request(app.getHttpServer())
        .get(`/orders/${orderId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(orderId);
          expect(res.body.status).toBe(OrderStatus.PENDING);
        });

      // 3. Update status
      await request(app.getHttpServer())
        .patch(`/orders/${orderId}/status`)
        .send({ status: OrderStatus.PROCESSING })
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe(OrderStatus.PROCESSING);
        });

      // 4. Mark as paid
      await request(app.getHttpServer())
        .patch(`/orders/${orderId}/mark-paid`)
        .expect(200)
        .expect((res) => {
          expect(res.body.isPaid).toBe(true);
        });

      // 5. Update to completed
      await request(app.getHttpServer())
        .patch(`/orders/${orderId}/status`)
        .send({ status: OrderStatus.COMPLETED })
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe(OrderStatus.COMPLETED);
        });

      // 6. Delete order
      await request(app.getHttpServer())
        .delete(`/orders/${orderId}`)
        .expect(204);

      // 7. Verify order is deleted
      await request(app.getHttpServer())
        .get(`/orders/${orderId}`)
        .expect(404);
    });
  });
});
