import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentResponseDto } from './dto/payment-response.dto';
import { PaginatedPaymentResponseDto } from './dto/paginated-payments.dto';
import { PaymentStatus } from './models/payments.model';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@ApiTags('payments')
@Controller('payments')
@UsePipes(new ValidationPipe({ transform: true }))
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo pago' })
  @ApiResponse({ status: 201, type: PaymentResponseDto })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createPaymentDto: CreatePaymentDto): Promise<PaymentResponseDto> {
    return this.paymentsService.create(createPaymentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los pagos paginados' })
  @ApiResponse({ status: 200, type: PaginatedPaymentResponseDto })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'status', required: false, enum: PaymentStatus })
  @ApiQuery({ name: 'user_id', required: false, type: String })
  @ApiQuery({ name: 'order_id', required: false, type: String })
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ): Promise<PaginatedPaymentResponseDto> {
    return this.paymentsService.findAll({ page, limit });
  }

  @Get('stats')
  @ApiOperation({ summary: 'Obtener estadísticas de pagos' })
  @ApiResponse({ status: 200 })
  getStats(@Query('user_id') userId?: string): Promise<any> {
    return this.paymentsService.getPaymentStats(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un pago por ID' })
  @ApiResponse({ status: 200, type: PaymentResponseDto })
  @ApiResponse({ status: 404, description: 'Pago no encontrado' })
  @ApiParam({ name: 'id', type: String })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<PaymentResponseDto> {
    return this.paymentsService.findOne(id);
  }

  @Get('order/:orderId')
  @ApiOperation({ summary: 'Obtener pagos por ID de orden' })
  @ApiResponse({ status: 200, type: [PaymentResponseDto] })
  @ApiParam({ name: 'orderId', type: String })
  findByOrderId(@Param('orderId', ParseUUIDPipe) orderId: string): Promise<PaymentResponseDto[]> {
    return this.paymentsService.findByOrderId(orderId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un pago' })
  @ApiResponse({ status: 200, type: PaymentResponseDto })
  @ApiResponse({ status: 404, description: 'Pago no encontrado' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ): Promise<PaymentResponseDto> {
    return this.paymentsService.update(id, updatePaymentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un pago (soft delete)' })
  @ApiResponse({ status: 204, description: 'Pago eliminado' })
  @ApiResponse({ status: 404, description: 'Pago no encontrado' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.paymentsService.remove(id);
  }

  @Post(':id/refund')
  @ApiOperation({ summary: 'Reembolsar un pago' })
  @ApiResponse({ status: 200, type: PaymentResponseDto })
  @ApiResponse({ status: 400, description: 'No se puede reembolsar' })
  refund(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('reason') reason?: string,
  ): Promise<PaymentResponseDto> {
    return this.paymentsService.processRefund(id, reason);
  }
}