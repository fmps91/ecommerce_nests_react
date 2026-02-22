import { UserRole } from '../entities/user.entity';
export declare class UserResponseDto {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<UserResponseDto>);
}
