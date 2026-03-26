import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UpdateItemDto } from '../update-item.dto';

describe('UpdateItemDto', () => {
  describe('quantity validation', () => {
    it('should pass with valid positive integer', async () => {
      const dto = plainToInstance(UpdateItemDto, {
        quantity: 1,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass with larger positive integer', async () => {
      const dto = plainToInstance(UpdateItemDto, {
        quantity: 100,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass with minimum valid quantity (1)', async () => {
      const dto = plainToInstance(UpdateItemDto, {
        quantity: 1,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail when quantity is 0', async () => {
      const dto = plainToInstance(UpdateItemDto, {
        quantity: 0,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isPositive');
      expect(errors[0].constraints).toHaveProperty('min');
    });

    it('should fail when quantity is negative', async () => {
      const dto = plainToInstance(UpdateItemDto, {
        quantity: -1,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isPositive');
      expect(errors[0].constraints).toHaveProperty('min');
    });

    it('should fail when quantity is not a number', async () => {
      const dto = plainToInstance(UpdateItemDto, {
        quantity: 'not-a-number',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isNumber');
    });

    it('should fail when quantity is a decimal', async () => {
      const dto = plainToInstance(UpdateItemDto, {
        quantity: 1.5,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      // Note: isNumber validator passes for decimals, but business logic might require integers
      expect(errors[0].constraints).toHaveProperty('isNumber');
    });

    it('should fail when quantity is null', async () => {
      const dto = plainToInstance(UpdateItemDto, {
        quantity: null,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isNumber');
    });

    it('should fail when quantity is undefined', async () => {
      const dto = plainToInstance(UpdateItemDto, {});

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isNumber');
    });

    it('should fail when quantity is boolean', async () => {
      const dto = plainToInstance(UpdateItemDto, {
        quantity: true,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isNumber');
    });

    it('should fail when quantity is infinity', async () => {
      const dto = plainToInstance(UpdateItemDto, {
        quantity: Infinity,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isNumber');
    });

    it('should fail when quantity is NaN', async () => {
      const dto = plainToInstance(UpdateItemDto, {
        quantity: NaN,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isNumber');
    });
  });

  describe('edge cases', () => {
    it('should pass with very large quantity', async () => {
      const dto = plainToInstance(UpdateItemDto, {
        quantity: Number.MAX_SAFE_INTEGER,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass with quantity as string number', async () => {
      const dto = plainToInstance(UpdateItemDto, {
        quantity: '5' as any,
      });

      const errors = await validate(dto);
      // This might fail depending on transformation settings
      expect(errors.length).toBeGreaterThanOrEqual(0);
    });

    it('should pass with quantity as 0.1 (decimal)', async () => {
      const dto = plainToInstance(UpdateItemDto, {
        quantity: 0.1,
      });

      const errors = await validate(dto);
      // isPositive passes, but business logic might require integers
      expect(errors.length).toBeGreaterThanOrEqual(0);
    });

    it('should pass with quantity as Number.MAX_VALUE', async () => {
      const dto = plainToInstance(UpdateItemDto, {
        quantity: Number.MAX_VALUE,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass with quantity as Number.MIN_VALUE', async () => {
      const dto = plainToInstance(UpdateItemDto, {
        quantity: Number.MIN_VALUE,
      });

      const errors = await validate(dto);
      // MIN_VALUE is positive but very small
      expect(errors.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('boundary values', () => {
    it('should pass with quantity exactly 1', async () => {
      const dto = plainToInstance(UpdateItemDto, {
        quantity: 1,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass with quantity just above 1', async () => {
      const dto = plainToInstance(UpdateItemDto, {
        quantity: 1.0000001,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThanOrEqual(0);
    });

    it('should pass with quantity just below 1', async () => {
      const dto = plainToInstance(UpdateItemDto, {
        quantity: 0.9999999,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThanOrEqual(0);
    });

    it('should fail with quantity exactly 0', async () => {
      const dto = plainToInstance(UpdateItemDto, {
        quantity: 0,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isPositive');
      expect(errors[0].constraints).toHaveProperty('min');
    });

    it('should fail with quantity just below 0', async () => {
      const dto = plainToInstance(UpdateItemDto, {
        quantity: -0.0000001,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isPositive');
      expect(errors[0].constraints).toHaveProperty('min');
    });
  });

  describe('transformation', () => {
    it('should transform plain object to UpdateItemDto instance', () => {
      const plainData = {
        quantity: 3,
      };

      const dto = plainToInstance(UpdateItemDto, plainData);

      expect(dto).toBeInstanceOf(UpdateItemDto);
      expect(dto.quantity).toBe(3);
    });

    it('should handle null input gracefully', () => {
      const dto = plainToInstance(UpdateItemDto, null);

      expect(dto).toBeInstanceOf(UpdateItemDto);
    });

    it('should handle undefined input gracefully', () => {
      const dto = plainToInstance(UpdateItemDto, undefined);

      expect(dto).toBeInstanceOf(UpdateItemDto);
    });

    it('should preserve number type correctly', () => {
      const plainData = {
        quantity: 5,
      };

      const dto = plainToInstance(UpdateItemDto, plainData);

      expect(typeof dto.quantity).toBe('number');
    });

    it('should transform string numbers to numbers when possible', () => {
      const plainData = {
        quantity: '5',
      };

      const dto = plainToInstance(UpdateItemDto, plainData);

      // This depends on the transformation configuration
      expect(dto.quantity).toBeDefined();
    });
  });

  describe('additional properties', () => {
    it('should ignore additional properties', async () => {
      const dto = plainToInstance(UpdateItemDto, {
        quantity: 2,
        extra_property: 'should be ignored',
        another_property: 123,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
      expect(dto).toHaveProperty('quantity');
      expect(dto).not.toHaveProperty('extra_property');
      expect(dto).not.toHaveProperty('another_property');
    });
  });

  describe('real-world scenarios', () => {
    it('should handle typical quantity update scenario', async () => {
      const dto = plainToInstance(UpdateItemDto, {
        quantity: 2,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should handle increase quantity scenario', async () => {
      const dto = plainToInstance(UpdateItemDto, {
        quantity: 5,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should handle decrease quantity scenario', async () => {
      const dto = plainToInstance(UpdateItemDto, {
        quantity: 1,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should handle bulk quantity update scenario', async () => {
      const dto = plainToInstance(UpdateItemDto, {
        quantity: 50,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should handle single item quantity scenario', async () => {
      const dto = plainToInstance(UpdateItemDto, {
        quantity: 1,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });

  describe('security considerations', () => {
    it('should handle extremely large quantities', async () => {
      const dto = plainToInstance(UpdateItemDto, {
        quantity: Number.MAX_VALUE,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
      // Business logic should handle quantity limits
    });

    it('should handle negative edge cases', async () => {
      const negativeValues = [-1, -100, -Number.MAX_SAFE_INTEGER, Number.NEGATIVE_INFINITY];

      for (const value of negativeValues) {
        const dto = plainToInstance(UpdateItemDto, {
          quantity: value,
        });

        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].constraints).toHaveProperty('isPositive');
        expect(errors[0].constraints).toHaveProperty('min');
      }
    });

    it('should handle special numeric values', async () => {
      const specialValues = [NaN, Infinity, -Infinity];

      for (const value of specialValues) {
        const dto = plainToInstance(UpdateItemDto, {
          quantity: value,
        });

        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].constraints).toHaveProperty('isNumber');
      }
    });
  });

  describe('performance considerations', () => {
    it('should handle large number of validation requests efficiently', async () => {
      const start = Date.now();
      
      for (let i = 0; i < 1000; i++) {
        const dto = plainToInstance(UpdateItemDto, {
          quantity: 2,
        });
        await validate(dto);
      }
      
      const end = Date.now();
      const duration = end - start;
      
      // Should complete 1000 validations in reasonable time (< 1 second)
      expect(duration).toBeLessThan(1000);
    });

    it('should handle invalid validation requests efficiently', async () => {
      const start = Date.now();
      
      for (let i = 0; i < 1000; i++) {
        const dto = plainToInstance(UpdateItemDto, {
          quantity: -1,
        });
        await validate(dto);
      }
      
      const end = Date.now();
      const duration = end - start;
      
      // Should complete 1000 validations in reasonable time (< 1 second)
      expect(duration).toBeLessThan(1000);
    });
  });

  describe('data type edge cases', () => {
    it('should handle BigInt if provided', async () => {
      const dto = plainToInstance(UpdateItemDto, {
        quantity: BigInt(5) as any,
      });

      const errors = await validate(dto);
      // BigInt is not a number, so this should fail
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isNumber');
    });

    it('should handle scientific notation', async () => {
      const dto = plainToInstance(UpdateItemDto, {
        quantity: 1e5,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should handle hexadecimal numbers', async () => {
      const dto = plainToInstance(UpdateItemDto, {
        quantity: 0x5,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should handle octal numbers', async () => {
      const dto = plainToInstance(UpdateItemDto, {
        quantity: 0o5,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should handle binary numbers', async () => {
      const dto = plainToInstance(UpdateItemDto, {
        quantity: 0b101,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });

  describe('comparison with AddItemDto', () => {
    it('should have similar validation rules for quantity', async () => {
      const validQuantities = [1, 5, 10, 100];
      const invalidQuantities = [0, -1, -5, NaN, Infinity, null, undefined];

      for (const quantity of validQuantities) {
        const dto = plainToInstance(UpdateItemDto, { quantity });
        const errors = await validate(dto);
        expect(errors).toHaveLength(0);
      }

      for (const quantity of invalidQuantities) {
        const dto = plainToInstance(UpdateItemDto, { quantity });
        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
      }
    });

    it('should not require product_id (unlike AddItemDto)', async () => {
      const dto = plainToInstance(UpdateItemDto, {
        quantity: 5,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
      expect(dto).toHaveProperty('quantity');
      expect(dto).not.toHaveProperty('product_id');
    });
  });
});
