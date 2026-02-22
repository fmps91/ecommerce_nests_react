export declare class RoleResponseDto {
    id: string;
    name: string;
    description?: string;
    permissions: string[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    get permissionsCount(): number;
    constructor(partial: Partial<RoleResponseDto>);
}
