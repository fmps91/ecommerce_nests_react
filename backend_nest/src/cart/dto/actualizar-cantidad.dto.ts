import { IsNumber, IsPositive, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ActualizarCantidadDto {
    @ApiProperty({ description: 'ID del producto' })
    @IsNumber()
    @IsPositive()
    productoId: number;

    @ApiProperty({ description: 'Nueva cantidad', minimum: 1 })
    @IsNumber()
    @IsPositive()
    @Min(1)
    cantidad: number;
}