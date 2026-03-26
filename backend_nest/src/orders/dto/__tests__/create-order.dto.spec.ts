import { validate } from 'class-validator';
import { CreateOrderDto } from '../create-order.dto';
import { plainToInstance } from 'class-transformer';

describe('CreateOrderDto', () => {
  const validOrderData = {
    userId: '123e4567-e89b-12d3-a456-426614174000',
    total: 100.50,
    subtotal: 100.50,
    items: [
      {
        productId: '123e4567-e89b-12d3-a456-426614174001',
        productName: 'Test Product',
        quantity: 2,
        unitPrice: 50.25,
        subtotal: 100.50,
      },
    ],
    status: 'PENDING',
    notes: 'Test order',
    shippingAddress: {
      street: '123 Test St',
      city: 'Test City',
      state: 'TS',
      zipCode: '12345',
      country: 'USA',
    },
    billingAddress: {
      street: '456 Billing St',
      city: 'Billing City',
      state: 'BS',
      zipCode: '67890',
      country: 'USA',
    },
    paymentMethod: 'credit_card',
    paidAt: new Date(),
    shippedAt: new Date(),
    deliveredAt: new Date(),
  };

  describe('validation', () => {
    it('should validate a complete order', async () => {
      const dto = plainToInstance(CreateOrderDto, validOrderData);
      const errors = await validate(dto);

      expect(errors.length).toBe(0);
    });

    it('should validate with only required fields', async () => {
      const requiredOnly = {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        total: 100.50,
        subtotal: 100.50,
        items: [
          {
            productId: 'test-product-id',
            productName: 'Test Product',
            quantity: 1,
            unitPrice: 100.50,
            subtotal: 100.50,
          },
        ],
      };

      const dto = plainToInstance(CreateOrderDto, requiredOnly);
      const errors = await validate(dto);

      expect(errors.length).toBe(0);
    });

    it('should require userId', async () => {
      const dto = plainToInstance(CreateOrderDto, { ...validOrderData, userId: '' });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('userId');
    });

    it('should validate userId UUID format', async () => {
      const dto = plainToInstance(CreateOrderDto, { ...validOrderData, userId: 'invalid-uuid' });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('userId');
    });

    it('should require total', async () => {
      const dto = plainToInstance(CreateOrderDto, { ...validOrderData, total: undefined as any });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('total');
    });

    it('should validate total is number', async () => {
      const dto = plainToInstance(CreateOrderDto, { ...validOrderData, total: 'not-a-number' as any });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('total');
    });

    it('should validate total minimum value', async () => {
      const dto = plainToInstance(CreateOrderDto, { ...validOrderData, total: -10 });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('total');
    });

    it('should require subtotal', async () => {
      const dto = plainToInstance(CreateOrderDto, { ...validOrderData, subtotal: undefined as any });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('subtotal');
    });

    it('should validate subtotal minimum value', async () => {
      const dto = plainToInstance(CreateOrderDto, { ...validOrderData, subtotal: -10 });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('subtotal');
    });

    it('should require items array', async () => {
      const dto = plainToInstance(CreateOrderDto, { ...validOrderData, items: undefined as any });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('items');
    });

    it('should validate items is array', async () => {
      const dto = plainToInstance(CreateOrderDto, { ...validOrderData, items: 'not-an-array' as any });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('items');
    });

    it('should validate items array is not empty', async () => {
      const dto = plainToInstance(CreateOrderDto, { ...validOrderData, items: [] });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('items');
    });

    it('should validate item productId', async () => {
      const invalidItems = [
        {
          productId: 'invalid-uuid',
          productName: 'Test Product',
          quantity: 1,
          unitPrice: 100.50,
          subtotal: 100.50,
        },
      ];

      const dto = plainToInstance(CreateOrderDto, { ...validOrderData, items: invalidItems });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.property === 'items')).toBe(true);
    });

    it('should validate item productName', async () => {
      const invalidItems = [
        {
          productId: 'test-product-id',
          productName: '',
          quantity: 1,
          unitPrice: 100.50,
          subtotal: 100.50,
        },
      ];

      const dto = plainToInstance(CreateOrderDto, { ...validOrderData, items: invalidItems });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.property === 'items')).toBe(true);
    });

    it('should validate item quantity', async () => {
      const invalidItems = [
        {
          productId: 'test-product-id',
          productName: 'Test Product',
          quantity: 0,
          unitPrice: 100.50,
          subtotal: 100.50,
        },
      ];

      const dto = plainToInstance(CreateOrderDto, { ...validOrderData, items: invalidItems });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.property === 'items')).toBe(true);
    });

    it('should validate item unitPrice', async () => {
      const invalidItems = [
        {
          productId: 'test-product-id',
          productName: 'Test Product',
          quantity: 1,
          unitPrice: -50,
          subtotal: 100.50,
        },
      ];

      const dto = plainToInstance(CreateOrderDto, { ...validOrderData, items: invalidItems });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.property === 'items')).toBe(true);
    });

    it('should validate item subtotal', async () => {
      const invalidItems = [
        {
          productId: 'test-product-id',
          productName: 'Test Product',
          quantity: 1,
          unitPrice: 100.50,
          subtotal: -50,
        },
      ];

      const dto = plainToInstance(CreateOrderDto, { ...validOrderData, items: invalidItems });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.property === 'items')).toBe(true);
    });

    it('should validate shippingCost when provided', async () => {
      const dto = plainToInstance(CreateOrderDto, { ...validOrderData, shippingCost: -10 });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.property === 'shippingCost')).toBe(true);
    });

    it('should validate optional fields', async () => {
      const dto = plainToInstance(CreateOrderDto, {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        total: 100.50,
        subtotal: 100.50,
        items: [
          {
            productId: 'test-product-id',
            productName: 'Test Product',
            quantity: 1,
            unitPrice: 100.50,
            subtotal: 100.50,
          },
        ],
        status: 'INVALID_STATUS',
        notes: '',
        shippingAddress: {},
        billingAddress: {},
        paymentMethod: '',
        paidAt: 'invalid-date',
        shippedAt: 'invalid-date',
        deliveredAt: 'invalid-date',
      });

      const errors = await validate(dto);

      // Optional fields should not cause validation errors for format
      expect(errors.some(e => e.property === 'status')).toBe(false);
      expect(errors.some(e => e.property === 'notes')).toBe(false);
      expect(errors.some(e => e.property === 'shippingAddress')).toBe(false);
      expect(errors.some(e => e.property === 'billingAddress')).toBe(false);
      expect(errors.some(e => e.property === 'paymentMethod')).toBe(false);
    });
  });

  describe('nested validation', () => {
    it('should validate nested address objects', async () => {
      const dto = plainToInstance(CreateOrderDto, {
        ...validOrderData,
        shippingAddress: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: '',
        },
      });

      const errors = await validate(dto);

      expect(errors.some(e => e.property === 'shippingAddress')).toBe(true);
    });

    it('should validate billing address', async () => {
      const dto = plainToInstance(CreateOrderDto, {
        ...validOrderData,
        billingAddress: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: '',
        },
      });

      const errors = await validate(dto);

      expect(errors.some(e => e.property === 'billingAddress')).toBe(true);
    });
  });

  describe('constructor', () => {
    it('should create instance with partial data', () => {
      const partialData = {
        userId: 'test-user-id',
        total: 50,
      };

      const dto = new CreateOrderDto();
      Object.assign(dto, partialData);

      expect(dto.userId).toBe('test-user-id');
      expect(dto.total).toBe(50);
    });

    it('should handle empty constructor', () => {
      const dto = new CreateOrderDto();

      expect(dto.userId).toBeUndefined();
      expect(dto.total).toBeUndefined();
      expect(dto.items).toBeUndefined();
    });
  });

  describe('edge cases', () => {
    it('should handle maximum values', async () => {
      const maxOrder = {
        ...validOrderData,
        total: 999999.99,
        subtotal: 999999.99,
        items: [
          {
            productId: 'test-product-id',
            productName: 'A'.repeat(1000),
            quantity: 999999,
            unitPrice: 999999.99,
            subtotal: 999999.99,
          },
        ],
      };

      const dto = plainToInstance(CreateOrderDto, maxOrder);
      const errors = await validate(dto);

      expect(errors.length).toBe(0);
    });

    it('should handle decimal amounts', async () => {
      const decimalOrder = {
        ...validOrderData,
        total: 99.99,
        subtotal: 99.99,
        items: [
          {
            productId: 'test-product-id',
            productName: 'Test Product',
            quantity: 1,
            unitPrice: 99.99,
            subtotal: 99.99,
          },
        ],
      };

      const dto = plainToInstance(CreateOrderDto, decimalOrder);
      const errors = await validate(dto);

      expect(errors.length).toBe(0);
    });

    it('should handle multiple items', async () => {
      const multiItemOrder = {
        ...validOrderData,
        items: [
          {
            productId: 'product-1',
            productName: 'Product 1',
            quantity: 1,
            unitPrice: 50.00,
            subtotal: 50.00,
          },
          {
            productId: 'product-2',
            productName: 'Product 2',
            quantity: 2,
            unitPrice: 25.00,
            subtotal: 50.00,
          },
          {
            productId: 'product-3',
            productName: 'Product 3',
            quantity: 3,
            unitPrice: 16.67,
            subtotal: 50.01,
          },
        ],
      };

      const dto = plainToInstance(CreateOrderDto, multiItemOrder);
      const errors = await validate(dto);

      expect(errors.length).toBe(0);
    });

    it('should handle special characters in strings', async () => {
      const specialCharOrder = {
        ...validOrderData,
        notes: 'Order with émojis 🎉 and special chars: @#$%^&*()',
        paymentMethod: 'credit_card_with-special-chars-@#$%',
      };

      const dto = plainToInstance(CreateOrderDto, specialCharOrder);
      const errors = await validate(dto);

      expect(errors.length).toBe(0);
    });
  });
});
