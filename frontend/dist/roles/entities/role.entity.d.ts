export declare class RoleEntity {
    id: string;
    name: string;
    description?: string;
    permissions: string[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    users?: any[];
    constructor(partial: Partial<RoleEntity>);
    get permissionsCount(): number;
    get hasPermissions(): boolean;
}
