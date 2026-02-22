// src/roles/models/role.model.ts
import { 
  Table, 
  Column, 
  Model, 
  DataType, 
  Default,
  Unique,
  HasMany,
  CreatedAt,
  UpdatedAt,
  DeletedAt
} from 'sequelize-typescript';
import { User } from '../../users/models/user.model';

@Table({
  tableName: 'roles',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class Role extends Model {
  @Column({
    type: DataType.STRING,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Unique
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare description: string;

  @Column({
    type: DataType.JSON,
    allowNull: true,
    defaultValue: [],
  })
  declare permissions: string[];

  @HasMany(() => User)
  declare users: User[];

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

  @DeletedAt
  @Column({
    type: DataType.DATE,
    field: 'deleted_at',
  })
  declare deletedAt: Date;
}