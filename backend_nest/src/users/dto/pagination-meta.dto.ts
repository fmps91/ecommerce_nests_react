import { Optional } from '@nestjs/common';
import { Expose } from 'class-transformer';

export class PaginationMetaDto {
  @Expose()
  @Optional()
  total: number;

  @Expose()
  page: number;

  @Expose()
  limit: number;

  @Expose()
  @Optional()
  totalPages: number;

  @Expose()
  @Optional()
  hasNextPage: boolean;

  @Expose()  
  @Optional()
  hasPreviousPage: boolean;

  constructor(partial: Partial<PaginationMetaDto>) {
    Object.assign(this, partial);
  }
}