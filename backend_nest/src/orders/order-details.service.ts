// src/orders/order-details.service.ts
import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { OrderDetail } from './models/order-detail.model';
import { Product } from '../products/models/product.model';
import { CreateOrderDetailDto } from './dto/create-order-detail.dto';
import { UpdateOrderDetailDto } from './dto/update-order-detail.dto';
import { OrderDetailResponseDto } from './dto/order-detail-response.dto';
import { PaginatedResponseDto } from './dto/paginated-response.dto';

export interface PaginationParams {
  page?: number;
  limit?: number;
}

@Injectable()
export class OrderDetailsService {
  constructor(
    @Inject('SEQUELIZE')
    private sequelize: Sequelize,
  ) {}

  private get orderDetailRepository() {
    return this.sequelize.getRepository(OrderDetail);
  }

  async create(createOrderDetailDto: CreateOrderDetailDto): Promise<OrderDetailResponseDto[]> {
    const createdDetails: OrderDetail[] = [];

    for (const item of createOrderDetailDto.items) {
      const subtotal = (item.unitPrice || 0) * item.quantity;
      const orderDetail = await this.orderDetailRepository.create({
        orderId: createOrderDetailDto.orderId,
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal
      });
      createdDetails.push(orderDetail);
    }

    return createdDetails.map(detail => new OrderDetailResponseDto(detail.toJSON()));
  }

  async findAll(params?: PaginationParams): Promise<PaginatedResponseDto<OrderDetailResponseDto>> {
    const page = params?.page && params.page > 0 ? params.page : 1;
    const limit = params?.limit && params.limit > 0 ? params.limit : 10;
    const offset = (page - 1) * limit;

    const { rows, count } = await this.orderDetailRepository.findAndCountAll({
      include: [Product],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
      distinct: true,
    });

    const totalPages = Math.ceil(count / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    const data = rows.map(detail => new OrderDetailResponseDto(detail.toJSON()));

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

  async findAllSimple(): Promise<OrderDetailResponseDto[]> {
    const orderDetails = await this.orderDetailRepository.findAll({
      include: [Product],
    });

    return orderDetails.map(detail => new OrderDetailResponseDto(detail.toJSON()));
  }

  async findOne(id: string): Promise<OrderDetailResponseDto> {
    const orderDetail = await this.orderDetailRepository.findByPk(id, {
      include: [Product],
    });

    if (!orderDetail) {
      throw new NotFoundException(`Order detail with ID ${id} not found`);
    }

    return new OrderDetailResponseDto(orderDetail.toJSON());
  }

  async findByOrder(orderId: string): Promise<OrderDetailResponseDto[]> {
    const orderDetails = await this.orderDetailRepository.findAll({
      where: { orderId },
      include: [Product],
      order: [['createdAt', 'DESC']],
    });

    return orderDetails.map(detail => new OrderDetailResponseDto(detail.toJSON()));
  }


  async update(id: string, updateOrderDetailDto: UpdateOrderDetailDto): Promise<OrderDetailResponseDto> {
    const orderDetail = await this.orderDetailRepository.findByPk(id, {
      include: [Product],
    });

    if (!orderDetail) {
      throw new NotFoundException(`Order detail with ID ${id} not found`);
    }

    await orderDetail.update(updateOrderDetailDto);
    await orderDetail.reload({ include: [Product] });

    return new OrderDetailResponseDto(orderDetail.toJSON());
  }

  async remove(id: string): Promise<void> {
    const orderDetail = await this.orderDetailRepository.findByPk(id);

    if (!orderDetail) {
      throw new NotFoundException(`Order detail with ID ${id} not found`);
    }

    await orderDetail.destroy();
  }

}
