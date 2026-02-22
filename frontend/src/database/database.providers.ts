import { Sequelize } from 'sequelize-typescript';
import { Role } from 'src/roles/models/role.model';
import { User } from 'src/users/models/user.model';


export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
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
          timestamps: true, // Añade createdAt y updatedAt automáticamente
          underscored: true, // Usa snake_case para nombres de columnas
          paranoid: true, // Soft deletes (deletedAt)
        },
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
      });

      sequelize.addModels([User,Role]);
      
      // Sincroniza los modelos con la base de datos
      // En producción, considera usar migraciones en lugar de sync()
      await sequelize.sync({ 
        alter: process.env.NODE_ENV === 'development',
        force: false 
      });
      
      return sequelize;
    },
  },
];