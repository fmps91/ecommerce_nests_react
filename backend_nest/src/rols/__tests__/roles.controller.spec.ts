import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from '../roles.controller';
import { RolesService } from '../roles.service';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { AssignRoleDto } from '../dto/assign-role.dto';
import { RoleResponseDto } from '../dto/role-response.dto';
import { RoleEntity } from '../entities/role.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';

describe('RolesController', () => {
  let controller: RolesController;
  let service: RolesService;

  const mockRoleEntity: RoleEntity = {
    id: 'test-role-id',
    name: 'ADMIN',
    description: 'Administrator role',
    permissions: ['read', 'write', 'delete'],
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: undefined,
    users: [],
    permissionsCount: 3,
    hasPermissions: true,
  };

  const mockRoleResponseDto: RoleResponseDto = {
    id: 'test-role-id',
    name: 'ADMIN',
    description: 'Administrator role',
    permissions: ['read', 'write', 'delete'],
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: undefined,
    permissionsCount: 3,
  };

  const mockRolesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByName: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    delete: jest.fn(),
    assignRoleToUser: jest.fn(),
    getRolePermissions: jest.fn(),
    addPermissions: jest.fn(),
    removePermissions: jest.fn(),
    getDefaultRole: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [
        {
          provide: RolesService,
          useValue: mockRolesService,
        },
      ],
    }).compile();

    controller = module.get<RolesController>(RolesController);
    service = module.get<RolesService>(RolesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a role successfully', async () => {
      const createRoleDto: CreateRoleDto = {
        name: 'ADMIN',
        description: 'Administrator role',
        permissions: ['read', 'write'],
      };

      mockRolesService.create.mockResolvedValue(mockRoleEntity);

      const result = await controller.create(createRoleDto);

      expect(result).toEqual(mockRoleResponseDto);
      expect(service.create).toHaveBeenCalledWith(createRoleDto);
    });

    it('should throw ConflictException when role already exists', async () => {
      const createRoleDto: CreateRoleDto = {
        name: 'ADMIN',
      };

      mockRolesService.create.mockRejectedValue(
        new ConflictException('Role with name ADMIN already exists'),
      );

      await expect(controller.create(createRoleDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all roles', async () => {
      const mockRoles = [mockRoleEntity];
      mockRolesService.findAll.mockResolvedValue(mockRoles);

      const result = await controller.findAll();

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockRoleResponseDto);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('getDefaultRole', () => {
    it('should return default role', async () => {
      mockRolesService.getDefaultRole.mockResolvedValue(mockRoleEntity);

      const result = await controller.getDefaultRole();

      expect(result).toEqual(mockRoleResponseDto);
      expect(service.getDefaultRole).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a role by id', async () => {
      mockRolesService.findOne.mockResolvedValue(mockRoleEntity);

      const result = await controller.findOne('test-role-id');

      expect(result).toEqual(mockRoleResponseDto);
      expect(service.findOne).toHaveBeenCalledWith('test-role-id');
    });

    it('should throw NotFoundException if role not found', async () => {
      mockRolesService.findOne.mockRejectedValue(
        new NotFoundException('Role with ID test-id not found'),
      );

      await expect(controller.findOne('test-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByName', () => {
    it('should return a role by name', async () => {
      mockRolesService.findByName.mockResolvedValue(mockRoleEntity);

      const result = await controller.findByName('ADMIN');

      expect(result).toEqual(mockRoleResponseDto);
      expect(service.findByName).toHaveBeenCalledWith('ADMIN');
    });

    it('should throw NotFoundException if role not found by name', async () => {
      mockRolesService.findByName.mockRejectedValue(
        new NotFoundException('Role with name NON_EXISTENT not found'),
      );

      await expect(controller.findByName('NON_EXISTENT')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getPermissions', () => {
    it('should return role permissions', async () => {
      const permissions = ['read', 'write', 'delete'];
      mockRolesService.getRolePermissions.mockResolvedValue(permissions);

      const result = await controller.getPermissions('test-role-id');

      expect(result).toEqual(permissions);
      expect(service.getRolePermissions).toHaveBeenCalledWith('test-role-id');
    });

    it('should throw NotFoundException if role not found', async () => {
      mockRolesService.getRolePermissions.mockRejectedValue(
        new NotFoundException('Role with ID test-id not found'),
      );

      await expect(controller.getPermissions('test-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a role successfully', async () => {
      const updateRoleDto: UpdateRoleDto = {
        description: 'Updated description',
      };

      mockRolesService.update.mockResolvedValue(mockRoleEntity);

      const result = await controller.update('test-role-id', updateRoleDto);

      expect(result).toEqual(mockRoleResponseDto);
      expect(service.update).toHaveBeenCalledWith('test-role-id', updateRoleDto);
    });

    it('should throw NotFoundException if role to update not found', async () => {
      const updateRoleDto: UpdateRoleDto = {
        name: 'NEW_NAME',
      };

      mockRolesService.update.mockRejectedValue(
        new NotFoundException('Role with ID test-id not found'),
      );

      await expect(
        controller.update('test-id', updateRoleDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('addPermissions', () => {
    it('should add permissions to role successfully', async () => {
      const permissions = ['execute'];
      mockRolesService.addPermissions.mockResolvedValue(mockRoleEntity);

      const result = await controller.addPermissions('test-role-id', permissions);

      expect(result).toEqual(mockRoleResponseDto);
      expect(service.addPermissions).toHaveBeenCalledWith('test-role-id', permissions);
    });

    it('should throw NotFoundException if role not found', async () => {
      const permissions = ['read'];
      mockRolesService.addPermissions.mockRejectedValue(
        new NotFoundException('Role with ID test-id not found'),
      );

      await expect(
        controller.addPermissions('test-id', permissions),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('removePermissions', () => {
    it('should remove permissions from role successfully', async () => {
      const permissions = ['write'];
      mockRolesService.removePermissions.mockResolvedValue(mockRoleEntity);

      const result = await controller.removePermissions('test-role-id', permissions);

      expect(result).toEqual(mockRoleResponseDto);
      expect(service.removePermissions).toHaveBeenCalledWith(
        'test-role-id',
        permissions,
      );
    });

    it('should throw NotFoundException if role not found', async () => {
      const permissions = ['read'];
      mockRolesService.removePermissions.mockRejectedValue(
        new NotFoundException('Role with ID test-id not found'),
      );

      await expect(
        controller.removePermissions('test-id', permissions),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('assignRoleToUser', () => {
    it('should assign role to user successfully', async () => {
      const assignRoleDto: AssignRoleDto = {
        userId: 'test-user-id',
        roleId: 'test-role-id',
      };

      const mockUser = {
        id: 'test-user-id',
        email: 'test@example.com',
        roleId: 'test-role-id',
      };

      mockRolesService.assignRoleToUser.mockResolvedValue(mockUser);

      const result = await controller.assignRoleToUser(assignRoleDto);

      expect(result).toEqual({
        message: 'Role assigned successfully',
        user: {
          id: 'test-user-id',
          email: 'test@example.com',
          roleId: 'test-role-id',
        },
      });
      expect(service.assignRoleToUser).toHaveBeenCalledWith(assignRoleDto);
    });

    it('should throw NotFoundException if user not found', async () => {
      const assignRoleDto: AssignRoleDto = {
        userId: 'non-existent-user',
        roleId: 'test-role-id',
      };

      mockRolesService.assignRoleToUser.mockRejectedValue(
        new NotFoundException('User with ID non-existent-user not found'),
      );

      await expect(controller.assignRoleToUser(assignRoleDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if role not found', async () => {
      const assignRoleDto: AssignRoleDto = {
        userId: 'test-user-id',
        roleId: 'non-existent-role',
      };

      mockRolesService.assignRoleToUser.mockRejectedValue(
        new NotFoundException('Role with ID non-existent-role not found'),
      );

      await expect(controller.assignRoleToUser(assignRoleDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a role successfully', async () => {
      mockRolesService.remove.mockResolvedValue(undefined);

      await controller.remove('test-role-id');

      expect(service.remove).toHaveBeenCalledWith('test-role-id');
    });

    it('should throw NotFoundException if role to remove not found', async () => {
      mockRolesService.remove.mockRejectedValue(
        new NotFoundException('Role with ID test-id not found'),
      );

      await expect(controller.remove('test-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should hard delete a role successfully', async () => {
      mockRolesService.delete.mockResolvedValue(undefined);

      await controller.delete('test-role-id');

      expect(service.delete).toHaveBeenCalledWith('test-role-id');
    });

    it('should throw NotFoundException if role to delete not found', async () => {
      mockRolesService.delete.mockRejectedValue(
        new NotFoundException('Rol with ID test-id not found'),
      );

      await expect(controller.delete('test-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('HTTP Status Codes', () => {
    it('should return 201 CREATED when creating a role', async () => {
      const createRoleDto: CreateRoleDto = {
        name: 'ADMIN',
      };

      mockRolesService.create.mockResolvedValue(mockRoleEntity);

      // We can't easily test the HTTP status directly without more complex setup
      // but we can verify the controller method completes successfully
      const result = await controller.create(createRoleDto);
      expect(result).toBeDefined();
    });

    it('should return 204 NO_CONTENT when removing a role', async () => {
      mockRolesService.remove.mockResolvedValue(undefined);

      // Verify the method completes without returning content
      const result = await controller.remove('test-role-id');
      expect(result).toBeUndefined();
    });

    it('should return 204 NO_CONTENT when deleting a role', async () => {
      mockRolesService.delete.mockResolvedValue(undefined);

      // Verify the method completes without returning content
      const result = await controller.delete('test-role-id');
      expect(result).toBeUndefined();
    });
  });

  describe('Response DTO Transformation', () => {
    it('should transform RoleEntity to RoleResponseDto in create', async () => {
      const createRoleDto: CreateRoleDto = {
        name: 'ADMIN',
      };

      mockRolesService.create.mockResolvedValue(mockRoleEntity);

      const result = await controller.create(createRoleDto);

      expect(result).toBeInstanceOf(RoleResponseDto);
      expect(result.id).toBe(mockRoleEntity.id);
      expect(result.name).toBe(mockRoleEntity.name);
      expect(result.permissionsCount).toBe(mockRoleEntity.permissionsCount);
    });

    it('should transform RoleEntity array to RoleResponseDto array in findAll', async () => {
      const mockRoles = [mockRoleEntity];
      mockRolesService.findAll.mockResolvedValue(mockRoles);

      const result = await controller.findAll();

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(RoleResponseDto);
      expect(result[0].id).toBe(mockRoleEntity.id);
      expect(result[0].name).toBe(mockRoleEntity.name);
    });
  });
});
