import { 
  IsUUID, 
  IsNumber, 
  IsEnum, 
  IsOptional, 
  IsString, 
  Min, 
  Max,
  IsObject,
  IsDateString
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod, PaymentStatus } from '../models/payments.model';

export class CreatePaymentDto {
  @ApiProperty({ description: 'ID de la orden' })
  @IsUUID()
  order_id: string;

  @ApiProperty({ description: 'ID del usuario' })
  @IsUUID()
  user_id: string;

  @ApiProperty({ description: 'Monto del pago', minimum: 0 })
  @IsNumber()
  @Min(0)
  @Max(999999.99)
  amount: number;

  @ApiProperty({ enum: PaymentMethod, description: 'Método de pago' })
  @IsEnum(PaymentMethod)
  payment_method: PaymentMethod;

  @ApiProperty({ enum: PaymentStatus, required: false, description: 'Estado del pago' })
  @IsEnum(PaymentStatus)
  @IsOptional()
  status?: PaymentStatus;

  @ApiProperty({ required: false, description: 'ID de transacción' })
  @IsString()
  @IsOptional()
  transaction_id?: string;

  @ApiProperty({ required: false, description: 'Metadatos adicionales' })
  @IsObject()
  @IsOptional()
  metadata?: any;

  @ApiProperty({ required: false, description: 'Fecha de pago' })
  @IsDateString()
  @IsOptional()
  paid_at?: Date;

  @ApiProperty({ required: false, description: 'Notas adicionales' })
  @IsString()
  @IsOptional()
  notes?: string;
}