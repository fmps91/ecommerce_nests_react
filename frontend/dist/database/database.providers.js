"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseProviders = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const role_model_1 = require("../roles/models/role.model");
const user_model_1 = require("../users/models/user.model");
exports.databaseProviders = [
    {
        provide: 'SEQUELIZE',
        useFactory: async () => {
            const sequelize = new sequelize_typescript_1.Sequelize({
                dialect: 'postgres',
                host: process.env.DB_HOST || 'localhost',
                port: parseInt(process.env.DB_PORT || '5432', 10),
                username: process.env.DB_USER || 'postgresql',
                password: process.env.DB_PASSWORD || 'postgresql',
                database: process.env.DB_NAME || 'nest',
                dialectOptions: {
                    ssl: process.env.DB_SSL === 'true' ? {
                        require: true,
                        rejectUnauthorized: false
                    } : false
                },
                define: {
                    timestamps: true,
                    underscored: true,
                    paranoid: true,
                },
                logging: process.env.NODE_ENV === 'development' ? console.log : false,
            });
            sequelize.addModels([user_model_1.User, role_model_1.Role]);
            await sequelize.sync({
                alter: process.env.NODE_ENV === 'development',
                force: false
            });
            return sequelize;
        },
    },
];
//# sourceMappingURL=database.providers.js.map