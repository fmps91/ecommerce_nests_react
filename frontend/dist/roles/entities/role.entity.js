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
exports.RoleEntity = void 0;
const class_transformer_1 = require("class-transformer");
class RoleEntity {
    id;
    name;
    description;
    permissions;
    createdAt;
    updatedAt;
    deletedAt;
    users;
    constructor(partial) {
        Object.assign(this, partial);
    }
    get permissionsCount() {
        return this.permissions?.length || 0;
    }
    get hasPermissions() {
        return this.permissions && this.permissions.length > 0;
    }
}
exports.RoleEntity = RoleEntity;
__decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", Date)
], RoleEntity.prototype, "deletedAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [])
], RoleEntity.prototype, "permissionsCount", null);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], RoleEntity.prototype, "hasPermissions", null);
//# sourceMappingURL=role.entity.js.map