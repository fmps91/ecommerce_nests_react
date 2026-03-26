// src/orders/order-details.controller.ts
import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query,
  HttpStatus,
  HttpCode,
  UseInterceptors,
  ClassSerializerInterceptor,
  DefaultValuePipe,
  ParseIntPipe
} from '@nestjs/common';
import { OrderDetailsService } from './order-details.service';
import { CreateOrderDetailDto } from './dto/create-order-detail.dto';
import { UpdateOrderDetailDto } from './dto/update-order-detail.dto';
import { OrderDetailResponseDto } from './dto/order-detail-response.dto';
import { PaginatedResponseDto } from './dto/paginated-response.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('order-details')
@UseInterceptors(ClassSerializerInterceptor)
export class OrderDetailsController {
  constructor(
    private readonly orderDetailsService: OrderDetailsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear nuevos detalles de orden' })
  @ApiResponse({ 
    status: 201, 
    description: 'Detalles de orden creados exitosamente',
    type: [OrderDetailResponseDto]
  })
  async create(@Body() createOrderDetailDto: CreateOrderDetailDto): Promise<OrderDetailResponseDto[]> {
    return this.orderDetailsService.create(createOrderDetailDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los detalles de orden con paginación' })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<PaginatedResponseDto<OrderDetailResponseDto>> {
    const validPage = page > 0 ? page : 1;
    const validLimit = limit > 0 ? limit : 10;

    return this.orderDetailsService.findAll({ 
      page: validPage, 
      limit: validLimit 
    });
  }

  @Get('all')
  @ApiOperation({ summary: 'Obtener todos los detalles de orden' })
  async findAllSimple(): Promise<OrderDetailResponseDto[]> {
    return this.orderDetailsService.findAllSimple();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de orden detail por ID' })
  async findOne(@Param('id') id: string): Promise<OrderDetailResponseDto> {
    return this.orderDetailsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar detalle de orden detail' })
  async update(
    @Param('id') id: string, 
    @Body() updateOrderDetailDto: UpdateOrderDetailDto
  ): Promise<OrderDetailResponseDto> {
    return this.orderDetailsService.update(id, updateOrderDetailDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar detalle de orden detail' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.orderDetailsService.remove(id);
  }
}
