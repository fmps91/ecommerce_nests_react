import { validate } from 'class-validator';
import { CreateOrderDetailDto, OrderItemDto } from '../create-order-detail.dto';

describe('CreateOrderDetailDto', () => {
  const mockOrderItem = {
    productId: '123e4567-e89b-12d3-a456-426614174000',
    quantity: 2,
    unitPrice: 9.99,
    productName: 'Test Product',
  };

  describe('OrderItemDto', () => {
    it('should validate a valid order item', async () => {
      const orderItem = new OrderItemDto();
      orderItem.productId = '123e4567-e89b-12d3-a456-426614174000';
      orderItem.quantity = 2;
      orderItem.unitPrice = 9.99;
      orderItem.productName = 'Test Product';

      const errors = await validate(orderItem);
      expect(errors).toHaveLength(0);
    });

    it('should validate order item with only required fields', async () => {
      const orderItem = new OrderItemDto();
      orderItem.productId = '123e4567-e89b-12d3-a456-426614174000';
      orderItem.quantity = 1;

      const errors = await validate(orderItem);
      expect(errors).toHaveLength(0);
    });

    it('should reject invalid productId', async () => {
      const invalidIds = [
        'invalid-uuid',
        '123-456-789',
        'not-a-uuid',
        '',
        '123e4567-e89b-12d3-a456-42661417400', // Too short
        '123e4567-e89b-12d3-a456-4266141740000', // Too long
        'ggge4567-e89b-12d3-a456-426614174000', // Invalid characters
      ];

      for (const productId of invalidIds) {
        const orderItem = new OrderItemDto();
        orderItem.productId = productId;
        orderItem.quantity = 1;

        const errors = await validate(orderItem);
        expect(errors).toHaveLength(1);
        expect(errors[0].property).toBe('productId');
        expect(errors[0].constraints).toHaveProperty('isUuid');
      }
    });

    it('should reject quantity less than 1', async () => {
      const invalidQuantities = [0, -1, -10, -100];

      for (const quantity of invalidQuantities) {
        const orderItem = new OrderItemDto();
        orderItem.productId = '123e4567-e89b-12d3-a456-426614174000';
        orderItem.quantity = quantity;

        const errors = await validate(orderItem);
        expect(errors).toHaveLength(1);
        expect(errors[0].property).toBe('quantity');
        expect(errors[0].constraints).toHaveProperty('min');
      }
    });

    it('should reject negative unitPrice', async () => {
      const negativePrices = [-0.01, -1, -10.99, -100];

      for (const unitPrice of negativePrices) {
        const orderItem = new OrderItemDto();
        orderItem.productId = '123e4567-e89b-12d3-a456-426614174000';
        orderItem.quantity = 1;
        orderItem.unitPrice = unitPrice;

        const errors = await validate(orderItem);
        expect(errors).toHaveLength(1);
        expect(errors[0].property).toBe('unitPrice');
        expect(errors[0].constraints).toHaveProperty('min');
      }
    });

    it('should accept zero unitPrice', async () => {
      const orderItem = new OrderItemDto();
      orderItem.productId = '123e4567-e89b-12d3-a456-426614174000';
      orderItem.quantity = 1;
      orderItem.unitPrice = 0;

      const errors = await validate(orderItem);
      expect(errors).toHaveLength(0);
    });

    it('should accept very high quantities', async () => {
      const highQuantities = [100, 1000, 999999];

      for (const quantity of highQuantities) {
        const orderItem = new OrderItemDto();
        orderItem.productId = '123e4567-e89b-12d3-a456-426614174000';
        orderItem.quantity = quantity;

        const errors = await validate(orderItem);
        expect(errors).toHaveLength(0);
      }
    });

    it('should accept very high unitPrice', async () => {
      const highPrices = [100, 1000, 999999.99];

      for (const unitPrice of highPrices) {
        const orderItem = new OrderItemDto();
        orderItem.productId = '123e4567-e89b-12d3-a456-426614174000';
        orderItem.quantity = 1;
        orderItem.unitPrice = unitPrice;

        const errors = await validate(orderItem);
        expect(errors).toHaveLength(0);
      }
    });

    it('should handle decimal quantities', async () => {
      const decimalQuantities = [1.5, 2.5, 10.99];

      for (const quantity of decimalQuantities) {
        const orderItem = new OrderItemDto();
        orderItem.productId = '123e4567-e89b-12d3-a456-426614174000';
        orderItem.quantity = quantity;

        const errors = await validate(orderItem);
        expect(errors).toHaveLength(0);
      }
    });

    it('should handle decimal unitPrice', async () => {
      const decimalPrices = [9.99, 19.50, 0.01, 999999.99];

      for (const unitPrice of decimalPrices) {
        const orderItem = new OrderItemDto();
        orderItem.productId = '123e4567-e89b-12d3-a456-426614174000';
        orderItem.quantity = 1;
        orderItem.unitPrice = unitPrice;

        const errors = await validate(orderItem);
        expect(errors).toHaveLength(0);
      }
    });

    it('should handle long productName', async () => {
      const orderItem = new OrderItemDto();
      orderItem.productId = '123e4567-e89b-12d3-a456-426614174000';
      orderItem.quantity = 1;
      orderItem.productName = 'a'.repeat(1000);

      const errors = await validate(orderItem);
      expect(errors).toHaveLength(0);
    });

    it('should handle productName with special characters', async () => {
      const specialNames = [
        'Product with ñ and áccents',
        'Product with émojis 🎉',
        'Café & Té Special',
        'Product (Special) Edition',
        'Product/Service v2.0',
        'Product: Deluxe',
        'Product; Premium',
        'Product" Deluxe"',
        "Product' Special'",
        'Product@Home',
        'Product#1',
        'Product$ Deluxe',
        'Product% Premium',
        'Product& Special',
        'Product* Deluxe',
        'Product+ Premium',
        'Product= Special',
        'Product- Deluxe',
        'Product_ Premium',
      ];

      for (const productName of specialNames) {
        const orderItem = new OrderItemDto();
        orderItem.productId = '123e4567-e89b-12d3-a456-426614174000';
        orderItem.quantity = 1;
        orderItem.productName = productName;

        const errors = await validate(orderItem);
        expect(errors).toHaveLength(0);
      }
    });

    it('should reject non-string productName', async () => {
      const invalidNames = [123, true, false, {}, [], Symbol('test')];

      for (const productName of invalidNames) {
        const orderItem = new OrderItemDto();
        orderItem.productId = '123e4567-e89b-12d3-a456-426614174000';
        orderItem.quantity = 1;
        orderItem.productName = productName as any;

        const errors = await validate(orderItem);
        expect(errors).toHaveLength(1);
        expect(errors[0].property).toBe('productName');
        expect(errors[0].constraints).toHaveProperty('isString');
      }
    });

    it('should handle empty productName', async () => {
      const orderItem = new OrderItemDto();
      orderItem.productId = '123e4567-e89b-12d3-a456-426614174000';
      orderItem.quantity = 1;
      orderItem.productName = '';

      const errors = await validate(orderItem);
      expect(errors).toHaveLength(0);
    });

    it('should reject missing required fields', async () => {
      const orderItem = new OrderItemDto();

      const errors = await validate(orderItem);
      expect(errors).toHaveLength(2); // productId and quantity
      expect(errors.map(e => e.property)).toContain('productId');
      expect(errors.map(e => e.property)).toContain('quantity');
    });

    it('should handle multiple validation errors', async () => {
      const orderItem = new OrderItemDto();
      orderItem.productId = 'invalid-uuid';
      orderItem.quantity = -1;
      orderItem.unitPrice = -10;
      orderItem.productName = 123 as any;

      const errors = await validate(orderItem);
      expect(errors).toHaveLength(4);
      
      const properties = errors.map(e => e.property);
      expect(properties).toContain('productId');
      expect(properties).toContain('quantity');
      expect(properties).toContain('unitPrice');
      expect(properties).toContain('productName');
    });
  });

  describe('CreateOrderDetailDto', () => {
    const mockOrderDetail = {
      items: [
        mockOrderItem,
        {
          ...mockOrderItem,
          productId: '123e4567-e89b-12d3-a456-426614174001',
          productName: 'Another Product',
        },
      ],
    };

    it('should validate a valid order detail', async () => {
      const orderDetail = new CreateOrderDetailDto();
      orderDetail.items = [
        {
          productId: '123e4567-e89b-12d3-a456-426614174000',
          quantity: 2,
          unitPrice: 9.99,
          productName: 'Test Product',
        },
        {
          productId: '123e4567-e89b-12d3-a456-426614174001',
          quantity: 1,
          unitPrice: 19.99,
          productName: 'Another Product',
        },
      ];

      const errors = await validate(orderDetail);
      expect(errors).toHaveLength(0);
    });

    it('should validate order detail with minimal items', async () => {
      const orderDetail = new CreateOrderDetailDto();
      orderDetail.items = [
        {
          productId: '123e4567-e89b-12d3-a456-426614174000',
          quantity: 1,
        },
      ];

      const errors = await validate(orderDetail);
      expect(errors).toHaveLength(0);
    });

    it('should validate order detail with single item', async () => {
      const orderDetail = new CreateOrderDetailDto();
      orderDetail.items = [mockOrderItem];

      const errors = await validate(orderDetail);
      expect(errors).toHaveLength(0);
    });

    it('should validate order detail with many items', async () => {
      const orderDetail = new CreateOrderDetailDto();
      orderDetail.items = Array.from({ length: 100 }, (_, i) => ({
        productId: `123e4567-e89b-12d3-a456-42661417${i.toString().padStart(3, '0')}`,
        quantity: i + 1,
        unitPrice: (i + 1) * 10,
        productName: `Product ${i + 1}`,
      }));

      const errors = await validate(orderDetail);
      expect(errors).toHaveLength(0);
    });

    it('should reject empty items array', async () => {
      const orderDetail = new CreateOrderDetailDto();
      orderDetail.items = [];

      const errors = await validate(orderDetail);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('items');
      expect(errors[0].constraints).toHaveProperty('isArray');
    });

    it('should reject non-array items', async () => {
      const invalidItems = [
        'not-an-array',
        123,
        true,
        false,
        {},
        Symbol('test'),
      ];

      for (const items of invalidItems) {
        const orderDetail = new CreateOrderDetailDto();
        orderDetail.items = items as any;

        const errors = await validate(orderDetail);
        expect(errors).toHaveLength(1);
        expect(errors[0].property).toBe('items');
        expect(errors[0].constraints).toHaveProperty('isArray');
      }
    });

    it('should reject items array with invalid items', async () => {
      const orderDetail = new CreateOrderDetailDto();
      orderDetail.items = [
        {
          productId: 'invalid-uuid',
          quantity: -1,
          unitPrice: -10,
          productName: 123 as any,
        },
        {
          productId: '123e4567-e89b-12d3-a456-426614174000',
          quantity: 1,
        },
      ];

      const errors = await validate(orderDetail);
      expect(errors).toHaveLength(4); // 4 errors from first invalid item
      
      const properties = errors.map(e => e.property);
      expect(properties.filter(p => p === 'productId')).toHaveLength(1);
      expect(properties.filter(p => p === 'quantity')).toHaveLength(1);
      expect(properties.filter(p => p === 'unitPrice')).toHaveLength(1);
      expect(properties.filter(p => p === 'productName')).toHaveLength(1);
    });

    it('should reject missing items field', async () => {
      const orderDetail = new CreateOrderDetailDto();

      const errors = await validate(orderDetail);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('items');
      expect(errors[0].constraints).toHaveProperty('isArray');
    });

    it('should handle items with null values', async () => {
      const orderDetail = new CreateOrderDetailDto();
      orderDetail.items = null as any;

      const errors = await validate(orderDetail);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('items');
      expect(errors[0].constraints).toHaveProperty('isArray');
    });

    it('should handle items with undefined values', async () => {
      const orderDetail = new CreateOrderDetailDto();
      orderDetail.items = undefined as any;

      const errors = await validate(orderDetail);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('items');
      expect(errors[0].constraints).toHaveProperty('isArray');
    });

    it('should handle mixed valid and invalid items', async () => {
      const orderDetail = new CreateOrderDetailDto();
      orderDetail.items = [
        {
          productId: '123e4567-e89b-12d3-a456-426614174000',
          quantity: 2,
          unitPrice: 9.99,
          productName: 'Valid Product',
        },
        {
          productId: 'invalid-uuid',
          quantity: -1,
        },
        {
          productId: '123e4567-e89b-12d3-a456-426614174002',
          quantity: 1,
          unitPrice: 19.99,
        },
      ];

      const errors = await validate(orderDetail);
      expect(errors).toHaveLength(2); // 2 errors from second invalid item
      
      const properties = errors.map(e => e.property);
      expect(properties.filter(p => p === 'productId')).toHaveLength(1);
      expect(properties.filter(p => p === 'quantity')).toHaveLength(1);
    });

    it('should handle items with duplicate productIds', async () => {
      const orderDetail = new CreateOrderDetailDto();
      orderDetail.items = [
        {
          productId: '123e4567-e89b-12d3-a456-426614174000',
          quantity: 1,
          unitPrice: 10,
        },
        {
          productId: '123e4567-e89b-12d3-a456-426614174000', // Same ID
          quantity: 2,
          unitPrice: 10,
        },
      ];

      const errors = await validate(orderDetail);
      expect(errors).toHaveLength(0); // Validation doesn't check for duplicates
    });

    it('should handle items with very large numbers', async () => {
      const orderDetail = new CreateOrderDetailDto();
      orderDetail.items = [
        {
          productId: '123e4567-e89b-12d3-a456-426614174000',
          quantity: Number.MAX_SAFE_INTEGER,
          unitPrice: Number.MAX_SAFE_INTEGER,
          productName: 'Expensive Product',
        },
      ];

      const errors = await validate(orderDetail);
      expect(errors).toHaveLength(0);
    });

    it('should handle items with decimal precision', async () => {
      const orderDetail = new CreateOrderDetailDto();
      orderDetail.items = [
        {
          productId: '123e4567-e89b-12d3-a456-426614174000',
          quantity: 1.999,
          unitPrice: 9.999999999,
          productName: 'Precise Product',
        },
      ];

      const errors = await validate(orderDetail);
      expect(errors).toHaveLength(0);
    });
  });

  describe('real-world scenarios', () => {
    it('should handle typical e-commerce order items', async () => {
      const orderDetail = new CreateOrderDetailDto();
      orderDetail.items = [
        {
          productId: '123e4567-e89b-12d3-a456-426614174000',
          quantity: 2,
          unitPrice: 29.99,
          productName: 'iPhone 15 Case',
        },
        {
          productId: '123e4567-e89b-12d3-a456-426614174001',
          quantity: 1,
          unitPrice: 19.99,
          productName: 'Screen Protector',
        },
        {
          productId: '123e4567-e89b-12d3-a456-426614174002',
          quantity: 3,
          unitPrice: 9.99,
          productName: 'Charging Cable',
        },
      ];

      const errors = await validate(orderDetail);
      expect(errors).toHaveLength(0);
    });

    it('should handle international product names', async () => {
      const orderDetail = new CreateOrderDetailDto();
      orderDetail.items = [
        {
          productId: '123e4567-e89b-12d3-a456-426614174000',
          quantity: 1,
          unitPrice: 24.99,
          productName: 'Café Especial Colombiano',
        },
        {
          productId: '123e4567-e89b-12d3-a456-426614174001',
          quantity: 2,
          unitPrice: 15.99,
          productName: 'Té Verde Japonés',
        },
      ];

      const errors = await validate(orderDetail);
      expect(errors).toHaveLength(0);
    });

    it('should handle bulk order with many items', async () => {
      const orderDetail = new CreateOrderDetailDto();
      orderDetail.items = Array.from({ length: 50 }, (_, i) => ({
        productId: `123e4567-e89b-12d3-a456-42661417${i.toString().padStart(3, '0')}`,
        quantity: Math.floor(Math.random() * 10) + 1,
        unitPrice: (Math.random() * 100 + 1),
        productName: `Bulk Item ${i + 1}`,
      }));

      const errors = await validate(orderDetail);
      expect(errors).toHaveLength(0);
    });

    it('should handle order with free items', async () => {
      const orderDetail = new CreateOrderDetailDto();
      orderDetail.items = [
        {
          productId: '123e4567-e89b-12d3-a456-426614174000',
          quantity: 1,
          unitPrice: 0,
          productName: 'Free Sample',
        },
        {
          productId: '123e4567-e89b-12d3-a456-426614174001',
          quantity: 2,
          unitPrice: 29.99,
          productName: 'Paid Product',
        },
      ];

      const errors = await validate(orderDetail);
      expect(errors).toHaveLength(0);
    });
  });
});
