import { validate } from 'class-validator';
import { UpdateOrderDto } from '../update-order.dto';
import { plainToInstance } from 'class-transformer';

describe('UpdateOrderDto', () => {
  const validUpdateData = {
    userId: '123e4567-e89b-12d3-a456-426614174000',
    total: 150.75,
    subtotal: 150.75,
    items: [
      {
        productId: '123e4567-e89b-12d3-a456-426614174001',
        productName: 'Updated Product',
        quantity: 3,
        unitPrice: 50.25,
        subtotal: 150.75,
      },
    ],
    status: 'COMPLETED',
    notes: 'Updated order notes',
    shippingAddress: {
      street: '456 Updated St',
      city: 'Updated City',
      state: 'UC',
      zipCode: '67890',
      country: 'USA',
    },
    billingAddress: {
      street: '789 Updated St',
      city: 'Updated Billing City',
      state: 'BC',
      zipCode: '12345',
      country: 'USA',
    },
    paymentMethod: 'paypal',
    paidAt: new Date(),
    shippedAt: new Date(),
    deliveredAt: new Date(),
  };

  describe('validation', () => {
    it('should validate with all fields', async () => {
      const dto = plainToInstance(UpdateOrderDto, validUpdateData);
      const errors = await validate(dto);

      expect(errors.length).toBe(0);
    });

    it('should validate with partial data', async () => {
      const partialData = {
        status: 'COMPLETED',
        notes: 'Updated notes only',
      };

      const dto = plainToInstance(UpdateOrderDto, partialData);
      const errors = await validate(dto);

      expect(errors.length).toBe(0);
    });

    it('should validate with single field', async () => {
      const singleField = {
        status: 'PROCESSING',
      };

      const dto = plainToInstance(UpdateOrderDto, singleField);
      const errors = await validate(dto);

      expect(errors.length).toBe(0);
    });

    it('should validate empty object', async () => {
      const dto = plainToInstance(UpdateOrderDto, {});
      const errors = await validate(dto);

      expect(errors.length).toBe(0);
    });

    it('should validate userId UUID when provided', async () => {
      const dto = plainToInstance(UpdateOrderDto, { userId: 'invalid-uuid' });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.property === 'userId')).toBe(true);
    });

    it('should validate total when provided', async () => {
      const dto = plainToInstance(UpdateOrderDto, { total: -100 });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.property === 'total')).toBe(true);
    });

    it('should validate subtotal when provided', async () => {
      const dto = plainToInstance(UpdateOrderDto, { subtotal: -50 });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.property === 'subtotal')).toBe(true);
    });

    it('should validate items when provided', async () => {
      const invalidItems = [
        {
          productId: '',
          productName: 'Test Product',
          quantity: 0,
          unitPrice: -50,
          subtotal: -100,
        },
      ];

      const dto = plainToInstance(UpdateOrderDto, { items: invalidItems });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.property === 'items')).toBe(true);
    });

    it('should validate shippingCost when provided', async () => {
      const dto = plainToInstance(UpdateOrderDto, { shippingCost: -10 });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.property === 'shippingCost')).toBe(true);
    });

    it('should validate notes when provided', async () => {
      const dto = plainToInstance(UpdateOrderDto, { notes: 123 as any });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.property === 'notes')).toBe(true);
    });

    it('should validate shippingAddress when provided', async () => {
      const dto = plainToInstance(UpdateOrderDto, {
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

    it('should validate billingAddress when provided', async () => {
      const dto = plainToInstance(UpdateOrderDto, {
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

    it('should validate paymentMethod when provided', async () => {
      const dto = plainToInstance(UpdateOrderDto, { paymentMethod: 123 as any });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.property === 'paymentMethod')).toBe(true);
    });
  });

  describe('date validation', () => {
    it('should validate paidAt when provided', async () => {
      const dto = plainToInstance(UpdateOrderDto, { paidAt: 'invalid-date' });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.property === 'paidAt')).toBe(true);
    });

    it('should validate shippedAt when provided', async () => {
      const dto = plainToInstance(UpdateOrderDto, { shippedAt: 'invalid-date' });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.property === 'shippedAt')).toBe(true);
    });

    it('should validate deliveredAt when provided', async () => {
      const dto = plainToInstance(UpdateOrderDto, { deliveredAt: 'invalid-date' });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.property === 'deliveredAt')).toBe(true);
    });

    it('should accept valid dates', async () => {
      const validDates = {
        paidAt: new Date(),
        shippedAt: new Date(),
        deliveredAt: new Date(),
      };

      const dto = plainToInstance(UpdateOrderDto, validDates);
      const errors = await validate(dto);

      expect(errors.length).toBe(0);
    });

    it('should accept null dates', async () => {
      const nullDates = {
        paidAt: null,
        shippedAt: null,
        deliveredAt: null,
      };

      const dto = plainToInstance(UpdateOrderDto, nullDates);
      const errors = await validate(dto);

      expect(errors.length).toBe(0);
    });

    it('should accept undefined dates', async () => {
      const undefinedDates = {
        paidAt: undefined,
        shippedAt: undefined,
        deliveredAt: undefined,
      };

      const dto = plainToInstance(UpdateOrderDto, undefinedDates);
      const errors = await validate(dto);

      expect(errors.length).toBe(0);
    });
  });

  describe('inheritance', () => {
    it('should inherit validation rules from CreateOrderDto', async () => {
      // Test that it inherits validation rules for all fields
      const invalidDto = plainToInstance(UpdateOrderDto, {
        userId: 'invalid-uuid',
        total: -100,
        subtotal: -50,
        items: [],
        shippingCost: -10,
      });

      const errors = await validate(invalidDto);

      expect(errors.length).toBeGreaterThan(0);
      const errorProperties = errors.map(error => error.property);
      
      expect(errorProperties).toContain('userId');
      expect(errorProperties).toContain('total');
      expect(errorProperties).toContain('subtotal');
      expect(errorProperties).toContain('items');
      expect(errorProperties).toContain('shippingCost');
    });

    it('should allow all CreateOrderDto fields to be optional', async () => {
      const dto = plainToInstance(UpdateOrderDto, {});
      const errors = await validate(dto);

      expect(errors.length).toBe(0);
    });
  });

  describe('constructor', () => {
    it('should create instance with partial data', () => {
      const partialData = {
        status: 'COMPLETED',
        notes: 'Updated',
      };

      const dto = new UpdateOrderDto();
      Object.assign(dto, partialData);

      expect(dto.status).toBe('COMPLETED');
      expect(dto.notes).toBe('Updated');
    });

    it('should initialize with undefined values', () => {
      const dto = new UpdateOrderDto();

      expect(dto.userId).toBeUndefined();
      expect(dto.total).toBeUndefined();
      expect(dto.status).toBeUndefined();
      expect(dto.notes).toBeUndefined();
    });
  });

  describe('use cases', () => {
    it('should handle status-only update', async () => {
      const statusUpdate = {
        status: 'COMPLETED',
      };

      const dto = plainToInstance(UpdateOrderDto, statusUpdate);
      const errors = await validate(dto);

      expect(errors.length).toBe(0);
      expect(dto.status).toBe('COMPLETED');
    });

    it('should handle notes-only update', async () => {
      const notesUpdate = {
        notes: 'Updated notes',
      };

      const dto = plainToInstance(UpdateOrderDto, notesUpdate);
      const errors = await validate(dto);

      expect(errors.length).toBe(0);
      expect(dto.notes).toBe('Updated notes');
    });

    it('should handle date updates', async () => {
      const dateUpdate = {
        paidAt: new Date(),
        shippedAt: new Date(),
        deliveredAt: new Date(),
      };

      const dto = plainToInstance(UpdateOrderDto, dateUpdate);
      const errors = await validate(dto);

      expect(errors.length).toBe(0);
      expect(dto.paidAt).toBeInstanceOf(Date);
      expect(dto.shippedAt).toBeInstanceOf(Date);
      expect(dto.deliveredAt).toBeInstanceOf(Date);
    });

    it('should handle address updates', async () => {
      const addressUpdate = {
        shippingAddress: {
          street: '123 New St',
          city: 'New City',
          state: 'NS',
          zipCode: '12345',
          country: 'USA',
        },
        billingAddress: {
          street: '456 New St',
          city: 'New Billing City',
          state: 'NB',
          zipCode: '67890',
          country: 'USA',
        },
      };

      const dto = plainToInstance(UpdateOrderDto, addressUpdate);
      const errors = await validate(dto);

      expect(errors.length).toBe(0);
      expect(dto.shippingAddress).toEqual(addressUpdate.shippingAddress);
      expect(dto.billingAddress).toEqual(addressUpdate.billingAddress);
    });

    it('should handle multiple field updates', async () => {
      const multipleUpdate = {
        status: 'PROCESSING',
        notes: 'Multiple fields updated',
        paidAt: new Date(),
        shippingCost: 15.50,
      };

      const dto = plainToInstance(UpdateOrderDto, multipleUpdate);
      const errors = await validate(dto);

      expect(errors.length).toBe(0);
      expect(dto.status).toBe('PROCESSING');
      expect(dto.notes).toBe('Multiple fields updated');
      expect(dto.paidAt).toBeInstanceOf(Date);
      expect(dto.shippingCost).toBe(15.50);
    });
  });

  describe('edge cases', () => {
    it('should handle null values', async () => {
      const nullUpdate = {
        userId: null as any,
        total: null as any,
        status: null as any,
        notes: null as any,
        shippingAddress: null as any,
        billingAddress: null as any,
        paidAt: null,
        shippedAt: null,
        deliveredAt: null,
      };

      const dto = plainToInstance(UpdateOrderDto, nullUpdate);
      const errors = await validate(dto);

      // Some fields should fail validation as null
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should handle empty strings', async () => {
      const emptyStringUpdate = {
        userId: '',
        status: '',
        notes: '',
        paymentMethod: '',
      };

      const dto = plainToInstance(UpdateOrderDto, emptyStringUpdate);
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.property === 'userId')).toBe(true);
    });

    it('should handle whitespace-only strings', async () => {
      const whitespaceUpdate = {
        userId: '   ',
        status: '   ',
        notes: '   ',
        paymentMethod: '   ',
      };

      const dto = plainToInstance(UpdateOrderDto, whitespaceUpdate);
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.property === 'userId')).toBe(true);
    });

    it('should handle very long strings', async () => {
      const longString = 'a'.repeat(1000);
      const longUpdate = {
        notes: longString,
        paymentMethod: longString,
      };

      const dto = plainToInstance(UpdateOrderDto, longUpdate);
      const errors = await validate(dto);

      // Long strings should be valid for optional fields
      expect(errors.some(e => e.property === 'notes')).toBe(false);
      expect(errors.some(e => e.property === 'paymentMethod')).toBe(false);
    });
  });
});
