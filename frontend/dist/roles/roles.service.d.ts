import { User } from '../users/models/user.model';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { RoleEntity } from './entities/role.entity';
import { Sequelize } from 'sequelize-typescript';
export declare class RolesService {
    private sequelize;
    constructor(sequelize: Sequelize);
    get roleModel(): any;
    get userModel(): any;
    create(createRoleDto: CreateRoleDto): Promise<RoleEntity>;
    findAll(): Promise<RoleEntity[]>;
    findOne(id: string): Promise<RoleEntity>;
    findByName(name: string): Promise<RoleEntity>;
    update(id: string, updateRoleDto: UpdateRoleDto): Promise<RoleEntity>;
    remove(id: string): Promise<void>;
    assignRoleToUser(assignRoleDto: AssignRoleDto): Promise<User>;
    getRolePermissions(id: string): Promise<string[]>;
    addPermissions(id: string, permissions: string[]): Promise<RoleEntity>;
    removePermissions(id: string, permissions: string[]): Promise<RoleEntity>;
    getDefaultRole(): Promise<RoleEntity>;
}
