import { 
  Table, 
  Column, 
  Model, 
  DataType, 
  ForeignKey, 
  BelongsTo,
  CreatedAt,
  UpdatedAt,
  DeletedAt
} from 'sequelize-typescript';
import { Order } from '../../orders/models/order.model';
import { User } from '../../users/models/user.model';

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled'
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  PAYPAL = 'paypal',
  BANK_TRANSFER = 'bank_transfer',
  CASH = 'cash',
  OTHER = 'other'
}

@Table({ 
  tableName: 'payments',
  timestamps: true,
  underscored: true,
  paranoid: true
})
export class Payment extends Model<Payment> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;  // ✅ Quitar 'declare'

  @ForeignKey(() => Order)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  order_id: string;

  @BelongsTo(() => Order)
  order: Order;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  user_id: string;

  @BelongsTo(() => User)
  user: User;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,
    },
  })
  amount: number;

  @Column({
    type: DataType.ENUM(...Object.values(PaymentMethod)),
    allowNull: false,
  })
  payment_method: PaymentMethod;

  @Column({
    type: DataType.ENUM(...Object.values(PaymentStatus)),
    defaultValue: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  transaction_id: string | null;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    comment: 'Datos adicionales del pago como respuesta del gateway',
  })
  metadata: any;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  paid_at: Date | null;  // ✅ Cambiar a Date | null

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  notes: string | null;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}