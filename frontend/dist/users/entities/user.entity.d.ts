export declare enum UserRole {
    ADMIN = "ADMIN",
    SELLER = "SELLER",
    CUSTOMER = "CUSTOMER"
}
export declare class UserEntity {
    id: string;
    email: string;
    name: string;
    roleId: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    password?: string;
    constructor(partial: Partial<UserEntity>);
}
