import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { Sequelize } from 'sequelize-typescript';
import { User } from '../models/user.model';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserEntity, UserRole } from '../entities/user.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

// Mock bcrypt
jest.mock('bcrypt');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('UsersService', () => {
  let service: UsersService;
  let sequelize: Sequelize;
  let userRepository: any;

  const mockUser = {
    id: 'test-user-id',
    email: 'test@example.com',
    password: 'hashedpassword',
    name: 'Test User',
    roleId: 'test-role-id',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    toJSON: jest.fn().mockReturnValue({
      id: 'test-user-id',
      email: 'test@example.com',
      password: 'hashedpassword',
      name: 'Test User',
      roleId: 'test-role-id',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    }),
    update: jest.fn(),
    destroy: jest.fn(),
    reload: jest.fn(),
    restore: jest.fn(),
  };

  beforeEach(async () => {
    const mockSequelize = {
      getRepository: jest.fn(),
    };

    userRepository = {
      create: jest.fn(),
      findOne: jest.fn(),
      findByPk: jest.fn(),
      findAll: jest.fn(),
      findAndCountAll: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
    };

    mockSequelize.getRepository.mockReturnValue(userRepository);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'SEQUELIZE',
          useValue: mockSequelize,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    sequelize = module.get<Sequelize>('SEQUELIZE');

    // Reset all mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
      userRepository.findOne.mockResolvedValue(null);
      mockedBcrypt.hash.mockResolvedValue('hashedpassword');
      userRepository.create.mockResolvedValue(mockUser);

      const result = await service.create(createUserDto);

      expect(result).toBeInstanceOf(UserEntity);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
        paranoid: false,
      });
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
      expect(userRepository.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: 'hashedpassword',
      });
    });

    it('should throw ConflictException if email already exists', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);

      await expect(service.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated users with default values', async () => {
      const mockUsers = [mockUser];
      const mockCount = 1;

      userRepository.findAndCountAll.mockResolvedValue({
        rows: mockUsers,
        count: mockCount,
      });

      const result = await service.findAll();

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
      expect(result.meta.page).toBe(1);
      expect(result.meta.limit).toBe(10);
      expect(result.meta.totalPages).toBe(1);
      expect(result.meta.hasNextPage).toBe(false);
      expect(result.meta.hasPreviousPage).toBe(false);
    });

    it('should return paginated users with custom values', async () => {
      const mockUsers = [mockUser];
      const mockCount = 25;

      userRepository.findAndCountAll.mockResolvedValue({
        rows: mockUsers,
        count: mockCount,
      });

      const result = await service.findAll({ page: 2, limit: 5 });

      expect(result.meta.page).toBe(2);
      expect(result.meta.limit).toBe(5);
      expect(result.meta.totalPages).toBe(5);
      expect(result.meta.hasNextPage).toBe(true);
      expect(result.meta.hasPreviousPage).toBe(true);
    });

    it('should handle invalid pagination values', async () => {
      userRepository.findAndCountAll.mockResolvedValue({
        rows: [],
        count: 0,
      });

      const result = await service.findAll({ page: 0, limit: -1 });

      expect(result.meta.page).toBe(1);
      expect(result.meta.limit).toBe(10);
    });
  });

  describe('findAllSimple', () => {
    it('should return all users without pagination', async () => {
      const mockUsers = [mockUser];
      userRepository.findAll.mockResolvedValue(mockUsers);

      const result = await service.findAllSimple();

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(UserEntity);
      expect(userRepository.findAll).toHaveBeenCalledWith({
        where: { isActive: true },
        order: [['createdAt', 'DESC']],
      });
    });
  });

  describe('findAllWithDeleted', () => {
    it('should return all users including deleted ones', async () => {
      const mockUsers = [mockUser];
      userRepository.findAll.mockResolvedValue(mockUsers);

      const result = await service.findAllWithDeleted();

      expect(result).toHaveLength(1);
      expect(userRepository.findAll).toHaveBeenCalledWith({
        paranoid: false,
      });
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      userRepository.findByPk.mockResolvedValue(mockUser);

      const result = await service.findOne('test-user-id');

      expect(result).toBeInstanceOf(UserEntity);
      expect(userRepository.findByPk).toHaveBeenCalledWith('test-user-id', {
        paranoid: false,
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      userRepository.findByPk.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@example.com');

      expect(result).toBeInstanceOf(UserEntity);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        paranoid: false,
      });
    });

    it('should return null if user not found by email', async () => {
      userRepository.findOne.mockResolvedValue(null);

      const result = await service.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    const updateUserDto: UpdateUserDto = {
      name: 'Updated Name',
      email: 'updated@example.com',
    };

    it('should update a user successfully', async () => {
      userRepository.findByPk.mockResolvedValue(mockUser);
      mockUser.update.mockResolvedValue(mockUser);
      mockUser.reload.mockResolvedValue(mockUser);

      const result = await service.update('test-user-id', updateUserDto);

      expect(result).toBeInstanceOf(UserEntity);
      expect(mockUser.update).toHaveBeenCalledWith(updateUserDto);
      expect(mockUser.reload).toHaveBeenCalled();
    });

    it('should hash password if provided', async () => {
      const updateWithPassword = { ...updateUserDto, password: 'newpassword' };
      userRepository.findByPk.mockResolvedValue(mockUser);
      mockedBcrypt.hash.mockResolvedValue('newhashedpassword');
      mockUser.update.mockResolvedValue(mockUser);
      mockUser.reload.mockResolvedValue(mockUser);

      await service.update('test-user-id', updateWithPassword);

      expect(mockedBcrypt.hash).toHaveBeenCalledWith('newpassword', 10);
      expect(mockUser.update).toHaveBeenCalledWith({
        ...updateUserDto,
        password: 'newhashedpassword',
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      userRepository.findByPk.mockResolvedValue(null);

      await expect(service.update('non-existent-id', updateUserDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should soft delete a user successfully', async () => {
      userRepository.findByPk.mockResolvedValue(mockUser);
      mockUser.destroy.mockResolvedValue(mockUser);

      await service.remove('test-user-id');

      expect(userRepository.findByPk).toHaveBeenCalledWith('test-user-id');
      expect(mockUser.destroy).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user not found', async () => {
      userRepository.findByPk.mockResolvedValue(null);

      await expect(service.remove('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should hard delete a user successfully', async () => {
      userRepository.findByPk.mockResolvedValue(mockUser);
      mockUser.destroy.mockResolvedValue(mockUser);

      await service.delete('test-user-id');

      expect(userRepository.findByPk).toHaveBeenCalledWith('test-user-id', {
        paranoid: false,
      });
      expect(mockUser.destroy).toHaveBeenCalledWith({ force: true });
    });

    it('should throw NotFoundException if user not found', async () => {
      userRepository.findByPk.mockResolvedValue(null);

      await expect(service.delete('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('toggleActive', () => {
    it('should toggle user active status successfully', async () => {
      const inactiveUser = { ...mockUser, isActive: false };
      userRepository.findByPk.mockResolvedValue(inactiveUser);
      inactiveUser.update.mockResolvedValue({ ...inactiveUser, isActive: true });
      inactiveUser.reload.mockResolvedValue({ ...inactiveUser, isActive: true });

      const result = await service.toggleActive('test-user-id');

      expect(result).toBeInstanceOf(UserEntity);
      expect(inactiveUser.update).toHaveBeenCalledWith({ isActive: true });
    });

    it('should throw NotFoundException if user not found', async () => {
      userRepository.findByPk.mockResolvedValue(null);

      await expect(service.toggleActive('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('restore', () => {
    it('should restore a soft deleted user successfully', async () => {
      userRepository.findByPk.mockResolvedValue(mockUser);
      mockUser.restore.mockResolvedValue(mockUser);
      mockUser.reload.mockResolvedValue(mockUser);

      const result = await service.restore('test-user-id');

      expect(result).toBeInstanceOf(UserEntity);
      expect(userRepository.findByPk).toHaveBeenCalledWith('test-user-id', {
        paranoid: false,
      });
      expect(mockUser.restore).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user not found', async () => {
      userRepository.findByPk.mockResolvedValue(null);

      await expect(service.restore('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAdmins', () => {
    it('should return all admin users', async () => {
      const mockAdmins = [mockUser];
      userRepository.findAll.mockResolvedValue(mockAdmins);

      const result = await service.findAdmins();

      expect(result).toHaveLength(1);
      expect(userRepository.findAll).toHaveBeenCalledWith({
        where: { role: UserRole.ADMIN, isActive: true },
      });
    });
  });

  describe('findByRole', () => {
    it('should return users by role', async () => {
      const mockUsers = [mockUser];
      userRepository.findAll.mockResolvedValue(mockUsers);

      const result = await service.findByRole(UserRole.CUSTOMER);

      expect(result).toHaveLength(1);
      expect(userRepository.findAll).toHaveBeenCalledWith({
        where: { role: UserRole.CUSTOMER, isActive: true },
      });
    });
  });

  describe('updatePassword', () => {
    it('should update user password successfully', async () => {
      userRepository.findByPk.mockResolvedValue(mockUser);
      mockUser.update.mockResolvedValue(mockUser);

      await service.updatePassword('test-user-id', 'newpassword');

      expect(userRepository.findByPk).toHaveBeenCalledWith('test-user-id');
      expect(mockUser.update).toHaveBeenCalledWith({ password: 'newpassword' });
    });

    it('should throw NotFoundException if user not found', async () => {
      userRepository.findByPk.mockResolvedValue(null);

      await expect(
        service.updatePassword('non-existent-id', 'newpassword'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
