import { Expose, Type } from 'class-transformer';
import { PaginationMetaDto } from './pagination-meta.dto';

export class PaginatedResponseDto<T> {
  @Expose()
  data: T[];

  @Expose()
  @Type(() => PaginationMetaDto)
  meta: PaginationMetaDto;

  constructor(partial: Partial<PaginatedResponseDto<T>>) {
    Object.assign(this, partial);
  }
}