// src/orders/models/order.model.ts
import { 
  Table, 
  Column, 
  Model, 
  DataType, 
  Default,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  HasMany
} from 'sequelize-typescript';
import { User } from '../../users/models/user.model';
import { OrderDetail } from './order-detail.model';

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED'
}

// src/orders/models/order.model.ts
@Table({
  tableName: 'orders',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class Order extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'user_id',  // Importante: mapea userId → user_id
  })
  declare userId: string;

  @BelongsTo(() => User)
  declare user: User;


  @HasMany(() => OrderDetail)
  declare items: OrderDetail[];

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  declare total: number;

  @Column({
    type: DataType.ENUM(...Object.values(OrderStatus)),
    allowNull: false,
    defaultValue: OrderStatus.PENDING,
  })
  declare status: OrderStatus;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_paid',
  })
  declare isPaid: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare notes: string;

  @Column({
    type: DataType.JSON,
    allowNull: true,
    field: 'shipping_address',
  })
  declare shippingAddress: any;

  @Column({
    type: DataType.JSON,
    allowNull: true,
    field: 'billing_address',
  })
  declare billingAddress: any;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    field: 'created_at',
    defaultValue: DataType.NOW,
  })
  declare createdAt: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    field: 'updated_at',
  })
  declare updatedAt: Date;

  @DeletedAt
  @Column({
    type: DataType.DATE,
    field: 'deleted_at',
    allowNull: true,
  })
  declare deletedAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'paid_at',  // Asegura que mapea correctamente
  })
  declare paidAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'shipped_at',  // Asegura que mapea correctamente
  })
  declare shippedAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'delivered_at',  // Asegura que mapea correctamente
  })
  declare deliveredAt: Date;
}

