// src/orders/orders.service.ts
import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { Order } from './models/order.model';
import { User } from '../users/models/user.model';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderEntity } from './entities/order.entity';
import { OrderDetail } from './models/order-detail.model';
import { PaginatedResponseDto } from './dto/paginated-response.dto';


export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

@Injectable()
export class OrdersService {
  constructor(
    
    @Inject('SEQUELIZE')
    private sequelize: Sequelize,
  ) {}

  private get orderRepository() {
    return this.sequelize.getRepository(Order);
  }

  private get orderDetailRepository() {
    return this.sequelize.getRepository(OrderDetail);
  }

  async create(createOrderDto: CreateOrderDto): Promise<OrderEntity> {
    // Crear la orden
    const order = await this.orderRepository.create({
      ...createOrderDto

    });

    // Crear los detalles de la orden
    createOrderDto.items.map(async item => 
      await this.orderDetailRepository.create({
        orderId: order.id,
        productName: item.productName,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.subtotal
      })
    ); 
    
    return new OrderEntity(order.toJSON());
  }

  async findAll(params?: PaginationParams): Promise<PaginatedResponseDto<OrderEntity>> {
      // Valores por defecto
      const page = params?.page && params.page > 0 ? params.page : 1;
      const limit = params?.limit && params.limit > 0 ? params.limit : 10;
      
      // Calcular el offset
      const offset = (page - 1) * limit;
  
      // Ejecutar la consulta con paginación
      const { rows, count } = await this.orderRepository.findAndCountAll({
        order: [['createdAt', 'DESC']],
        include: [User, OrderDetail],
        limit,
        offset,
        distinct: true, // Importante para contar correctamente con joins
      });
  
      // Calcular metadatos de paginación
      const totalPages = Math.ceil(count / limit);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;
  
      // Mapear los productos a entidades
      const data = rows.map(p => new OrderEntity(p.toJSON()));
  
      // Retornar respuesta paginada
      return {
        data,
        meta: {
          total: count,
          page,
          limit,
          totalPages,
          hasNextPage,
          hasPreviousPage,
        },
      };
    }


  async findAllSimple(): Promise<OrderEntity[]> {
    const orders = await this.orderRepository.findAll({
      include: [User, OrderDetail],
      order: [['createdAt', 'DESC']],
    });
    //console.log('Orders found:', JSON.stringify(orders, null, 2));

    return orders.map(order => new OrderEntity(order.toJSON()));
  }

  async findOne(id: string): Promise<OrderEntity> {
    const order = await this.orderRepository.findByPk(id, {
      include: [User, OrderDetail],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return new OrderEntity(order.toJSON());
  }

  async findByUser(userId: string): Promise<OrderEntity[]> {
    const orders = await this.orderRepository.findAll({
      //where: { "user_id":"b4bfa4da-a8d1-4f08-aca9-9b4490aa5c92" },
      where: { userId },
      include: [User, OrderDetail],
      order: [['createdAt', 'DESC']],
    });

    

    return orders.map(order => new OrderEntity(order.toJSON()));
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<OrderEntity> {
    const order = await this.orderRepository.findByPk(id,{
      include: [User, OrderDetail],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    await order.update(updateOrderDto);
    await order.reload({ include: [User, OrderDetail] });

    return new OrderEntity(order.toJSON());
  }

  async remove(id: string): Promise<void> {
    const order = await this.orderRepository.findByPk(id);

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    await order.destroy();
   
  }

  async delete(id: string): Promise<void> {
    const order = await this.orderRepository.findByPk(id,{
      paranoid: false, // ¡Importante! Permite encontrar registros soft-deleted
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    await order.destroy({ force: true }); // Hard delete
   
  }

  async updateStatus(id: string, status: string): Promise<OrderEntity> {
    const order = await this.orderRepository.findByPk(id);

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    const validStatuses = ['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED', 'REFUNDED'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestException(`Invalid status: ${status}`);
    }

    await order.update({ status });
    await order.reload({ include: [User] });

    return new OrderEntity(order.toJSON());
  }

  async markAsPaid(id: string): Promise<OrderEntity> {
    const order = await this.orderRepository.findByPk(id);

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    await order.update({ 
      status: 'PROCESSING',
      paidAt: new Date() 
    });
    await order.reload({ include: [User] });

    return new OrderEntity(order.toJSON());
  }

  async getOrderStats(): Promise<any> {
    const totalOrders = await this.orderRepository.count();
    const totalRevenue = await this.orderRepository.sum('total');
    const pendingOrders = await this.orderRepository.count({ 
      where: { status: 'PENDING' } 
    });

    return {
      totalOrders,
      totalRevenue,
      pendingOrders,
    };
  }
}