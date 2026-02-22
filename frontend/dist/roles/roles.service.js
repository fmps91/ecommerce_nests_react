"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesService = void 0;
const common_1 = require("@nestjs/common");
const role_model_1 = require("./models/role.model");
const user_model_1 = require("../users/models/user.model");
const role_entity_1 = require("./entities/role.entity");
const sequelize_1 = require("sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
let RolesService = class RolesService {
    sequelize;
    constructor(sequelize) {
        this.sequelize = sequelize;
    }
    get roleModel() {
        return this.sequelize.getRepository(role_model_1.Role);
    }
    get userModel() {
        return this.sequelize.getRepository(user_model_1.User);
    }
    async create(createRoleDto) {
        const existingRole = await this.roleModel.findOne({
            where: { name: createRoleDto.name },
        });
        if (existingRole) {
            throw new common_1.ConflictException(`Role with name ${createRoleDto.name} already exists`);
        }
        const role = await this.roleModel.create({
            ...createRoleDto,
        });
        return new role_entity_1.RoleEntity(role.toJSON());
    }
    async findAll() {
        const roles = await this.roleModel.findAll({
            include: [user_model_1.User],
            order: [['name', 'ASC']],
        });
        return roles.map(role => new role_entity_1.RoleEntity(role.toJSON()));
    }
    async findOne(id) {
        const role = await this.roleModel.findByPk(id, {
            include: [user_model_1.User],
        });
        if (!role) {
            throw new common_1.NotFoundException(`Role with ID ${id} not found`);
        }
        return new role_entity_1.RoleEntity(role.toJSON());
    }
    async findByName(name) {
        const role = await this.roleModel.findOne({
            where: { name },
            include: [user_model_1.User],
        });
        if (!role) {
            throw new common_1.NotFoundException(`Role with name ${name} not found`);
        }
        return new role_entity_1.RoleEntity(role.toJSON());
    }
    async update(id, updateRoleDto) {
        const role = await this.roleModel.findByPk(id);
        if (!role) {
            throw new common_1.NotFoundException(`Role with ID ${id} not found`);
        }
        if (updateRoleDto.name && updateRoleDto.name !== role.name) {
            const existingRole = await this.roleModel.findOne({
                where: {
                    name: updateRoleDto.name,
                    id: { [sequelize_1.Op.ne]: id }
                },
            });
            if (existingRole) {
                throw new common_1.ConflictException(`Role with name ${updateRoleDto.name} already exists`);
            }
        }
        await role.update(updateRoleDto);
        await role.reload({ include: [user_model_1.User] });
        return new role_entity_1.RoleEntity(role.toJSON());
    }
    async remove(id) {
        const role = await this.roleModel.findByPk(id);
        if (!role) {
            throw new common_1.NotFoundException(`Role with ID ${id} not found`);
        }
        const usersCount = await this.userModel.count({
            where: { roleId: id },
        });
        if (usersCount > 0) {
            throw new common_1.ConflictException(`Cannot delete role with ${usersCount} assigned users`);
        }
        await role.destroy();
    }
    async assignRoleToUser(assignRoleDto) {
        const { userId, roleId } = assignRoleDto;
        const user = await this.userModel.findByPk(userId);
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found`);
        }
        const role = await this.roleModel.findByPk(roleId);
        if (!role) {
            throw new common_1.NotFoundException(`Role with ID ${roleId} not found`);
        }
        await user.update({ roleId });
        await user.reload({ include: [role_model_1.Role] });
        return user;
    }
    async getRolePermissions(id) {
        const role = await this.roleModel.findByPk(id);
        if (!role) {
            throw new common_1.NotFoundException(`Role with ID ${id} not found`);
        }
        return role.permissions || [];
    }
    async addPermissions(id, permissions) {
        const role = await this.roleModel.findByPk(id);
        if (!role) {
            throw new common_1.NotFoundException(`Role with ID ${id} not found`);
        }
        const currentPermissions = role.permissions || [];
        const newPermissions = [...new Set([...currentPermissions, ...permissions])];
        await role.update({ permissions: newPermissions });
        await role.reload({ include: [user_model_1.User] });
        return new role_entity_1.RoleEntity(role.toJSON());
    }
    async removePermissions(id, permissions) {
        const role = await this.roleModel.findByPk(id);
        if (!role) {
            throw new common_1.NotFoundException(`Role with ID ${id} not found`);
        }
        const currentPermissions = role.permissions || [];
        const newPermissions = currentPermissions.filter(p => !permissions.includes(p));
        await role.update({ permissions: newPermissions });
        await role.reload({ include: [user_model_1.User] });
        return new role_entity_1.RoleEntity(role.toJSON());
    }
    async getDefaultRole() {
        let role = await this.roleModel.findOne({
            where: { name: 'CUSTOMER' },
        });
        if (!role) {
            role = await this.roleModel.create({
                name: 'CUSTOMER',
                description: 'Default customer role',
                permissions: ['view_products', 'create_orders', 'view_own_orders'],
            });
        }
        return new role_entity_1.RoleEntity(role.toJSON());
    }
};
exports.RolesService = RolesService;
exports.RolesService = RolesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('SEQUELIZE')),
    __metadata("design:paramtypes", [typeof (_a = typeof sequelize_typescript_1.Sequelize !== "undefined" && sequelize_typescript_1.Sequelize) === "function" ? _a : Object])
], RolesService);
//# sourceMappingURL=roles.service.js.map