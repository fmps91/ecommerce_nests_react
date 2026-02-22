import { Model } from 'sequelize-typescript';
import { User } from '../../users/models/user.model';
export declare class Role extends Model {
    id: string;
    name: string;
    description: string;
    permissions: string[];
    users: User[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
