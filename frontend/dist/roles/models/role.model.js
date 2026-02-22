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
exports.Role = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const user_model_1 = require("../../users/models/user.model");
let Role = class Role extends sequelize_typescript_1.Model {
};
exports.Role = Role;
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        defaultValue: sequelize_typescript_1.DataType.UUIDV4,
        primaryKey: true,
    }),
    __metadata("design:type", String)
], Role.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Unique,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Role.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
    }),
    __metadata("design:type", String)
], Role.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        allowNull: true,
        defaultValue: [],
    }),
    __metadata("design:type", Array)
], Role.prototype, "permissions", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => user_model_1.User),
    __metadata("design:type", Array)
], Role.prototype, "users", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        field: 'created_at',
    }),
    __metadata("design:type", Date)
], Role.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        field: 'updated_at',
    }),
    __metadata("design:type", Date)
], Role.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.DeletedAt,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        field: 'deleted_at',
    }),
    __metadata("design:type", Date)
], Role.prototype, "deletedAt", void 0);
exports.Role = Role = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'roles',
        timestamps: true,
        paranoid: true,
        underscored: true,
    })
], Role);
//# sourceMappingURL=role.model.js.map