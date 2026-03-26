// src/orders/models/order-detail.model.ts
import { 
  Table, 
  Column, 
  Model, 
  DataType, 
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt
} from 'sequelize-typescript';
import { Order } from './order.model';
import { Product } from '../../products/models/product.model';

@Table({
  tableName: 'order_details',
  timestamps: true,
  underscored: true,
})
export class OrderDetail extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @ForeignKey(() => Order)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'order_id',
  })
  declare orderId: string;

  @BelongsTo(() => Order)
  declare order: Order;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'product_id',
  })
  declare productId: string;

  @BelongsTo(() => Product)
  declare product: Product;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare productName: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  declare unitPrice: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  })
  declare quantity: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  declare subtotal: number;


  @CreatedAt
  @Column({
    type: DataType.DATE,
    field: 'created_at',
  })
  declare createdAt: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    field: 'updated_at',
  })
  declare updatedAt: Date;
}