import { Exclude, Expose } from 'class-transformer';

export class ProductEntity {
  @Expose()
  id: string;

  @Expose()
  nombre: string;

  @Expose()
  precio: number;

  @Expose()
  stock: number;

  @Expose()
  descripcion?: string;

  @Expose()
  imagen?: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Exclude()
  deletedAt?: Date;

  constructor(partial: Partial<ProductEntity>) {
    Object.assign(this, partial);
  }
}