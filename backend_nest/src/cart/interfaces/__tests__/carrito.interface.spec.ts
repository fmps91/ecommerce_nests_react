import { CarritoResponse } from '../carrito.interface';

describe('CarritoResponse Interface', () => {
  describe('interface structure', () => {
    it('should have required properties', () => {
      const response: CarritoResponse = {
        success: true,
        message: 'Operation completed successfully',
      };

      expect(response).toHaveProperty('success');
      expect(response).toHaveProperty('message');
      expect(response.success).toBe(true);
      expect(response.message).toBe('Operation completed successfully');
    });

    it('should have optional data property', () => {
      const responseWithData: CarritoResponse = {
        success: true,
        message: 'Cart retrieved successfully',
        data: {
          id: 'cart-123',
          items: [],
          total: 100.50,
        },
      };

      expect(responseWithData).toHaveProperty('data');
      expect(responseWithData.data).toEqual({
        id: 'cart-123',
        items: [],
        total: 100.50,
      });
    });

    it('should have optional error property', () => {
      const responseWithError: CarritoResponse = {
        success: false,
        message: 'Operation failed',
        error: 'Cart not found',
      };

      expect(responseWithError).toHaveProperty('error');
      expect(responseWithError.error).toBe('Cart not found');
    });

    it('should have both optional properties', () => {
      const responseWithBoth: CarritoResponse = {
        success: true,
        message: 'Operation completed with warnings',
        data: { id: 'cart-123' },
        error: 'Minor warning occurred',
      };

      expect(responseWithBoth).toHaveProperty('data');
      expect(responseWithBoth).toHaveProperty('error');
      expect(responseWithBoth.data).toEqual({ id: 'cart-123' });
      expect(responseWithBoth.error).toBe('Minor warning occurred');
    });
  });

  describe('success property', () => {
    it('should handle true value', () => {
      const successResponse: CarritoResponse = {
        success: true,
        message: 'Success',
      };

      expect(successResponse.success).toBe(true);
      expect(typeof successResponse.success).toBe('boolean');
    });

    it('should handle false value', () => {
      const failureResponse: CarritoResponse = {
        success: false,
        message: 'Failure',
      };

      expect(failureResponse.success).toBe(false);
      expect(typeof failureResponse.success).toBe('boolean');
    });
  });

  describe('message property', () => {
    it('should handle success messages', () => {
      const response: CarritoResponse = {
        success: true,
        message: 'Cart created successfully',
      };

      expect(response.message).toBe('Cart created successfully');
      expect(typeof response.message).toBe('string');
    });

    it('should handle error messages', () => {
      const response: CarritoResponse = {
        success: false,
        message: 'Failed to create cart',
      };

      expect(response.message).toBe('Failed to create cart');
      expect(typeof response.message).toBe('string');
    });

    it('should handle empty message', () => {
      const response: CarritoResponse = {
        success: true,
        message: '',
      };

      expect(response.message).toBe('');
      expect(typeof response.message).toBe('string');
    });

    it('should handle long messages', () => {
      const longMessage = 'A'.repeat(1000);
      const response: CarritoResponse = {
        success: true,
        message: longMessage,
      };

      expect(response.message).toBe(longMessage);
      expect(typeof response.message).toBe('string');
    });

    it('should handle special characters in message', () => {
      const specialMessage = 'Cart operation émojis 🎉 and special chars: @#$%^&*()';
      const response: CarritoResponse = {
        success: true,
        message: specialMessage,
      };

      expect(response.message).toBe(specialMessage);
      expect(typeof response.message).toBe('string');
    });
  });

  describe('data property', () => {
    it('should handle undefined data', () => {
      const response: CarritoResponse = {
        success: true,
        message: 'Success',
      };

      expect(response.data).toBeUndefined();
    });

    it('should handle null data', () => {
      const response: CarritoResponse = {
        success: true,
        message: 'Success',
        data: null,
      };

      expect(response.data).toBeNull();
    });

    it('should handle object data', () => {
      const cartData = {
        id: 'cart-123',
        user_id: 'user-456',
        items: [
          {
            id: 'item-1',
            product_id: 'product-1',
            quantity: 2,
            price: 25.50,
          },
        ],
        total: 51.00,
        status: 'active',
      };

      const response: CarritoResponse = {
        success: true,
        message: 'Cart retrieved',
        data: cartData,
      };

      expect(response.data).toEqual(cartData);
      expect(response.data!.id).toBe('cart-123');
      expect(response.data!.items).toHaveLength(1);
      expect(response.data!.total).toBe(51.00);
    });

    it('should handle array data', () => {
      const cartsData = [
        { id: 'cart-1', total: 100.00 },
        { id: 'cart-2', total: 200.00 },
      ];

      const response: CarritoResponse = {
        success: true,
        message: 'Carts retrieved',
        data: cartsData,
      };

      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data).toHaveLength(2);
      expect(response.data![0].id).toBe('cart-1');
    });

    it('should handle string data', () => {
      const response: CarritoResponse = {
        success: true,
        message: 'Operation completed',
        data: 'Cart ID: cart-123',
      };

      expect(response.data).toBe('Cart ID: cart-123');
      expect(typeof response.data).toBe('string');
    });

    it('should handle number data', () => {
      const response: CarritoResponse = {
        success: true,
        message: 'Cart total calculated',
        data: 150.75,
      };

      expect(response.data).toBe(150.75);
      expect(typeof response.data).toBe('number');
    });

    it('should handle boolean data', () => {
      const response: CarritoResponse = {
        success: true,
        message: 'Cart availability checked',
        data: true,
      };

      expect(response.data).toBe(true);
      expect(typeof response.data).toBe('boolean');
    });
  });

  describe('error property', () => {
    it('should handle undefined error', () => {
      const response: CarritoResponse = {
        success: true,
        message: 'Success',
      };

      expect(response.error).toBeUndefined();
    });

    it('should handle null error', () => {
      const response: CarritoResponse = {
        success: true,
        message: 'Success',
        error: undefined,
      };

      expect(response.error).toBeUndefined();
    });

    it('should handle error string', () => {
      const response: CarritoResponse = {
        success: false,
        message: 'Operation failed',
        error: 'Cart not found in database',
      };

      expect(response.error).toBe('Cart not found in database');
      expect(typeof response.error).toBe('string');
    });

    it('should handle empty error string', () => {
      const response: CarritoResponse = {
        success: false,
        message: 'Operation failed',
        error: '',
      };

      expect(response.error).toBe('');
      expect(typeof response.error).toBe('string');
    });

    it('should handle long error messages', () => {
      const longError = 'A'.repeat(500);
      const response: CarritoResponse = {
        success: false,
        message: 'Validation failed',
        error: longError,
      };

      expect(response.error).toBe(longError);
      expect(typeof response.error).toBe('string');
    });

    it('should handle special characters in error', () => {
      const specialError = 'Database érror 🚨 with special chars: @#$%^&*()';
      const response: CarritoResponse = {
        success: false,
        message: 'Database error',
        error: specialError,
      };

      expect(response.error).toBe(specialError);
      expect(typeof response.error).toBe('string');
    });
  });

  describe('real-world scenarios', () => {
    it('should handle successful cart creation', () => {
      const cartCreationResponse: CarritoResponse = {
        success: true,
        message: 'Cart created successfully',
        data: {
          id: 'cart-123e4567-e89b-12d3-a456-426614174000',
          user_id: 'user-123e4567-e89b-12d3-a456-426614174001',
          status: 'active',
          items: [],
          total: 0.00,
          created_at: new Date().toISOString(),
        },
      };

      expect(cartCreationResponse.success).toBe(true);
      expect(cartCreationResponse.message).toBe('Cart created successfully');
      expect(cartCreationResponse.data!.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
      expect(cartCreationResponse.data!.status).toBe('active');
      expect(cartCreationResponse.data!.total).toBe(0.00);
    });

    it('should handle cart retrieval failure', () => {
      const cartNotFoundResponse: CarritoResponse = {
        success: false,
        message: 'Failed to retrieve cart',
        error: 'Cart with ID cart-123 not found',
      };

      expect(cartNotFoundResponse.success).toBe(false);
      expect(cartNotFoundResponse.message).toBe('Failed to retrieve cart');
      expect(cartNotFoundResponse.error).toBe('Cart with ID cart-123 not found');
      expect(cartNotFoundResponse.data).toBeUndefined();
    });

    it('should handle cart item addition', () => {
      const addItemResponse: CarritoResponse = {
        success: true,
        message: 'Item added to cart successfully',
        data: {
          cart_id: 'cart-123',
          item_id: 'item-456',
          product_id: 'product-789',
          quantity: 2,
          unit_price: 25.50,
          subtotal: 51.00,
          cart_total: 51.00,
        },
      };

      expect(addItemResponse.success).toBe(true);
      expect(addItemResponse.data!.quantity).toBe(2);
      expect(addItemResponse.data!.unit_price).toBe(25.50);
      expect(addItemResponse.data!.subtotal).toBe(51.00);
      expect(addItemResponse.data!.cart_total).toBe(51.00);
    });

    it('should handle validation error', () => {
      const validationErrorResponse: CarritoResponse = {
        success: false,
        message: 'Validation failed',
        error: 'Invalid quantity: must be greater than 0',
        data: {
          field: 'quantity',
          value: -1,
          constraint: 'min',
        },
      };

      expect(validationErrorResponse.success).toBe(false);
      expect(validationErrorResponse.error).toBe('Invalid quantity: must be greater than 0');
      expect(validationErrorResponse.data!.field).toBe('quantity');
      expect(validationErrorResponse.data!.value).toBe(-1);
    });

    it('should handle cart checkout', () => {
      const checkoutResponse: CarritoResponse = {
        success: true,
        message: 'Cart checked out successfully',
        data: {
          order_id: 'order-123e4567-e89b-12d3-a456-426614174000',
          cart_id: 'cart-123e4567-e89b-12d3-a456-426614174001',
          total_amount: 150.75,
          payment_status: 'pending',
          estimated_delivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
      };

      expect(checkoutResponse.success).toBe(true);
      expect(checkoutResponse.data!.order_id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
      expect(checkoutResponse.data!.total_amount).toBe(150.75);
      expect(checkoutResponse.data!.payment_status).toBe('pending');
    });
  });

  describe('type safety', () => {
    it('should enforce required properties', () => {
      // This should compile successfully
      const validResponse: CarritoResponse = {
        success: true,
        message: 'Valid response',
      };

      expect(validResponse.success).toBeDefined();
      expect(validResponse.message).toBeDefined();
    });

    it('should allow optional properties to be omitted', () => {
      const minimalResponse: CarritoResponse = {
        success: false,
        message: 'Minimal response',
      };

      expect(minimalResponse.data).toBeUndefined();
      expect(minimalResponse.error).toBeUndefined();
    });

    it('should maintain type information for data property', () => {
      const response: CarritoResponse = {
        success: true,
        message: 'Typed response',
        data: {
          cartItems: 5,
          totalPrice: 125.50,
          currency: 'EUR',
        },
      };

      // TypeScript should know the type of data
      if (response.data) {
        expect(typeof response.data.cartItems).toBe('number');
        expect(typeof response.data.totalPrice).toBe('number');
        expect(typeof response.data.currency).toBe('string');
      }
    });
  });

  describe('serialization', () => {
    it('should be serializable to JSON', () => {
      const response: CarritoResponse = {
        success: true,
        message: 'Cart operation completed',
        data: {
          id: 'cart-123',
          items: [],
          total: 100.50,
        },
        error: undefined,
      };

      const jsonString = JSON.stringify(response);
      const parsed = JSON.parse(jsonString);

      expect(parsed.success).toBe(true);
      expect(parsed.message).toBe('Cart operation completed');
      expect(parsed.data.id).toBe('cart-123');
      expect(parsed.data.total).toBe(100.50);
      expect(parsed.error).toBeUndefined();
    });

    it('should handle null values in serialization', () => {
      const response: CarritoResponse = {
        success: false,
        message: 'Operation failed',
        data: null,
        error: 'Something went wrong',
      };

      const jsonString = JSON.stringify(response);
      const parsed = JSON.parse(jsonString);

      expect(parsed.success).toBe(false);
      expect(parsed.message).toBe('Operation failed');
      expect(parsed.data).toBe(null);
      expect(parsed.error).toBe('Something went wrong');
    });
  });
});
