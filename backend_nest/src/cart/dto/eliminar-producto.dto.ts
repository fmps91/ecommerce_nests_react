import { IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EliminarProductoDto {
    @ApiProperty({ description: 'ID del producto a eliminar' })
    @IsNumber()
    @IsPositive()
    productoId: number;
}