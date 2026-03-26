// src/users/models/user.model.ts
import { 
  Table, 
  Column, 
  Model, 
  DataType, 
  Default,
  Unique,
  IsEmail,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
  DeletedAt
} from 'sequelize-typescript';
import { Exclude } from 'class-transformer';
import { Role } from '../../rols/models/role.model';

@Table({
  tableName: 'users',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class User extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @IsEmail
  @Unique
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @Exclude()
  declare password: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @ForeignKey(() => Role)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'role_id',
  })
  declare roleId: string;

  @BelongsTo(() => Role)
  declare role: Role;

  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  declare isActive: boolean;

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