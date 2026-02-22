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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const user_entity_1 = require("../entities/user.entity");
let UserResponseDto = class UserResponseDto {
    id;
    email;
    name;
    role;
    isActive;
    createdAt;
    updatedAt;
    constructor(partial) {
        Object.assign(this, partial);
    }
};
exports.UserResponseDto = UserResponseDto;
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'idv4 del usuario',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Email del usuario',
        example: 'f1@ejemplo.com',
    }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "email", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Nombre completo del usuario',
        example: 'Juan Pérez'
    }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "name", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Rol del usuario',
        enum: user_entity_1.UserRole, example: user_entity_1.UserRole.CUSTOMER
    }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "role", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Estado activo del usuario',
        example: true
    }),
    __metadata("design:type", Boolean)
], UserResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de creación del usuario',
        example: '2024-01-01T00:00:00.000Z'
    }),
    __metadata("design:type", Date)
], UserResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de actualización del usuario',
        example: '2024-01-01T00:00:00.000Z'
    }),
    __metadata("design:type", Date)
], UserResponseDto.prototype, "updatedAt", void 0);
exports.UserResponseDto = UserResponseDto = __decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:paramtypes", [Object])
], UserResponseDto);
//# sourceMappingURL=user-response.dto.js.map