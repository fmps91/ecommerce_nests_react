import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  HasMany,
} from 'sequelize-typescript';
import { CartItem } from './cart-item.model';

@Table({
  tableName: 'carts',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class Cart extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'user_id',
  })
  declare user_id?: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare total: number;

  @Column({
    type: DataType.ENUM('active', 'abandoned', 'completed'),
    allowNull: false,
    defaultValue: 'active',
  })
  declare status: 'active' | 'abandoned' | 'completed';

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

  @HasMany(() => CartItem)
  declare items: CartItem[];
}
