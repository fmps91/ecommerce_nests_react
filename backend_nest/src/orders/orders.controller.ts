// src/orders/orders.controller.ts
import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards,
  Query,
  HttpStatus,
  HttpCode,
  UseInterceptors,
  ClassSerializerInterceptor,
  ValidationPipe,
  Request,
  DefaultValuePipe,
  ParseIntPipe
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { OrderEntity } from './entities/order.entity';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OrderDetailResponseDto } from './dto/order-detail-response.dto';
import { PaginatedResponseDto } from './dto/paginated-response.dto';


@Controller('orders')
@UseInterceptors(ClassSerializerInterceptor)
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly orderDetailService: OrdersService
  ) {}
 

  @Post()
  //@UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo pedido' })
    @ApiResponse({ 
      status: 201, 
      description: 'Orden creada exitosamente',
      type: OrderResponseDto // Importante: especifica el tipo de respuesta
    })
    //@ApiResponse({ status: 400, description: 'Datos inválidos' })
    //@ApiResponse({ status: 409, description: 'El email ya está registrado' })
    //@ApiBody({ type: CreateOrderDto }) 
  async create(
    @Body() createOrderDto: CreateOrderDto
  ): Promise<any> {
    
    
    const order = await this.ordersService.create(createOrderDto);
    //console.log('Created order:', JSON.stringify(order, null, 2));
    const orderSubtotals = createOrderDto.items.reduce((sum, item) => sum + item.subtotal, 0);
    console.log('Order JSON:', orderSubtotals);

    const response={
      id: order.id,
      userId: order.userId,
      items: createOrderDto.items,
      isPaid: !!order.paidAt,
      isShipped: !!order.shippedAt,
      isDelivered: !!order.deliveredAt,
      formattedTotal: `${order.total}`,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    }
    return response;
  }

  @Get()
    @ApiOperation({ summary: 'Obtener todos los productos con paginación' })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<PaginatedResponseDto<OrderEntity>> {
    // Validar que los valores sean positivos
    const validPage = page > 0 ? page : 1;
    const validLimit = limit > 0 ? limit : 10;
  
    // Pasar el objeto de parámetros correctamente
    const result = await this.ordersService.findAll({ 
      page: validPage, 
      limit: validLimit 
    });
    
    // Transformar los productos a DTOs de respuesta
    const data = result.data.map(order => new OrderEntity(order));
    
    // Crear y retornar la respuesta paginada
    return new PaginatedResponseDto({
      data,
      meta: result.meta,
    });
  }

  @Get('/all')
  //@UseGuards(JwtAuthGuard, RolesGuard)
  //@Roles(UserRole.ADMIN)
  async findAllSimple(): Promise<OrderResponseDto[]> {
    const orders = await this.ordersService.findAllSimple();
    return orders.map(order => this.mapOrderToResponse(order));
  }

  @Get('my-orders/:userId')
  //@UseGuards(JwtAuthGuard)
  async findMyOrders(@Param('userId') userId: string): Promise<OrderResponseDto[]> {
    console.log('Finding orders for userId:', userId);
    const orders = await this.ordersService.findByUser(userId);
    return orders.map(order => this.mapOrderToResponse(order));
  }
 

  @Get('stats')
  //@UseGuards(JwtAuthGuard, RolesGuard)
  //@Roles(UserRole.ADMIN)
  async getStats() {
    return this.ordersService.getOrderStats();
  }

  @Get(':id')
  //@UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string): Promise<OrderResponseDto> {
    const order = await this.ordersService.findOne(id);
    return this.mapOrderToResponse(order);
  }

  @Patch(':id')
  //@UseGuards(JwtAuthGuard, RolesGuard)
  //@Roles(UserRole.ADMIN)
  async update(
    @Param('id') id: string, 
    @Body() updateOrderDto: UpdateOrderDto
  ): Promise<OrderResponseDto> {
    const order = await this.ordersService.update(id, updateOrderDto);
    return this.mapOrderToResponse(order);
  }

  @Patch(':id/status')
  //@UseGuards(JwtAuthGuard, RolesGuard)
  //@Roles(UserRole.ADMIN)
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string
  ): Promise<OrderResponseDto> {
    const order = await this.ordersService.updateStatus(id, status);
    return this.mapOrderToResponse(order);
  }

  @Patch(':id/mark-paid')
  //@UseGuards(JwtAuthGuard, RolesGuard)
  //@Roles(UserRole.ADMIN)
  async markAsPaid(@Param('id') id: string): Promise<OrderResponseDto> {
    const order = await this.ordersService.markAsPaid(id);
    return this.mapOrderToResponse(order);
  }

  @Delete(':id')
  //@UseGuards(JwtAuthGuard, RolesGuard)
  //@Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.ordersService.remove(id);
  }

  @Delete('delete/:id')
  //@UseGuards(JwtAuthGuard, RolesGuard)
  //@Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.ordersService.delete(id);
  }

  private mapOrderToResponse(order: OrderEntity): OrderResponseDto {
    const response = new OrderResponseDto({
      id: order.id,
      userId: order.userId,
      itemsIds: order.items ? order.items.map(item => item.id) : [],
      status: order.status,
      isPaid: order.isPaid,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      user: order.user ? new UserResponseDto(order.user) : undefined,
      items: order.items ? order.items.map(item => new OrderDetailResponseDto({
        id: item.id,
        productId: item.productId,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        subtotal: item.subtotal,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      })) : []
    });
    return response;
}
}