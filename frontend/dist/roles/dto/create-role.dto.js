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
exports.CreateRoleDto = void 0;
const api_property_decorator_1 = require("@nestjs/swagger/dist/decorators/api-property.decorator");
const class_validator_1 = require("class-validator");
class CreateRoleDto {
    name;
    description;
    permissions;
}
exports.CreateRoleDto = CreateRoleDto;
__decorate([
    (0, api_property_decorator_1.ApiProperty)({
        description: 'Name of the role',
        example: 'ADMIN',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateRoleDto.prototype, "name", void 0);
__decorate([
    (0, api_property_decorator_1.ApiProperty)({
        description: 'Description of the role',
        example: 'Administrator role with full permissions',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateRoleDto.prototype, "description", void 0);
__decorate([
    (0, api_property_decorator_1.ApiProperty)({
        description: 'Permissions for the role',
        example: ['view_products', 'create_orders'],
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateRoleDto.prototype, "permissions", void 0);
//# sourceMappingURL=create-role.dto.js.map