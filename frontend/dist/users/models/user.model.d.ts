import { Model } from 'sequelize-typescript';
import { Role } from '../../roles/models/role.model';
export declare class User extends Model {
    id: string;
    email: string;
    password: string;
    name: string;
    roleId: string;
    role: Role;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
