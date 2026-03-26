import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { PaymentEntity } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentResponseDto } from './dto/payment-response.dto';
import { Payment, PaymentStatus } from './models/payments.model';
import { PaginatedPaymentResponseDto, PaginationMetaDto } from './dto/paginated-payments.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Op } from 'sequelize';
import { Order } from 'src/orders/models/order.model';
import { User } from 'src/users/models/user.model';


// Interface para los parámetros de paginación - ESTO ES LO QUE DEBES USAR EN EL CONTROLADOR
export interface PaginationParams {
  page?: number;
  limit?: number;
  /* filters?: {
    status?: PaymentStatus;
    user_id?: string;
    order_id?: string;
    start_date?: Date;
    end_date?: Date;
  }; */
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
export class PaymentsService {
  constructor(
      @Inject('SEQUELIZE')
      private sequelize: Sequelize,
    ) {}
  
    private get paymentRepository() {
      return this.sequelize.getRepository(Payment);
    }

  async create(createPaymentDto: CreatePaymentDto): Promise<PaymentEntity> {
  const transaction = await this.sequelize.transaction();
  
  try {
    const existingPayment = await this.paymentRepository.findOne({
      where: { order_id: createPaymentDto.order_id },
      transaction,
    });

    if (existingPayment && existingPayment.status !== PaymentStatus.FAILED) {
      throw new BadRequestException('Ya existe un pago para esta orden');
    }

    // ✅ Separar paid_at y el resto de propiedades
    const { status, paid_at, ...restDto } = createPaymentDto;
    
    const paymentData = {
      order_id: createPaymentDto.order_id,
      user_id: createPaymentDto.user_id,
      amount: createPaymentDto.amount,
      payment_method: createPaymentDto.payment_method,
      status: status || PaymentStatus.PENDING,
      transaction_id: createPaymentDto.transaction_id,
      metadata: createPaymentDto.metadata,
      paid_at: status === PaymentStatus.COMPLETED ? (paid_at || new Date()) : null,
      notes: createPaymentDto.notes,
    };

    const payment = await this.paymentRepository.create(paymentData as Payment, { transaction });

    await transaction.commit();

    return new PaymentEntity(payment.toJSON());
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

  async findAll(
   params?: PaginationParams
  ): Promise<PaginatedPaymentResponseDto> {
const page = params?.page && params.page > 0 ? params.page : 1;
    const limit = params?.limit && params.limit > 0 ? params.limit : 10;
    
    // Calcular el offset
    const offset = (page - 1) * limit;

    // Ejecutar la consulta con paginación
    const { rows, count } = await this.paymentRepository.findAndCountAll({
      order: [['createdAt', 'DESC']],
      include: [Order,User],
      limit,
      offset,
      distinct: true, // Importante para contar correctamente con joins
    });

    // Calcular metadatos de paginación
    const totalPages = Math.ceil(count / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    // Mapear los productos a DTOs
    const data = rows.map(p => new PaymentResponseDto(new PaymentEntity(p.toJSON())));

    // Crear meta con los nombres correctos para el DTO
    const meta = new PaginationMetaDto();
    meta.page = page;
    meta.limit = limit;
    meta.total_items = count;
    meta.total_pages = totalPages;
    meta.has_next_page = hasNextPage;
    meta.has_previous_page = hasPreviousPage;

    return new PaginatedPaymentResponseDto(data, meta);
  }

  async findOne(id: string): Promise<PaymentEntity> {
    const payment = await this.paymentRepository.findByPk(id);
    
    if (!payment) {
      throw new NotFoundException(`Pago con ID ${id} no encontrado`);
    }
    
    return new PaymentEntity(payment.toJSON());
  }

  async findByOrderId(orderId: string): Promise<PaymentEntity[]> {
    const payments = await this.paymentRepository.findAll({
      where: { order_id: orderId },
      order: [['created_at', 'DESC']],
    });
    
    return payments.map(payment => new PaymentEntity(payment.toJSON()));
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto): Promise<PaymentEntity> {
    const transaction = await this.sequelize.transaction();
    
    try {
      const payment = await this.paymentRepository.findByPk(id, { transaction });
      
      if (!payment) {
        throw new NotFoundException(`Pago con ID ${id} no encontrado`);
      }

      // Si el estado cambia a COMPLETED, actualizar paid_at
      if (updatePaymentDto.status === PaymentStatus.COMPLETED && payment.status !== PaymentStatus.COMPLETED) {
        updatePaymentDto.paid_at = new Date();
      }

      await payment.update(updatePaymentDto, { transaction });
      
      await transaction.commit();
      
      return new PaymentEntity(payment.toJSON());
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const transaction = await this.sequelize.transaction();
    
    try {
      const payment = await this.paymentRepository.findByPk(id, { transaction });
      
      if (!payment) {
        throw new NotFoundException(`Pago con ID ${id} no encontrado`);
      }

      // No permitir eliminar pagos completados
      if (payment.status === PaymentStatus.COMPLETED) {
        throw new BadRequestException('No se puede eliminar un pago completado');
      }

      await payment.destroy({ transaction });
      
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async processRefund(id: string, reason?: string): Promise<PaymentResponseDto> {
    const transaction = await this.sequelize.transaction();
    
    try {
      const payment = await this.paymentRepository.findByPk(id, { transaction });
      
      if (!payment) {
        throw new NotFoundException(`Pago con ID ${id} no encontrado`);
      }

      if (payment.status !== PaymentStatus.COMPLETED) {
        throw new BadRequestException('Solo se pueden reembolsar pagos completados');
      }

      // Aquí iría la lógica de integración con el gateway de pagos
      // Por ahora solo actualizamos el estado
      await payment.update({
        status: PaymentStatus.REFUNDED,
        notes: reason ? `Reembolsado: ${reason}` : payment.notes,
      }, { transaction });
      
      await transaction.commit();
      
      return new PaymentResponseDto(PaymentEntity.fromModel(payment));
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async getPaymentStats(userId?: string): Promise<any> {
    let where = {};
    if (userId) {
      where = { ...where, user_id: userId };
    }

    const stats = await this.paymentRepository.findAll({
      where,
      attributes: [
        'status',
        [this.sequelize.fn('COUNT', this.sequelize.col('id')), 'count'],
        [this.sequelize.fn('SUM', this.sequelize.col('amount')), 'total_amount'],
      ],
      group: ['status'],
    });

    return stats;
  }
}