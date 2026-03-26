import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { PaginatedResponseDto } from '../dto/paginated-response.dto';
import { UserEntity } from '../entities/user.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: jest.Mocked<UsersService>;

  const mockUserEntity: UserEntity = {
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    roleId: 'test-role-id',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUserResponseDto: UserResponseDto = new UserResponseDto(mockUserEntity);

  const mockPaginatedResponse: PaginatedResponseDto<UserEntity> = {
    data: [mockUserEntity],
    meta: {
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  };

  beforeEach(async () => {
    const mockUsersService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findAllSimple: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      delete: jest.fn(),
      toggleActive: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get(UsersService) as jest.Mocked<UsersService>;

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
      roleId: 'test-role-id',
      isActive: true,
    };

    it('should create a user successfully', async () => {
      usersService.create.mockResolvedValue(mockUserEntity);

      const result = await controller.create(createUserDto);

      expect(result).toBeInstanceOf(UserResponseDto);
      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
      expect(result.id).toBe(mockUserEntity.id);
      expect(result.email).toBe(mockUserEntity.email);
    });

    it('should throw ConflictException if email already exists', async () => {
      usersService.create.mockRejectedValue(
        new ConflictException('El email ya está registrado'),
      );

      await expect(controller.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated users with default values', async () => {
      usersService.findAll.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findAll();

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
      expect(usersService.findAll).toHaveBeenCalledWith({ page: undefined, limit: undefined });
    });

    it('should return paginated users with custom values', async () => {
      usersService.findAll.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findAll(2, 5);

      expect(result.data).toHaveLength(1);
      expect(usersService.findAll).toHaveBeenCalledWith({ page: 2, limit: 5 });
    });

    it('should map UserEntity to UserResponseDto', async () => {
      usersService.findAll.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findAll();

      expect(result.data[0]).toBeInstanceOf(UserResponseDto);
      expect(result.data[0].id).toBe(mockUserEntity.id);
      expect(result.data[0].email).toBe(mockUserEntity.email);
    });
  });

  describe('findAllSimple', () => {
    it('should return all users without pagination', async () => {
      usersService.findAllSimple.mockResolvedValue([mockUserEntity]);

      const result = await controller.findAllSimple();

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(UserResponseDto);
      expect(usersService.findAllSimple).toHaveBeenCalled();
    });

    it('should return empty array when no users exist', async () => {
      usersService.findAllSimple.mockResolvedValue([]);

      const result = await controller.findAllSimple();

      expect(result).toHaveLength(0);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      usersService.findOne.mockResolvedValue(mockUserEntity);

      const result = await controller.findOne('test-user-id');

      expect(result).toBeInstanceOf(UserResponseDto);
      expect(usersService.findOne).toHaveBeenCalledWith('test-user-id');
      expect(result.id).toBe(mockUserEntity.id);
    });

    it('should throw NotFoundException if user not found', async () => {
      usersService.findOne.mockRejectedValue(
        new NotFoundException('Usuario con ID test-user-id no encontrado'),
      );

      await expect(controller.findOne('test-user-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    const updateUserDto: UpdateUserDto = {
      name: 'Updated Name',
      email: 'updated@example.com',
    };

    it('should update a user successfully', async () => {
      usersService.update.mockResolvedValue(mockUserEntity);

      const result = await controller.update('test-user-id', updateUserDto);

      expect(result).toBeInstanceOf(UserResponseDto);
      expect(usersService.update).toHaveBeenCalledWith('test-user-id', updateUserDto);
      expect(result.id).toBe(mockUserEntity.id);
    });

    it('should throw NotFoundException if user not found', async () => {
      usersService.update.mockRejectedValue(
        new NotFoundException('Usuario con ID test-user-id no encontrado'),
      );

      await expect(
        controller.update('test-user-id', updateUserDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should handle partial updates', async () => {
      const partialUpdate = { name: 'New Name' };
      usersService.update.mockResolvedValue(mockUserEntity);

      const result = await controller.update('test-user-id', partialUpdate);

      expect(result).toBeInstanceOf(UserResponseDto);
      expect(usersService.update).toHaveBeenCalledWith('test-user-id', partialUpdate);
    });
  });

  describe('remove', () => {
    it('should remove a user successfully', async () => {
      usersService.remove.mockResolvedValue(undefined);

      await controller.remove('test-user-id');

      expect(usersService.remove).toHaveBeenCalledWith('test-user-id');
    });

    it('should throw NotFoundException if user not found', async () => {
      usersService.remove.mockRejectedValue(
        new NotFoundException('Usuario con ID test-user-id no encontrado'),
      );

      await expect(controller.remove('test-user-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete a user successfully', async () => {
      usersService.delete.mockResolvedValue(undefined);

      await controller.delete('test-user-id');

      expect(usersService.delete).toHaveBeenCalledWith('test-user-id');
    });

    it('should throw NotFoundException if user not found', async () => {
      usersService.delete.mockRejectedValue(
        new NotFoundException('User with ID test-user-id not found'),
      );

      await expect(controller.delete('test-user-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('toggleActive', () => {
    it('should toggle user active status successfully', async () => {
      const updatedUser = { ...mockUserEntity, isActive: false };
      usersService.toggleActive.mockResolvedValue(updatedUser);

      const result = await controller.toggleActive('test-user-id');

      expect(result).toBeInstanceOf(UserResponseDto);
      expect(usersService.toggleActive).toHaveBeenCalledWith('test-user-id');
      expect(result.isActive).toBe(false);
    });

    it('should throw NotFoundException if user not found', async () => {
      usersService.toggleActive.mockRejectedValue(
        new NotFoundException('Usuario con ID test-user-id no encontrado'),
      );

      await expect(controller.toggleActive('test-user-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('error handling', () => {
    it('should handle service errors appropriately', async () => {
      usersService.create.mockRejectedValue(new Error('Database error'));

      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        roleId: 'test-role-id',
      };

      await expect(controller.create(createUserDto)).rejects.toThrow(
        'Database error',
      );
    });

    it('should validate input data through DTOs', async () => {
      const invalidDto = {
        email: 'invalid-email',
        password: '123', // too short
        name: '', // empty
      };

      // Note: This would be handled by validation pipes in the actual application
      // Here we're testing that the controller passes the DTO to the service
      usersService.create.mockResolvedValue(mockUserEntity);

      // This should not throw validation errors in the test environment
      // but would be caught by validation pipes in production
      const result = await controller.create(invalidDto as any);

      expect(usersService.create).toHaveBeenCalledWith(invalidDto);
      expect(result).toBeInstanceOf(UserResponseDto);
    });
  });

  describe('response mapping', () => {
    it('should properly map UserEntity to UserResponseDto in all methods', async () => {
      usersService.findAll.mockResolvedValue(mockPaginatedResponse);
      usersService.findAllSimple.mockResolvedValue([mockUserEntity]);
      usersService.findOne.mockResolvedValue(mockUserEntity);
      usersService.create.mockResolvedValue(mockUserEntity);
      usersService.update.mockResolvedValue(mockUserEntity);
      usersService.toggleActive.mockResolvedValue(mockUserEntity);

      const findAllResult = await controller.findAll();
      const findAllSimpleResult = await controller.findAllSimple();
      const findOneResult = await controller.findOne('test-id');
      const createResult = await controller.create({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test',
        roleId: 'role-id',
      });
      const updateResult = await controller.update('test-id', { name: 'Updated' });
      const toggleResult = await controller.toggleActive('test-id');

      // All results should be instances of UserResponseDto
      expect(findAllResult.data[0]).toBeInstanceOf(UserResponseDto);
      expect(findAllSimpleResult[0]).toBeInstanceOf(UserResponseDto);
      expect(findOneResult).toBeInstanceOf(UserResponseDto);
      expect(createResult).toBeInstanceOf(UserResponseDto);
      expect(updateResult).toBeInstanceOf(UserResponseDto);
      expect(toggleResult).toBeInstanceOf(UserResponseDto);
    });
  });
});
