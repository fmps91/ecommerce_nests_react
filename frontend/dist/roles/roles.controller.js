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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesController = void 0;
const common_1 = require("@nestjs/common");
const roles_service_1 = require("./roles.service");
const create_role_dto_1 = require("./dto/create-role.dto");
const update_role_dto_1 = require("./dto/update-role.dto");
const assign_role_dto_1 = require("./dto/assign-role.dto");
const role_response_dto_1 = require("./dto/role-response.dto");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const swagger_1 = require("@nestjs/swagger");
let RolesController = class RolesController {
    rolesService;
    constructor(rolesService) {
        this.rolesService = rolesService;
    }
    async create(createRoleDto) {
        const role = await this.rolesService.create(createRoleDto);
        return new role_response_dto_1.RoleResponseDto(role);
    }
    async findAll() {
        const roles = await this.rolesService.findAll();
        return roles.map(role => new role_response_dto_1.RoleResponseDto(role));
    }
    async getDefaultRole() {
        const role = await this.rolesService.getDefaultRole();
        return new role_response_dto_1.RoleResponseDto(role);
    }
    async findOne(id) {
        const role = await this.rolesService.findOne(id);
        return new role_response_dto_1.RoleResponseDto(role);
    }
    async findByName(name) {
        const role = await this.rolesService.findByName(name);
        return new role_response_dto_1.RoleResponseDto(role);
    }
    async getPermissions(id) {
        return this.rolesService.getRolePermissions(id);
    }
    async update(id, updateRoleDto) {
        const role = await this.rolesService.update(id, updateRoleDto);
        return new role_response_dto_1.RoleResponseDto(role);
    }
    async addPermissions(id, permissions) {
        const role = await this.rolesService.addPermissions(id, permissions);
        return new role_response_dto_1.RoleResponseDto(role);
    }
    async removePermissions(id, permissions) {
        const role = await this.rolesService.removePermissions(id, permissions);
        return new role_response_dto_1.RoleResponseDto(role);
    }
    async assignRoleToUser(assignRoleDto) {
        const user = await this.rolesService.assignRoleToUser(assignRoleDto);
        return {
            message: 'Role assigned successfully',
            user: {
                id: user.id,
                email: user.email,
                roleId: user.roleId,
            },
        };
    }
    async remove(id) {
        await this.rolesService.remove(id);
    }
};
exports.RolesController = RolesController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_role_dto_1.CreateRoleDto]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('default'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "getDefaultRole", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('name/:name'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "findByName", null);
__decorate([
    (0, common_1.Get)(':id/permissions'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "getPermissions", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiBody)({ type: update_role_dto_1.UpdateRoleDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_role_dto_1.UpdateRoleDto]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/permissions/add'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiBody)({ type: [String] }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('permissions')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "addPermissions", null);
__decorate([
    (0, common_1.Patch)(':id/permissions/remove'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiBody)({ type: [String] }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "removePermissions", null);
__decorate([
    (0, common_1.Post)('assign'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [assign_role_dto_1.AssignRoleDto]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "assignRoleToUser", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "remove", null);
exports.RolesController = RolesController = __decorate([
    (0, common_1.Controller)('roles'),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    __metadata("design:paramtypes", [roles_service_1.RolesService])
], RolesController);
//# sourceMappingURL=roles.controller.js.map