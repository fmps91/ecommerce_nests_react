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
exports.RoleResponseDto = void 0;
const api_property_decorator_1 = require("@nestjs/swagger/dist/decorators/api-property.decorator");
const class_transformer_1 = require("class-transformer");
class RoleResponseDto {
    id;
    name;
    description;
    permissions;
    createdAt;
    updatedAt;
    deletedAt;
    get permissionsCount() {
        return this.permissions?.length || 0;
    }
    constructor(partial) {
        Object.assign(this, partial);
    }
}
exports.RoleResponseDto = RoleResponseDto;
__decorate([
    (0, api_property_decorator_1.ApiProperty)({
        description: 'ID of the role',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], RoleResponseDto.prototype, "id", void 0);
__decorate([
    (0, api_property_decorator_1.ApiProperty)({
        description: 'Name of the role',
        example: 'name of the role',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], RoleResponseDto.prototype, "name", void 0);
__decorate([
    (0, api_property_decorator_1.ApiProperty)({
        description: 'Description of the role',
        example: 'Administrator role with full permissions',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], RoleResponseDto.prototype, "description", void 0);
__decorate([
    (0, api_property_decorator_1.ApiProperty)({
        description: 'Permissions for the role',
        example: ['view_products', 'create_orders'],
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Array)
], RoleResponseDto.prototype, "permissions", void 0);
__decorate([
    (0, api_property_decorator_1.ApiProperty)({
        description: 'Creation date of the role',
        example: '2023-01-01T00:00:00.000Z',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], RoleResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, api_property_decorator_1.ApiProperty)({
        description: 'Last update date of the role',
        example: '2023-01-01T00:00:00.000Z',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], RoleResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, api_property_decorator_1.ApiProperty)({
        description: 'Deletion date of the role (if deleted)',
        example: '2023-01-01T00:00:00.000Z',
    }),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", Date)
], RoleResponseDto.prototype, "deletedAt", void 0);
__decorate([
    (0, api_property_decorator_1.ApiProperty)({
        description: 'Number of permissions for the role',
        example: 2,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [])
], RoleResponseDto.prototype, "permissionsCount", null);
//# sourceMappingURL=role-response.dto.js.map