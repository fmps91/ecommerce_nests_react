"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const user_model_1 = require("./models/user.model");
const user_entity_1 = require("./entities/user.entity");
const user_entity_2 = require("./entities/user.entity");
const bcrypt = __importStar(require("bcrypt"));
const sequelize_typescript_1 = require("sequelize-typescript");
let UsersService = class UsersService {
    sequelize;
    constructor(sequelize) {
        this.sequelize = sequelize;
    }
    get userRepository() {
        return this.sequelize.getRepository(user_model_1.User);
    }
    async create(createUserDto) {
        const existingUser = await this.userRepository.findOne({
            where: { email: createUserDto.email },
            paranoid: false,
        });
        if (existingUser) {
            throw new common_1.ConflictException('El email ya está registrado');
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const user = await this.userRepository.create({
            ...createUserDto,
            password: hashedPassword,
        });
        return new user_entity_2.UserEntity(user.toJSON());
    }
    async findAll() {
        const users = await this.userRepository.findAll({
            where: {
                isActive: true,
            },
        });
        return users.map(user => new user_entity_2.UserEntity(user.toJSON()));
    }
    async findAllWithDeleted() {
        const users = await this.userRepository.findAll({
            paranoid: false,
        });
        return users.map(user => new user_entity_2.UserEntity(user.toJSON()));
    }
    async findOne(id) {
        const user = await this.userRepository.findByPk(id, {
            paranoid: false,
        });
        if (!user) {
            throw new common_1.NotFoundException(`Usuario con ID ${id} no encontrado`);
        }
        return new user_entity_2.UserEntity(user.toJSON());
    }
    async findByEmail(email) {
        const user = await this.userRepository.findOne({
            where: { email },
            paranoid: false,
        });
        return user ? new user_entity_2.UserEntity(user.toJSON()) : null;
    }
    async update(id, updateUserDto) {
        const user = await this.userRepository.findByPk(id);
        if (!user) {
            throw new common_1.NotFoundException(`Usuario con ID ${id} no encontrado`);
        }
        const data = { ...updateUserDto };
        if (updateUserDto.password) {
            data.password = await bcrypt.hash(updateUserDto.password, 10);
        }
        await user.update(data);
        await user.reload();
        return new user_entity_2.UserEntity(user.toJSON());
    }
    async remove(id) {
        const user = await this.userRepository.findByPk(id);
        if (!user) {
            throw new common_1.NotFoundException(`Usuario con ID ${id} no encontrado`);
        }
        await user.destroy();
    }
    async hardRemove(id) {
        const user = await this.userRepository.findByPk(id, {
            paranoid: false,
        });
        if (!user) {
            throw new common_1.NotFoundException(`Usuario con ID ${id} no encontrado`);
        }
        await user.destroy({ force: true });
    }
    async toggleActive(id) {
        const user = await this.userRepository.findByPk(id);
        if (!user) {
            throw new common_1.NotFoundException(`Usuario con ID ${id} no encontrado`);
        }
        await user.update({ isActive: !user.isActive });
        await user.reload();
        return new user_entity_2.UserEntity(user.toJSON());
    }
    async restore(id) {
        const user = await this.userRepository.findByPk(id, {
            paranoid: false,
        });
        if (!user) {
            throw new common_1.NotFoundException(`Usuario con ID ${id} no encontrado`);
        }
        await user.restore();
        await user.reload();
        return new user_entity_2.UserEntity(user.toJSON());
    }
    async findAdmins() {
        const admins = await this.userRepository.findAll({
            where: {
                role: user_entity_1.UserRole.ADMIN,
                isActive: true
            },
        });
        return admins.map(admin => new user_entity_2.UserEntity(admin.toJSON()));
    }
    async findByRole(role) {
        const users = await this.userRepository.findAll({
            where: {
                role,
                isActive: true
            },
        });
        return users.map(user => new user_entity_2.UserEntity(user.toJSON()));
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('SEQUELIZE')),
    __metadata("design:paramtypes", [typeof (_a = typeof sequelize_typescript_1.Sequelize !== "undefined" && sequelize_typescript_1.Sequelize) === "function" ? _a : Object])
], UsersService);
//# sourceMappingURL=users.service.js.map