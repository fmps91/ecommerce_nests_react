import { Exclude } from 'class-transformer';



export enum UserRole {
  ADMIN = 'ADMIN',
  SELLER = 'SELLER',
  CUSTOMER = 'CUSTOMER'
}

export class UserEntity {
  id: string;
  email: string;
  name: string;
  roleId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  @Exclude()
  password?: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}