import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { AppModule } from '../src/app.module';
import { Payment } from '../src/payments/models/payments.model';
import { PaymentMethod, PaymentStatus } from '../src/payments/models/payments.model';
const request = require('supertest');

describe('Payments E2E', () => {
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
    await Payment.destroy({ where: {}, force: true });
  });

  describe('/payments (POST)', () => {
    it('should create a payment successfully', () => {
      const createPaymentDto = {
        order_id: '123e4567-e89b-12d3-a456-426614174001',
        user_id: '123e4567-e89b-12d3-a456-426614174002',
        amount: 100.50,
        payment_method: PaymentMethod.CREDIT_CARD,
        transaction_id: 'txn_123456',
        metadata: { gateway: 'stripe' },
        notes: 'Test payment',
      };

      return request(app.getHttpServer())
        .post('/payments')
        .send(createPaymentDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.order_id).toBe(createPaymentDto.order_id);
          expect(res.body.amount).toBe(createPaymentDto.amount);
          expect(res.body.payment_method).toBe(createPaymentDto.payment_method);
        });
    });

    it('should return 400 for invalid order_id', () => {
      const invalidPayment = {
        order_id: 'invalid-uuid',
        user_id: '123e4567-e89b-12d3-a456-426614174002',
        amount: 100.50,
        payment_method: PaymentMethod.CREDIT_CARD,
      };

      return request(app.getHttpServer())
        .post('/payments')
        .send(invalidPayment)
        .expect(400);
    });

    it('should return 400 for negative amount', () => {
      const invalidPayment = {
        order_id: '123e4567-e89b-12d3-a456-426614174001',
        user_id: '123e4567-e89b-12d3-a456-426614174002',
        amount: -100,
        payment_method: PaymentMethod.CREDIT_CARD,
      };

      return request(app.getHttpServer())
        .post('/payments')
        .send(invalidPayment)
        .expect(400);
    });

    it('should return 400 for invalid payment method', () => {
      const invalidPayment = {
        order_id: '123e4567-e89b-12d3-a456-426614174001',
        user_id: '123e4567-e89b-12d3-a456-426614174002',
        amount: 100.50,
        payment_method: 'invalid_method',
      };

      return request(app.getHttpServer())
        .post('/payments')
        .send(invalidPayment)
        .expect(400);
    });

    it('should return 409 for duplicate payment', async () => {
      const createPaymentDto = {
        order_id: '123e4567-e89b-12d3-a456-426614174001',
        user_id: '123e4567-e89b-12d3-a456-426614174002',
        amount: 100.50,
        payment_method: PaymentMethod.CREDIT_CARD,
      };

      // Create first payment
      await request(app.getHttpServer())
        .post('/payments')
        .send(createPaymentDto)
        .expect(201);

      // Try to create duplicate
      return request(app.getHttpServer())
        .post('/payments')
        .send(createPaymentDto)
        .expect(409);
    });
  });

  describe('/payments (GET)', () => {
    beforeEach(async () => {
      // Create test payments
      await Payment.bulkCreate([
        {
          order_id: '123e4567-e89b-12d3-a456-426614174001',
          user_id: '123e4567-e89b-12d3-a456-426614174002',
          amount: 100.50,
          payment_method: PaymentMethod.CREDIT_CARD,
          status: PaymentStatus.COMPLETED,
          transaction_id: 'txn_123456',
          metadata: { gateway: 'stripe' },
          notes: 'Payment 1',
          created_at: new Date(),
          updated_at: new Date(),
        } as any,
        {
          order_id: '123e4567-e89b-12d3-a456-426614174003',
          user_id: '123e4567-e89b-12d3-a456-426614174002',
          amount: 75.25,
          payment_method: PaymentMethod.PAYPAL,
          status: PaymentStatus.PENDING,
          transaction_id: 'txn_789012',
          metadata: { gateway: 'paypal' },
          notes: 'Payment 2',
          created_at: new Date(),
          updated_at: new Date(),
        } as any,
      ]);
    });

    it('should return paginated payments', () => {
      return request(app.getHttpServer())
        .get('/payments')
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

    it('should return payments with custom pagination', () => {
      return request(app.getHttpServer())
        .get('/payments?page=1&limit=5')
        .expect(200)
        .expect((res) => {
          expect(res.body.meta.page).toBe(1);
          expect(res.body.meta.limit).toBe(5);
        });
    });

    it('should return empty array when no payments exist', async () => {
      await Payment.destroy({ where: {}, force: true });

      return request(app.getHttpServer())
        .get('/payments')
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toHaveLength(0);
          expect(res.body.meta.total_items).toBe(0);
        });
    });
  });

  describe('/payments/stats (GET)', () => {
    beforeEach(async () => {
      // Create test payments with different statuses
      await Payment.bulkCreate([
        {
          order_id: '123e4567-e89b-12d3-a456-426614174001',
          user_id: '123e4567-e89b-12d3-a456-426614174002',
          amount: 100,
          payment_method: PaymentMethod.CREDIT_CARD,
          status: PaymentStatus.COMPLETED,
          created_at: new Date(),
          updated_at: new Date(),
        } as any,
        {
          order_id: '123e4567-e89b-12d3-a456-426614174004',
          user_id: '123e4567-e89b-12d3-a456-426614174002',
          amount: 50,
          payment_method: PaymentMethod.PAYPAL,
          status: PaymentStatus.PENDING,
          created_at: new Date(),
          updated_at: new Date(),
        } as any,
        {
          order_id: '123e4567-e89b-12d3-a456-426614174005',
          user_id: '123e4567-e89b-12d3-a456-426614174002',
          amount: 25,
          payment_method: PaymentMethod.BANK_TRANSFER,
          status: PaymentStatus.FAILED,
          created_at: new Date(),
          updated_at: new Date(),
        } as any,
      ]);
    });

    it('should return payment stats for all users', () => {
      return request(app.getHttpServer())
        .get('/payments/stats')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
          
          const completedStat = res.body.find((stat: any) => stat.status === PaymentStatus.COMPLETED);
          const pendingStat = res.body.find((stat: any) => stat.status === PaymentStatus.PENDING);
          const failedStat = res.body.find((stat: any) => stat.status === PaymentStatus.FAILED);
          
          expect(completedStat).toBeDefined();
          expect(completedStat.count).toBe(1);
          expect(completedStat.total_amount).toBe(100);
          
          expect(pendingStat).toBeDefined();
          expect(pendingStat.count).toBe(1);
          expect(pendingStat.total_amount).toBe(50);
        });
    });

    it('should return payment stats for specific user', () => {
      return request(app.getHttpServer())
        .get('/payments/stats?user_id=123e4567-e89b-12d3-a456-426614174002')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          // Should only return stats for the specified user
        });
    });
  });

  describe('/payments/:id (GET)', () => {
    let testPayment: any;

    beforeEach(async () => {
      testPayment = await Payment.create({
        order_id: '123e4567-e89b-12d3-a456-426614174001',
        user_id: '123e4567-e89b-12d3-a456-426614174002',
        amount: 100.50,
        payment_method: PaymentMethod.CREDIT_CARD,
        status: PaymentStatus.COMPLETED,
        transaction_id: 'txn_123456',
        metadata: { gateway: 'stripe' },
        notes: 'Test payment',
        created_at: new Date(),
        updated_at: new Date(),
      } as any);
    });

    it('should return payment by ID', () => {
      return request(app.getHttpServer())
        .get(`/payments/${testPayment.id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(testPayment.id);
          expect(res.body.order_id).toBe(testPayment.order_id);
          expect(res.body.amount).toBe(testPayment.amount);
        });
    });

    it('should return 404 for non-existent payment', () => {
      const nonExistentId = '123e4567-e89b-12d3-a456-426614174999';
      
      return request(app.getHttpServer())
        .get(`/payments/${nonExistentId}`)
        .expect(404);
    });

    it('should return 400 for invalid UUID format', () => {
      return request(app.getHttpServer())
        .get('/payments/invalid-uuid')
        .expect(400);
    });
  });

  describe('/payments/order/:orderId (GET)', () => {
    let testPayments: any[];

    beforeEach(async () => {
      const orderId = '123e4567-e89b-12d3-a456-426614174001';
      
      testPayments = await Payment.bulkCreate([
        {
          order_id: orderId,
          user_id: '123e4567-e89b-12d3-a456-426614174002',
          amount: 100.50,
          payment_method: PaymentMethod.CREDIT_CARD,
          status: PaymentStatus.COMPLETED,
          transaction_id: 'txn_123456',
          created_at: new Date(),
          updated_at: new Date(),
        } as any,
        {
          order_id: orderId,
          user_id: '123e4567-e89b-12d3-a456-426614174002',
          amount: 50,
          payment_method: PaymentMethod.PAYPAL,
          status: PaymentStatus.PENDING,
          transaction_id: 'txn_789012',
          created_at: new Date(),
          updated_at: new Date(),
        } as any,
      ]);
    });

    it('should return payments by order ID', () => {
      const orderId = '123e4567-e89b-12d3-a456-426614174001';
      
      return request(app.getHttpServer())
        .get(`/payments/order/${orderId}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBe(2);
          expect(res.body[0].order_id).toBe(orderId);
          expect(res.body[1].order_id).toBe(orderId);
        });
    });

    it('should return empty array for order with no payments', () => {
      const nonExistentOrderId = '123e4567-e89b-12d3-a456-426614174999';
      
      return request(app.getHttpServer())
        .get(`/payments/order/${nonExistentOrderId}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBe(0);
        });
    });
  });

  describe('/payments/:id (PATCH)', () => {
    let testPayment: any;

    beforeEach(async () => {
      testPayment = await Payment.create({
        order_id: '123e4567-e89b-12d3-a456-426614174001',
        user_id: '123e4567-e89b-12d3-a456-426614174002',
        amount: 100.50,
        payment_method: PaymentMethod.CREDIT_CARD,
        status: PaymentStatus.PENDING,
        transaction_id: 'txn_123456',
        created_at: new Date(),
        updated_at: new Date(),
      } as any);
    });

    it('should update payment successfully', () => {
      const updateData = {
        status: PaymentStatus.COMPLETED,
        notes: 'Payment completed successfully',
      };

      return request(app.getHttpServer())
        .patch(`/payments/${testPayment.id}`)
        .send(updateData)
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe(PaymentStatus.COMPLETED);
          expect(res.body.notes).toBe(updateData.notes);
          expect(res.body.paid_at).toBeDefined();
        });
    });

    it('should return 404 for non-existent payment', () => {
      const nonExistentId = '123e4567-e89b-12d3-a456-426614174999';
      
      return request(app.getHttpServer())
        .patch(`/payments/${nonExistentId}`)
        .send({ status: PaymentStatus.COMPLETED })
        .expect(404);
    });

    it('should return 400 for invalid status', () => {
      return request(app.getHttpServer())
        .patch(`/payments/${testPayment.id}`)
        .send({ status: 'invalid_status' })
        .expect(400);
    });
  });

  describe('/payments/:id (DELETE)', () => {
    let testPayment: any;

    beforeEach(async () => {
      testPayment = await Payment.create({
        order_id: '123e4567-e89b-12d3-a456-426614174001',
        user_id: '123e4567-e89b-12d3-a456-426614174002',
        amount: 100.50,
        payment_method: PaymentMethod.CREDIT_CARD,
        status: PaymentStatus.PENDING,
        transaction_id: 'txn_123456',
        created_at: new Date(),
        updated_at: new Date(),
      } as any);
    });

    it('should delete pending payment successfully', () => {
      return request(app.getHttpServer())
        .delete(`/payments/${testPayment.id}`)
        .expect(204);
    });

    it('should return 404 for non-existent payment', () => {
      const nonExistentId = '123e4567-e89b-12d3-a456-426614174999';
      
      return request(app.getHttpServer())
        .delete(`/payments/${nonExistentId}`)
        .expect(404);
    });

    it('should return 400 when trying to delete completed payment', async () => {
      const completedPayment = await Payment.create({
        order_id: '123e4567-e89b-12d3-a456-426614174006',
        user_id: '123e4567-e89b-12d3-a456-426614174002',
        amount: 100.50,
        payment_method: PaymentMethod.CREDIT_CARD,
        status: PaymentStatus.COMPLETED,
        transaction_id: 'txn_completed',
        created_at: new Date(),
        updated_at: new Date(),
      } as any);

      return request(app.getHttpServer())
        .delete(`/payments/${completedPayment.id}`)
        .expect(400);
    });
  });

  describe('/payments/:id/refund (POST)', () => {
    let testPayment: any;

    beforeEach(async () => {
      testPayment = await Payment.create({
        order_id: '123e4567-e89b-12d3-a456-426614174001',
        user_id: '123e4567-e89b-12d3-a456-426614174002',
        amount: 100.50,
        payment_method: PaymentMethod.CREDIT_CARD,
        status: PaymentStatus.COMPLETED,
        transaction_id: 'txn_123456',
        metadata: { gateway: 'stripe' },
        notes: 'Original payment',
        created_at: new Date(),
        updated_at: new Date(),
      } as any);
    });

    it('should refund completed payment successfully', () => {
      return request(app.getHttpServer())
        .post(`/payments/${testPayment.id}/refund`)
        .send({ reason: 'Customer requested refund' })
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe(PaymentStatus.REFUNDED);
          expect(res.body.notes).toContain('Reembolsado: Customer requested refund');
        });
    });

    it('should refund completed payment without reason', () => {
      return request(app.getHttpServer())
        .post(`/payments/${testPayment.id}/refund`)
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe(PaymentStatus.REFUNDED);
        });
    });

    it('should return 404 for non-existent payment', () => {
      const nonExistentId = '123e4567-e89b-12d3-a456-426614174999';
      
      return request(app.getHttpServer())
        .post(`/payments/${nonExistentId}/refund`)
        .send({ reason: 'Test refund' })
        .expect(404);
    });

    it('should return 400 when trying to refund pending payment', async () => {
      const pendingPayment = await Payment.create({
        order_id: '123e4567-e89b-12d3-a456-426614174007',
        user_id: '123e4567-e89b-12d3-a456-426614174002',
        amount: 100.50,
        payment_method: PaymentMethod.CREDIT_CARD,
        status: PaymentStatus.PENDING,
        transaction_id: 'txn_pending',
        created_at: new Date(),
        updated_at: new Date(),
      } as any);

      return request(app.getHttpServer())
        .post(`/payments/${pendingPayment.id}/refund`)
        .send({ reason: 'Test refund' })
        .expect(400);
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete payment lifecycle', async () => {
      // Create payment
      const createPaymentDto = {
        order_id: '123e4567-e89b-12d3-a456-426614174008',
        user_id: '123e4567-e89b-12d3-a456-426614174002',
        amount: 100.50,
        payment_method: PaymentMethod.CREDIT_CARD,
        transaction_id: 'txn_lifecycle_123',
        metadata: { gateway: 'stripe' },
        notes: 'Lifecycle test payment',
      };

      const createResponse = await request(app.getHttpServer())
        .post('/payments')
        .send(createPaymentDto)
        .expect(201);

      const paymentId = createResponse.body.id;

      // Get payment
      await request(app.getHttpServer())
        .get(`/payments/${paymentId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe(PaymentStatus.PENDING);
        });

      // Update payment to completed
      await request(app.getHttpServer())
        .patch(`/payments/${paymentId}`)
        .send({ status: PaymentStatus.COMPLETED })
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe(PaymentStatus.COMPLETED);
          expect(res.body.paid_at).toBeDefined();
        });

      // Get payments by order
      await request(app.getHttpServer())
        .get(`/payments/order/${createPaymentDto.order_id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveLength(1);
          expect(res.body[0].status).toBe(PaymentStatus.COMPLETED);
        });

      // Refund payment
      await request(app.getHttpServer())
        .post(`/payments/${paymentId}/refund`)
        .send({ reason: 'Integration test refund' })
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe(PaymentStatus.REFUNDED);
        });

      // Verify payment is refunded
      await request(app.getHttpServer())
        .get(`/payments/${paymentId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe(PaymentStatus.REFUNDED);
        });
    });
  });
});
