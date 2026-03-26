import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  BelongsTo,
} from 'sequelize-typescript';
import { Cart } from './cart.model';
import { Product } from '../../products/models/product.model';

@Table({
  tableName: 'cart_items',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class CartItem extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'cart_id',
  })
  declare cart_id: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'product_id',
  })
  declare product_id: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare quantity: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    field: 'unit_price',
  })
  declare unit_price: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    field: 'subtotal',
  })
  declare subtotal: number;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    field: 'created_at',
  })
  declare created_at: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    field: 'updated_at',
  })
  declare updated_at: Date;

  @DeletedAt
  @Column({
    type: DataType.DATE,
    field: 'deleted_at',
  })
  declare deleted_at?: Date;

  @BelongsTo(() => Cart, 'cart_id')
  declare cart: Cart;

  @BelongsTo(() => Product, 'product_id')
  declare product: Product;
}
