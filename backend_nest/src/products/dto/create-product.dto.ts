import { IsString, IsNumber, Min, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsString()
  nombre: string;

  @IsNumber()
  @Min(0)
  precio: number;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsOptional()
  imagen?: string;
}
