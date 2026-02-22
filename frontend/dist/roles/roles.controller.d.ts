import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { RoleResponseDto } from './dto/role-response.dto';
export declare class RolesController {
    private readonly rolesService;
    constructor(rolesService: RolesService);
    create(createRoleDto: CreateRoleDto): Promise<RoleResponseDto>;
    findAll(): Promise<RoleResponseDto[]>;
    getDefaultRole(): Promise<RoleResponseDto>;
    findOne(id: string): Promise<RoleResponseDto>;
    findByName(name: string): Promise<RoleResponseDto>;
    getPermissions(id: string): Promise<string[]>;
    update(id: string, updateRoleDto: UpdateRoleDto): Promise<RoleResponseDto>;
    addPermissions(id: string, permissions: string[]): Promise<RoleResponseDto>;
    removePermissions(id: string, permissions: string[]): Promise<RoleResponseDto>;
    assignRoleToUser(assignRoleDto: AssignRoleDto): Promise<{
        message: string;
        user: {
            id: string;
            email: string;
            roleId: string;
        };
    }>;
    remove(id: string): Promise<void>;
}
