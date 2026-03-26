import { PaginatedPaymentResponseDto, PaginationMetaDto } from '../paginated-payments.dto';
import { PaymentResponseDto } from '../payment-response.dto';
import { PaymentMethod, PaymentStatus } from '../../models/payments.model';

describe('PaginatedPaymentResponseDto', () => {
  const mockPaymentResponse: PaymentResponseDto = new PaymentResponseDto({
    id: '123e4567-e89b-12d3-a456-426614174000',
    order_id: '123e4567-e89b-12d3-a456-426614174001',
    user_id: '123e4567-e89b-12d3-a456-426614174002',
    amount: 100.50,
    payment_method: PaymentMethod.CREDIT_CARD,
    status: PaymentStatus.COMPLETED,
    transaction_id: 'txn_123456',
    metadata: { gateway: 'stripe' },
    paid_at: new Date(),
    notes: 'Test payment',
    created_at: new Date(),
    updated_at: new Date(),
  });

  const mockPaginationMeta: PaginationMetaDto = {
    page: 2,
    limit: 10,
    total_items: 25,
    total_pages: 3,
    has_next_page: true,
    has_previous_page: true,
  };

  describe('constructor', () => {
    it('should create instance with data and meta', () => {
      const dto = new PaginatedPaymentResponseDto([mockPaymentResponse], mockPaginationMeta);

      expect(dto.data).toHaveLength(1);
      expect(dto.data[0]).toBeInstanceOf(PaymentResponseDto);
      expect(dto.meta).toBeInstanceOf(PaginationMetaDto);
      expect(dto.meta.page).toBe(2);
      expect(dto.meta.limit).toBe(10);
    });

    it('should create instance with empty data array', () => {
      const dto = new PaginatedPaymentResponseDto([], mockPaginationMeta);

      expect(dto.data).toHaveLength(0);
      expect(Array.isArray(dto.data)).toBe(true);
      expect(dto.meta).toBeInstanceOf(PaginationMetaDto);
    });

    it('should create instance with partial meta', () => {
      const partialMeta = {
        page: 1,
        limit: 5,
      };

      const dto = new PaginatedPaymentResponseDto([mockPaymentResponse], partialMeta as any);

      expect(dto.data).toHaveLength(1);
      expect(dto.meta.page).toBe(1);
      expect(dto.meta.limit).toBe(5);
    });
  });

  describe('data array handling', () => {
    it('should handle multiple payment responses', () => {
      const multiplePayments = [
        mockPaymentResponse,
        new PaymentResponseDto({
          id: '123e4567-e89b-12d3-a456-426614174003',
          order_id: '123e4567-e89b-12d3-a456-426614174004',
          amount: 75.25,
          payment_method: PaymentMethod.PAYPAL,
          status: PaymentStatus.PENDING,
          created_at: new Date(),
          updated_at: new Date(),
        }),
      ];

      const dto = new PaginatedPaymentResponseDto(multiplePayments, mockPaginationMeta);

      expect(dto.data).toHaveLength(2);
      expect(dto.data[0].id).toBe(mockPaymentResponse.id);
      expect(dto.data[1].amount).toBe(75.25);
    });

    it('should handle null data', () => {
      const dto = new PaginatedPaymentResponseDto(null as any, mockPaginationMeta);

      expect(dto.data).toBeNull();
    });

    it('should handle undefined data', () => {
      const dto = new PaginatedPaymentResponseDto(undefined as any, mockPaginationMeta);

      expect(dto.data).toBeUndefined();
    });
  });

  describe('pagination meta handling', () => {
    it('should handle complete pagination meta', () => {
      const completeMeta: PaginationMetaDto = {
        page: 3,
        limit: 25,
        total_items: 150,
        total_pages: 6,
        has_next_page: true,
        has_previous_page: true,
      };

      const dto = new PaginatedPaymentResponseDto([mockPaymentResponse], completeMeta);

      expect(dto.meta.page).toBe(3);
      expect(dto.meta.limit).toBe(25);
      expect(dto.meta.total_items).toBe(150);
      expect(dto.meta.total_pages).toBe(6);
      expect(dto.meta.has_next_page).toBe(true);
      expect(dto.meta.has_previous_page).toBe(true);
    });

    it('should handle minimal pagination meta', () => {
      const minimalMeta = {
        page: 1,
        limit: 10,
      };

      const dto = new PaginatedPaymentResponseDto([mockPaymentResponse], minimalMeta as any);

      expect(dto.meta.page).toBe(1);
      expect(dto.meta.limit).toBe(10);
      expect(dto.meta.total_items).toBeUndefined();
      expect(dto.meta.total_pages).toBeUndefined();
    });

    it('should handle first page pagination', () => {
      const firstPageMeta: PaginationMetaDto = {
        page: 1,
        limit: 10,
        total_items: 5,
        total_pages: 1,
        has_next_page: false,
        has_previous_page: false,
      };

      const dto = new PaginatedPaymentResponseDto([mockPaymentResponse], firstPageMeta);

      expect(dto.meta.has_next_page).toBe(false);
      expect(dto.meta.has_previous_page).toBe(false);
    });

    it('should handle middle page pagination', () => {
      const middlePageMeta: PaginationMetaDto = {
        page: 2,
        limit: 10,
        total_items: 25,
        total_pages: 3,
        has_next_page: true,
        has_previous_page: true,
      };

      const dto = new PaginatedPaymentResponseDto([mockPaymentResponse], middlePageMeta);

      expect(dto.meta.has_next_page).toBe(true);
      expect(dto.meta.has_previous_page).toBe(true);
    });

    it('should handle last page pagination', () => {
      const lastPageMeta: PaginationMetaDto = {
        page: 3,
        limit: 10,
        total_items: 25,
        total_pages: 3,
        has_next_page: false,
        has_previous_page: true,
      };

      const dto = new PaginatedPaymentResponseDto([mockPaymentResponse], lastPageMeta);

      expect(dto.meta.has_next_page).toBe(false);
      expect(dto.meta.has_previous_page).toBe(true);
    });
  });

  describe('serialization', () => {
    it('should be serializable to JSON', () => {
      const dto = new PaginatedPaymentResponseDto([mockPaymentResponse], mockPaginationMeta);
      const jsonString = JSON.stringify(dto);
      const parsed = JSON.parse(jsonString);

      expect(Array.isArray(parsed.data)).toBe(true);
      expect(parsed.data).toHaveLength(1);
      expect(parsed.data[0].id).toBe(mockPaymentResponse.id);
      expect(parsed.meta.page).toBe(2);
      expect(parsed.meta.limit).toBe(10);
      expect(parsed.meta.total_items).toBe(25);
      expect(parsed.meta.total_pages).toBe(3);
      expect(parsed.meta.has_next_page).toBe(true);
      expect(parsed.meta.has_previous_page).toBe(true);
    });

    it('should serialize empty data correctly', () => {
      const dto = new PaginatedPaymentResponseDto([], mockPaginationMeta);
      const jsonString = JSON.stringify(dto);
      const parsed = JSON.parse(jsonString);

      expect(Array.isArray(parsed.data)).toBe(true);
      expect(parsed.data).toHaveLength(0);
      expect(parsed.meta.total_items).toBe(25);
    });

    it('should serialize partial meta correctly', () => {
      const partialMeta = { page: 1, limit: 5 };
      const dto = new PaginatedPaymentResponseDto([mockPaymentResponse], partialMeta as any);
      const jsonString = JSON.stringify(dto);
      const parsed = JSON.parse(jsonString);

      expect(parsed.meta.page).toBe(1);
      expect(parsed.meta.limit).toBe(5);
      expect(parsed.meta.total_items).toBeUndefined();
    });
  });

  describe('edge cases', () => {
    it('should handle large data arrays', () => {
      const largeData = Array.from({ length: 1000 }, (_, index) =>
        new PaymentResponseDto({
          id: `id-${index}`,
          order_id: `order-${index}`,
          amount: index + 1,
          payment_method: PaymentMethod.CREDIT_CARD,
          status: PaymentStatus.COMPLETED,
          created_at: new Date(),
          updated_at: new Date(),
        })
      );

      const largeMeta: PaginationMetaDto = {
        page: 1,
        limit: 1000,
        total_items: 1000,
        total_pages: 1,
        has_next_page: false,
        has_previous_page: false,
      };

      const dto = new PaginatedPaymentResponseDto(largeData, largeMeta);

      expect(dto.data).toHaveLength(1000);
      expect(dto.meta.total_items).toBe(1000);
      expect(dto.data[0].id).toBe('id-0');
      expect(dto.data[999].id).toBe('id-999');
    });

    it('should handle zero-based pagination', () => {
      const zeroBasedMeta: PaginationMetaDto = {
        page: 1,
        limit: 10,
        total_items: 0,
        total_pages: 0,
        has_next_page: false,
        has_previous_page: false,
      };

      const dto = new PaginatedPaymentResponseDto([], zeroBasedMeta);

      expect(dto.meta.total_items).toBe(0);
      expect(dto.meta.total_pages).toBe(0);
      expect(dto.meta.has_next_page).toBe(false);
      expect(dto.meta.has_previous_page).toBe(false);
    });

    it('should handle negative values (edge case)', () => {
      const negativeMeta = {
        page: -1,
        limit: -10,
        total_items: -5,
        total_pages: -1,
        has_next_page: false,
        has_previous_page: false,
      } as any;

      const dto = new PaginatedPaymentResponseDto([mockPaymentResponse], negativeMeta);

      expect(dto.meta.page).toBe(-1);
      expect(dto.meta.limit).toBe(-10);
      expect(dto.meta.total_items).toBe(-5);
    });
  });
});

describe('PaginationMetaDto', () => {
  describe('constructor', () => {
    it('should create instance with complete data', () => {
      const meta = new PaginationMetaDto();
      meta.page = 2;
      meta.limit = 10;
      meta.total_items = 25;
      meta.total_pages = 3;
      meta.has_next_page = true;
      meta.has_previous_page = true;

      expect(meta.page).toBe(2);
      expect(meta.limit).toBe(10);
      expect(meta.total_items).toBe(25);
      expect(meta.total_pages).toBe(3);
      expect(meta.has_next_page).toBe(true);
      expect(meta.has_previous_page).toBe(true);
    });

    it('should create instance with partial data', () => {
      const meta = new PaginationMetaDto();
      meta.page = 1;
      meta.limit = 5;

      expect(meta.page).toBe(1);
      expect(meta.limit).toBe(5);
      expect(meta.total_items).toBeUndefined();
      expect(meta.total_pages).toBeUndefined();
      expect(meta.has_next_page).toBeUndefined();
      expect(meta.has_previous_page).toBeUndefined();
    });

    it('should initialize with undefined values', () => {
      const meta = new PaginationMetaDto();

      expect(meta.page).toBeUndefined();
      expect(meta.limit).toBeUndefined();
      expect(meta.total_items).toBeUndefined();
      expect(meta.total_pages).toBeUndefined();
      expect(meta.has_next_page).toBeUndefined();
      expect(meta.has_previous_page).toBeUndefined();
    });
  });

  describe('field types', () => {
    it('should handle correct field types', () => {
      const meta = new PaginationMetaDto();
      meta.page = 1;
      meta.limit = 10;
      meta.total_items = 100;
      meta.total_pages = 10;
      meta.has_next_page = true;
      meta.has_previous_page = false;

      expect(typeof meta.page).toBe('number');
      expect(typeof meta.limit).toBe('number');
      expect(typeof meta.total_items).toBe('number');
      expect(typeof meta.total_pages).toBe('number');
      expect(typeof meta.has_next_page).toBe('boolean');
      expect(typeof meta.has_previous_page).toBe('boolean');
    });
  });

  describe('serialization', () => {
    it('should be serializable to JSON', () => {
      const meta = new PaginationMetaDto();
      meta.page = 2;
      meta.limit = 10;
      meta.total_items = 25;
      meta.total_pages = 3;
      meta.has_next_page = true;
      meta.has_previous_page = true;

      const jsonString = JSON.stringify(meta);
      const parsed = JSON.parse(jsonString);

      expect(parsed.page).toBe(2);
      expect(parsed.limit).toBe(10);
      expect(parsed.total_items).toBe(25);
      expect(parsed.total_pages).toBe(3);
      expect(parsed.has_next_page).toBe(true);
      expect(parsed.has_previous_page).toBe(true);
    });

    it('should serialize partial data correctly', () => {
      const meta = new PaginationMetaDto();
      meta.page = 1;
      meta.limit = 5;

      const jsonString = JSON.stringify(meta);
      const parsed = JSON.parse(jsonString);

      expect(parsed.page).toBe(1);
      expect(parsed.limit).toBe(5);
      expect(parsed.total_items).toBeUndefined();
    });
  });
});
