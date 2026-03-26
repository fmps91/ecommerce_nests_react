import { ApiProperty } from '@nestjs/swagger';
import { PaymentResponseDto } from './payment-response.dto';

export class PaginationMetaDto {
  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  total_items: number;

  @ApiProperty()
  total_pages: number;

  @ApiProperty()
  has_next_page: boolean;

  @ApiProperty()
  has_previous_page: boolean;
}

export class PaginatedPaymentResponseDto {
  @ApiProperty({ type: [PaymentResponseDto] })
  data: PaymentResponseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;

  constructor(data: PaymentResponseDto[], meta: PaginationMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}