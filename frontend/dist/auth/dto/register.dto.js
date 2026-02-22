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
exports.RegisterDto = void 0;
const class_validator_1 = require("class-validator");
const api_property_decorator_1 = require("@nestjs/swagger/dist/decorators/api-property.decorator");
class RegisterDto {
    email;
    password;
    name;
    roleId;
}
exports.RegisterDto = RegisterDto;
__decorate([
    (0, api_property_decorator_1.ApiProperty)({
        description: 'Email del usuario',
        example: 'user@example.com'
    }),
    (0, class_validator_1.IsEmail)({}, { message: 'El email debe ser válido' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
__decorate([
    (0, api_property_decorator_1.ApiProperty)({
        description: 'Contraseña del usuario',
        example: 'password123'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
    (0, class_validator_1.MaxLength)(50, { message: 'La contraseña no puede exceder los 50 caracteres' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
__decorate([
    (0, api_property_decorator_1.ApiProperty)({
        description: 'Nombre del rol',
        example: 'CUSTOMER'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3, { message: 'El nombre debe tener al menos 3 caracteres' }),
    (0, class_validator_1.MaxLength)(100, { message: 'El nombre no puede exceder los 100 caracteres' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "name", void 0);
__decorate([
    (0, api_property_decorator_1.ApiProperty)({
        description: 'idRol del usuario',
        example: '8a7146bb-be52-4655-b1d0-079933834a6c',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "roleId", void 0);
//# sourceMappingURL=register.dto.js.map