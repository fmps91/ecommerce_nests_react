import { IsNumber, IsPositive, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AgregarProductoDto {
    @ApiProperty({ description: 'ID del producto' })
    @IsNumber()
    @IsPositive()
    productoId: number;

    @ApiProperty({ description: 'Cantidad a agregar', minimum: 1 })
    @IsNumber()
    @IsPositive()
    @Min(1)
    cantidad: number;
}