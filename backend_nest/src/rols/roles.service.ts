// src/roles/roles.service.ts
import { Injectable, NotFoundException, ConflictException, Inject } from '@nestjs/common';

import { Role } from './models/role.model';
import { User } from '../users/models/user.model';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { RoleEntity } from './entities/role.entity';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';


@Injectable()
export class RolesService {
  constructor(
     @Inject('SEQUELIZE')
        private sequelize: Sequelize,
  ) {}

  get rolRepository() {
    return this.sequelize.getRepository(Role);
  }

  get userRepository() {
    return this.sequelize.getRepository(User);
  }

  async create(createRoleDto: CreateRoleDto): Promise<RoleEntity> {
    // Verificar si ya existe un rol con ese nombre
    const existingRole = await this.rolRepository.findOne({
      where: { name: createRoleDto.name },
    });

    if (existingRole) {
      throw new ConflictException(`Role with name ${createRoleDto.name} already exists`);
    }

    const role = await this.rolRepository.create({
      ...createRoleDto,
    });

    return new RoleEntity(role.toJSON());
  }

  async findAll(): Promise<RoleEntity[]> {
    const roles = await this.rolRepository.findAll({
      include: [User],
      order: [['name', 'ASC']],
    });

    return roles.map(role => new RoleEntity(role.toJSON()));
  }

  async findOne(id: string): Promise<RoleEntity> {
    const role = await this.rolRepository.findByPk(id, {
      include: [User],
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    return new RoleEntity(role.toJSON());
  }

  async findByName(name: string): Promise<RoleEntity> {
    const role = await this.rolRepository.findOne({
      where: { name },
      include: [User],
    });

    if (!role) {
      throw new NotFoundException(`Role with name ${name} not found`);
    }

    return new RoleEntity(role.toJSON());
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<RoleEntity> {
    const role = await this.rolRepository.findByPk(id);

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    // Si está actualizando el nombre, verificar que no exista otro con ese nombre
    if (updateRoleDto.name && updateRoleDto.name !== role.name) {
      const existingRole = await this.rolRepository.findOne({
        where: { 
          name: updateRoleDto.name,
          id: { [Op.ne]: id }
        },
      });

      if (existingRole) {
        throw new ConflictException(`Role with name ${updateRoleDto.name} already exists`);
      }
    }

    await role.update(updateRoleDto);
    await role.reload({ include: [User] });

    return new RoleEntity(role.toJSON());
  }

  async remove(id: string): Promise<void> {
    const role = await this.rolRepository.findByPk(id);

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    // Verificar si hay usuarios usando este rol
    const usersCount = await this.userRepository.count({
      where: { roleId: id },
    });

    if (usersCount > 0) {
      throw new ConflictException(`Cannot delete role with ${usersCount} assigned users`);
    }

    await role.destroy();
  }

  

  async assignRoleToUser(assignRoleDto: AssignRoleDto): Promise<User> {
    const { userId, roleId } = assignRoleDto;

    const user = await this.userRepository.findByPk(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const role = await this.rolRepository.findByPk(roleId);
    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    await user.update({ roleId });
    await user.reload({ include: [Role] });

    return user;
  }

  async getRolePermissions(id: string): Promise<string[]> {
    const role = await this.rolRepository.findByPk(id);

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    return role.permissions || [];
  }

  async addPermissions(id: string, permissions: string[]): Promise<RoleEntity> {
    const role = await this.rolRepository.findByPk(id);

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    const currentPermissions = role.permissions || [];
    const newPermissions = [...new Set([...currentPermissions, ...permissions])];

    await role.update({ permissions: newPermissions });
    await role.reload({ include: [User] });

    return new RoleEntity(role.toJSON());
  }

  async removePermissions(id: string, permissions: string[]): Promise<RoleEntity> {
    const role = await this.rolRepository.findByPk(id);

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    const currentPermissions = role.permissions || [];
    

    const newPermissions = currentPermissions.filter(p => permissions["permissions"].indexOf(p) === -1);
    await role.update({ permissions: newPermissions });
    await role.reload({ include: [User] });

    return new RoleEntity(role.toJSON());
  }

  async getDefaultRole(): Promise<RoleEntity> {
    // Buscar o crear el rol por defecto (CUSTOMER)
    let role = await this.rolRepository.findOne({
      where: { name: 'CUSTOMER' },
    });

    if (!role) {
      role = await this.rolRepository.create({
        name: 'CUSTOMER',
        description: 'Default customer role',
        permissions: ['view_products', 'create_orders', 'view_own_orders'],
      });
    }

    return new RoleEntity(role.toJSON());
  }

  async delete(id: string): Promise<void> {
    const rol = await this.rolRepository.findByPk(id,{
      paranoid: false, // ¡Importante! Permite encontrar registros soft-deleted
    });

    if (!rol) {
      throw new NotFoundException(`Rol with ID ${id} not found`);
    }

    await rol.destroy({ force: true }); // Hard delete
   
  }
}
