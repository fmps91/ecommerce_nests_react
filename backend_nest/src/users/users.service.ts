// src/users/users.service.ts
import { Injectable, ConflictException, NotFoundException, Inject } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './models/user.model';
import { UserRole } from './entities/user.entity';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Sequelize } from 'sequelize-typescript';
import { PaginatedResponseDto } from './dto/paginated-response.dto';


export interface PaginationParams {
  page?: number;
  limit?: number;
}

@Injectable()
export class UsersService {
  constructor(
    @Inject('SEQUELIZE')
    private sequelize: Sequelize,
  ) {}

  private get userRepository() {
    return this.sequelize.getRepository(User);
  }

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
      paranoid: false, // Incluir usuarios eliminados
    });

    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return new UserEntity(user.toJSON());
  }

  async findAll(params?: PaginationParams): Promise<PaginatedResponseDto<UserEntity>> {
    // Valores por defecto
    const page = params?.page && params.page > 0 ? params.page : 1;
    const limit = params?.limit && params.limit > 0 ? params.limit : 10;
    
    // Calcular el offset
    const offset = (page - 1) * limit;

    // Ejecutar la consulta con paginación
    const { rows, count } = await this.userRepository.findAndCountAll({
      where: {
        isActive: true,
        //role: UserRole.CUSTOMER, // Solo usuarios regulares
      },
      order: [['createdAt', 'DESC']],
      limit,
      offset,
      distinct: true, // Importante para contar correctamente con joins
    });

    // Calcular metadatos de paginación
    const totalPages = Math.ceil(count / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    // Mapear los usuarios a entidades
    const data = rows.map(user => new UserEntity(user.toJSON()));

    // Retornar respuesta paginada
    return {
      data,
      meta: {
        total: count,
        page,
        limit,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    };
  }

  // Método simple sin paginación (para compatibilidad)
  async findAllSimple(): Promise<UserEntity[]> {
    const users = await this.userRepository.findAll({
      where: {
        isActive: true,
      },
      order: [['createdAt', 'DESC']],
    });
    return users.map(user => new UserEntity(user.toJSON()));
  }


  async findAllWithDeleted(): Promise<UserEntity[]> {
    const users = await this.userRepository.findAll({
      paranoid: false, // Incluir eliminados
    });
    return users.map(user => new UserEntity(user.toJSON()));
  }

  async findOne(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findByPk(id, {
      paranoid: false,
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return new UserEntity(user.toJSON());
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({
      where: { email },
      paranoid: false,
    });
    console.log('findByEmail result:', user ? user.toJSON() : null);

    return user ? new UserEntity(user.toJSON()) : null;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.userRepository.findByPk(id);
    
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    const data: any = { ...updateUserDto };

    if (updateUserDto.password) {
      data.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    await user.update(data);
    
    // Recargar para obtener los datos actualizados
    await user.reload();

    return new UserEntity(user.toJSON());
  }

  async remove(id: string): Promise<void> {
    const user = await this.userRepository.findByPk(id);
    
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    await user.destroy(); // Soft delete por paranoid: true
  }

  async delete(id: string): Promise<void> {
    const user = await this.userRepository.findByPk(id,{
      paranoid: false, // ¡Importante! Permite encontrar registros soft-deleted
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await user.destroy({ force: true }); // Hard delete
   
  }

  async toggleActive(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findByPk(id);
    
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    await user.update({ isActive: !user.isActive });
    await user.reload();

    return new UserEntity(user.toJSON());
  }

  async restore(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findByPk(id, {
      paranoid: false,
    });
    
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    await user.restore();
    await user.reload();

    return new UserEntity(user.toJSON());
  }

  async findAdmins(): Promise<UserEntity[]> {
    const admins = await this.userRepository.findAll({
      where: { 
        role: UserRole.ADMIN,
        isActive: true 
      },
    });

    return admins.map(admin => new UserEntity(admin.toJSON()));
  }

  async findByRole(role: UserRole): Promise<UserEntity[]> {
    const users = await this.userRepository.findAll({
      where: { 
        role,
        isActive: true 
      },
    });

    return users.map(user => new UserEntity(user.toJSON()));
  }

  async updatePassword(id: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findByPk(id);
    
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    await user.update({ password: newPassword });
  }

  
}