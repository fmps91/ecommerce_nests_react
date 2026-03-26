import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from '../roles.service';
import { Sequelize } from 'sequelize-typescript';
import { Role } from '../models/role.model';
import { User } from '../../users/models/user.model';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { AssignRoleDto } from '../dto/assign-role.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { RoleEntity } from '../entities/role.entity';

describe('RolesService', () => {
  let service: RolesService;
  let sequelize: Sequelize;
  let roleRepository: any;
  let userRepository: any;

  const mockRole = {
    id: 'test-role-id',
    name: 'ADMIN',
    description: 'Administrator role',
    permissions: ['read', 'write', 'delete'],
    createdAt: new Date(),
    updatedAt: new Date(),
    toJSON: () => ({
      id: 'test-role-id',
      name: 'ADMIN',
      description: 'Administrator role',
      permissions: ['read', 'write', 'delete'],
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    update: jest.fn(),
    reload: jest.fn(),
    destroy: jest.fn(),
  };

  const mockUser = {
    id: 'test-user-id',
    email: 'test@example.com',
    roleId: 'test-role-id',
    update: jest.fn(),
    reload: jest.fn(),
  };

  beforeEach(async () => {
    const mockSequelize = {
      getRepository: jest.fn(),
    };

    roleRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findByPk: jest.fn(),
      findOne: jest.fn(),
      count: jest.fn(),
    };

    userRepository = {
      findByPk: jest.fn(),
      count: jest.fn(),
    };

    mockSequelize.getRepository.mockImplementation((model) => {
      if (model === Role) return roleRepository;
      if (model === User) return userRepository;
      return null;
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: 'SEQUELIZE',
          useValue: mockSequelize,
        },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
    sequelize = module.get<Sequelize>('SEQUELIZE');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a role successfully', async () => {
      const createRoleDto: CreateRoleDto = {
        name: 'ADMIN',
        description: 'Administrator role',
        permissions: ['read', 'write'],
      };

      roleRepository.findOne.mockResolvedValue(null);
      roleRepository.create.mockResolvedValue(mockRole);

      const result = await service.create(createRoleDto);

      expect(result).toBeInstanceOf(RoleEntity);
      expect(roleRepository.findOne).toHaveBeenCalledWith({
        where: { name: createRoleDto.name },
      });
      expect(roleRepository.create).toHaveBeenCalledWith(createRoleDto);
    });

    it('should throw ConflictException if role already exists', async () => {
      const createRoleDto: CreateRoleDto = {
        name: 'ADMIN',
      };

      roleRepository.findOne.mockResolvedValue(mockRole);

      await expect(service.create(createRoleDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all roles', async () => {
      const mockRoles = [mockRole];
      roleRepository.findAll.mockResolvedValue(mockRoles);

      const result = await service.findAll();

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(RoleEntity);
      expect(roleRepository.findAll).toHaveBeenCalledWith({
        include: [User],
        order: [['name', 'ASC']],
      });
    });
  });

  describe('findOne', () => {
    it('should return a role by id', async () => {
      roleRepository.findByPk.mockResolvedValue(mockRole);

      const result = await service.findOne('test-role-id');

      expect(result).toBeInstanceOf(RoleEntity);
      expect(roleRepository.findByPk).toHaveBeenCalledWith('test-role-id', {
        include: [User],
      });
    });

    it('should throw NotFoundException if role not found', async () => {
      roleRepository.findByPk.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByName', () => {
    it('should return a role by name', async () => {
      roleRepository.findOne.mockResolvedValue(mockRole);

      const result = await service.findByName('ADMIN');

      expect(result).toBeInstanceOf(RoleEntity);
      expect(roleRepository.findOne).toHaveBeenCalledWith({
        where: { name: 'ADMIN' },
        include: [User],
      });
    });

    it('should throw NotFoundException if role not found by name', async () => {
      roleRepository.findOne.mockResolvedValue(null);

      await expect(service.findByName('NON_EXISTENT')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a role successfully', async () => {
      const updateRoleDto: UpdateRoleDto = {
        description: 'Updated description',
      };

      roleRepository.findByPk.mockResolvedValue(mockRole);
      mockRole.update.mockResolvedValue(mockRole);
      mockRole.reload.mockResolvedValue(mockRole);

      const result = await service.update('test-role-id', updateRoleDto);

      expect(result).toBeInstanceOf(RoleEntity);
      expect(mockRole.update).toHaveBeenCalledWith(updateRoleDto);
    });

    it('should throw NotFoundException if role to update not found', async () => {
      roleRepository.findByPk.mockResolvedValue(null);

      await expect(
        service.update('non-existent-id', { name: 'NEW_NAME' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if updating to existing name', async () => {
      const updateRoleDto: UpdateRoleDto = {
        name: 'EXISTING_NAME',
      };

      roleRepository.findByPk.mockResolvedValue(mockRole);
      roleRepository.findOne.mockResolvedValue({ ...mockRole, id: 'different-id' });

      await expect(service.update('test-role-id', updateRoleDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a role successfully', async () => {
      roleRepository.findByPk.mockResolvedValue(mockRole);
      userRepository.count.mockResolvedValue(0);

      await service.remove('test-role-id');

      expect(mockRole.destroy).toHaveBeenCalled();
    });

    it('should throw NotFoundException if role to remove not found', async () => {
      roleRepository.findByPk.mockResolvedValue(null);

      await expect(service.remove('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ConflictException if role has assigned users', async () => {
      roleRepository.findByPk.mockResolvedValue(mockRole);
      userRepository.count.mockResolvedValue(5);

      await expect(service.remove('test-role-id')).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('assignRoleToUser', () => {
    it('should assign role to user successfully', async () => {
      const assignRoleDto: AssignRoleDto = {
        userId: 'test-user-id',
        roleId: 'test-role-id',
      };

      userRepository.findByPk.mockResolvedValue(mockUser);
      roleRepository.findByPk.mockResolvedValue(mockRole);
      mockUser.update.mockResolvedValue(mockUser);
      mockUser.reload.mockResolvedValue(mockUser);

      const result = await service.assignRoleToUser(assignRoleDto);

      expect(result).toBe(mockUser);
      expect(mockUser.update).toHaveBeenCalledWith({ roleId: 'test-role-id' });
    });

    it('should throw NotFoundException if user not found', async () => {
      const assignRoleDto: AssignRoleDto = {
        userId: 'non-existent-user',
        roleId: 'test-role-id',
      };

      userRepository.findByPk.mockResolvedValue(null);

      await expect(service.assignRoleToUser(assignRoleDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if role not found', async () => {
      const assignRoleDto: AssignRoleDto = {
        userId: 'test-user-id',
        roleId: 'non-existent-role',
      };

      userRepository.findByPk.mockResolvedValue(mockUser);
      roleRepository.findByPk.mockResolvedValue(null);

      await expect(service.assignRoleToUser(assignRoleDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getRolePermissions', () => {
    it('should return role permissions', async () => {
      roleRepository.findByPk.mockResolvedValue({
        ...mockRole,
        permissions: ['read', 'write', 'delete'],
      });

      const result = await service.getRolePermissions('test-role-id');

      expect(result).toEqual(['read', 'write', 'delete']);
    });

    it('should throw NotFoundException if role not found', async () => {
      roleRepository.findByPk.mockResolvedValue(null);

      await expect(service.getRolePermissions('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return empty array if role has no permissions', async () => {
      roleRepository.findByPk.mockResolvedValue({
        ...mockRole,
        permissions: null,
      });

      const result = await service.getRolePermissions('test-role-id');

      expect(result).toEqual([]);
    });
  });

  describe('addPermissions', () => {
    it('should add permissions to role successfully', async () => {
      const newPermissions = ['execute'];
      roleRepository.findByPk.mockResolvedValue({
        ...mockRole,
        permissions: ['read', 'write'],
        update: jest.fn(),
        reload: jest.fn(),
      });

      const mockUpdatedRole = {
        ...mockRole,
        permissions: ['read', 'write', 'execute'],
      };
      
      roleRepository.findByPk.mockResolvedValue({
        ...mockRole,
        permissions: ['read', 'write'],
        update: jest.fn().mockResolvedValue(mockUpdatedRole),
        reload: jest.fn().mockResolvedValue(mockUpdatedRole),
      });

      const result = await service.addPermissions('test-role-id', newPermissions);

      expect(result).toBeInstanceOf(RoleEntity);
    });

    it('should throw NotFoundException if role not found', async () => {
      roleRepository.findByPk.mockResolvedValue(null);

      await expect(
        service.addPermissions('non-existent-id', ['read']),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('removePermissions', () => {
    it('should remove permissions from role successfully', async () => {
      const permissionsToRemove = ['write'];
      roleRepository.findByPk.mockResolvedValue({
        ...mockRole,
        permissions: ['read', 'write', 'delete'],
        update: jest.fn(),
        reload: jest.fn(),
      });

      const result = await service.removePermissions('test-role-id', permissionsToRemove);

      expect(result).toBeInstanceOf(RoleEntity);
    });

    it('should throw NotFoundException if role not found', async () => {
      roleRepository.findByPk.mockResolvedValue(null);

      await expect(
        service.removePermissions('non-existent-id', ['read']),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getDefaultRole', () => {
    it('should return existing default role', async () => {
      const customerRole = { ...mockRole, name: 'CUSTOMER' };
      roleRepository.findOne.mockResolvedValue(customerRole);

      const result = await service.getDefaultRole();

      expect(result).toBeInstanceOf(RoleEntity);
      expect(roleRepository.findOne).toHaveBeenCalledWith({
        where: { name: 'CUSTOMER' },
      });
    });

    it('should create default role if not exists', async () => {
      roleRepository.findOne.mockResolvedValue(null);
      roleRepository.create.mockResolvedValue({
        ...mockRole,
        name: 'CUSTOMER',
        description: 'Default customer role',
        permissions: ['view_products', 'create_orders', 'view_own_orders'],
      });

      const result = await service.getDefaultRole();

      expect(result).toBeInstanceOf(RoleEntity);
      expect(roleRepository.create).toHaveBeenCalledWith({
        name: 'CUSTOMER',
        description: 'Default customer role',
        permissions: ['view_products', 'create_orders', 'view_own_orders'],
      });
    });
  });

  describe('delete', () => {
    it('should hard delete a role successfully', async () => {
      roleRepository.findByPk.mockResolvedValue(mockRole);

      await service.delete('test-role-id');

      expect(roleRepository.findByPk).toHaveBeenCalledWith('test-role-id', {
        paranoid: false,
      });
      expect(mockRole.destroy).toHaveBeenCalledWith({ force: true });
    });

    it('should throw NotFoundException if role to delete not found', async () => {
      roleRepository.findByPk.mockResolvedValue(null);

      await expect(service.delete('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
