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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const user_response_dto_1 = require("./dto/user-response.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_entity_1 = require("./entities/user.entity");
const swagger_1 = require("@nestjs/swagger");
let UsersController = class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    async create(createUserDto) {
        const user = await this.usersService.create(createUserDto);
        return new user_response_dto_1.UserResponseDto(user);
    }
    async findAll() {
        const users = await this.usersService.findAll();
        return users.map(user => new user_response_dto_1.UserResponseDto(user));
    }
    async findOne(id) {
        const user = await this.usersService.findOne(id);
        return new user_response_dto_1.UserResponseDto(user);
    }
    async update(id, updateUserDto) {
        const user = await this.usersService.update(id, updateUserDto);
        return new user_response_dto_1.UserResponseDto(user);
    }
    async remove(id) {
        await this.usersService.remove(id);
    }
    async toggleActive(id) {
        const user = await this.usersService.toggleActive(id);
        return new user_response_dto_1.UserResponseDto(user);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Crear un nuevo usuario' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Usuario creado exitosamente',
        type: user_response_dto_1.UserResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos inválidos' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'El email ya está registrado' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todos los usuarios (solo administradores)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de usuarios obtenida exitosamente',
        type: [user_response_dto_1.UserResponseDto]
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'No tiene permisos de administrador' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener un usuario por ID' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID del usuario (UUID v4)',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Usuario encontrado',
        type: user_response_dto_1.UserResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Usuario no encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar un usuario' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID del usuario (UUID v4)',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Usuario actualizado exitosamente',
        type: user_response_dto_1.UserResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos inválidos' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Usuario no encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar un usuario (solo administradores)' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID del usuario (UUID v4)',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Usuario eliminado exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'No tiene permisos de administrador' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Usuario no encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/toggle-active'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Activar/desactivar un usuario (solo administradores)' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID del usuario (UUID v4)',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Estado del usuario actualizado',
        type: user_response_dto_1.UserResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'No tiene permisos de administrador' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Usuario no encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "toggleActive", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.SerializeOptions)({
        excludeExtraneousValues: true,
    }),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map