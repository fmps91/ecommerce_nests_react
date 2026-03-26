import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ProductService, PaginationParams, PaginatedResponse } from '../products.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ProductEntity } from '../entities/product.entity';
import { Product } from '../models/product.model';
import { Sequelize } from 'sequelize-typescript';

describe('ProductService', () => {
  let service: ProductService;
  let sequelize: Sequelize;
  let mockProductRepository: any;

  const mockProduct = {
    id: 'product-123',
    nombre: 'Test Product',
    precio: 99.99,
    stock: 10,
    descripcion: 'Test description',
    imagen: 'https://example.com/image.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    mockProductRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findByPk: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
      findAndCountAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: 'SEQUELIZE',
          useValue: {
            getRepository: jest.fn().mockReturnValue(mockProductRepository),
          },
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    sequelize = module.get<Sequelize>('SEQUELIZE');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a product successfully', async () => {
      const createProductDto: CreateProductDto = {
        nombre: 'New Product',
        precio: 149.99,
        stock: 25,
        descripcion: 'New description',
        imagen: 'https://example.com/new-image.jpg',
      };

      const expectedCreatedProduct = { ...mockProduct, ...createProductDto };
      mockProductRepository.create.mockResolvedValue(expectedCreatedProduct);

      const result = await service.create(createProductDto);

      expect(mockProductRepository.create).toHaveBeenCalledWith({ createProductDto });
      expect(result).toBeInstanceOf(ProductEntity);
      expect(result.id).toBe(expectedCreatedProduct.id);
      expect(result.nombre).toBe(createProductDto.nombre);
      expect(result.precio).toBe(createProductDto.precio);
      expect(result.stock).toBe(createProductDto.stock);
    });

    it('should handle creation errors', async () => {
      const createProductDto: CreateProductDto = {
        nombre: 'New Product',
        precio: 149.99,
        stock: 25,
      };

      const error = new Error('Database error');
      mockProductRepository.create.mockRejectedValue(error);

      await expect(service.create(createProductDto)).rejects.toThrow('Database error');
      expect(mockProductRepository.create).toHaveBeenCalledWith({ createProductDto });
    });
  });

  describe('findAll', () => {
    it('should return paginated products with default values', async () => {
      const mockProducts = [mockProduct, { ...mockProduct, id: 'product-456' }];
      const mockCount = 2;

      mockProductRepository.findAndCountAll.mockResolvedValue({
        rows: mockProducts,
        count: mockCount,
      });

      const result = await service.findAll();

      expect(mockProductRepository.findAndCountAll).toHaveBeenCalledWith({
        order: [['createdAt', 'DESC']],
        limit: 10,
        offset: 0,
        distinct: true,
      });

      expect(result.data).toHaveLength(2);
      expect(result.meta.total).toBe(mockCount);
      expect(result.meta.page).toBe(1);
      expect(result.meta.limit).toBe(10);
      expect(result.meta.totalPages).toBe(1);
      expect(result.meta.hasNextPage).toBe(false);
      expect(result.meta.hasPreviousPage).toBe(false);
    });

    it('should return paginated products with custom values', async () => {
      const mockProducts = [mockProduct];
      const mockCount = 5;
      const params: PaginationParams = { page: 2, limit: 3 };

      mockProductRepository.findAndCountAll.mockResolvedValue({
        rows: mockProducts,
        count: mockCount,
      });

      const result = await service.findAll(params);

      expect(mockProductRepository.findAndCountAll).toHaveBeenCalledWith({
        order: [['createdAt', 'DESC']],
        limit: 3,
        offset: 3, // (page - 1) * limit
        distinct: true,
      });

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(mockCount);
      expect(result.meta.page).toBe(2);
      expect(result.meta.limit).toBe(3);
      expect(result.meta.totalPages).toBe(2); // Math.ceil(5 / 3)
      expect(result.meta.hasNextPage).toBe(false);
      expect(result.meta.hasPreviousPage).toBe(true);
    });

    it('should handle invalid pagination values', async () => {
      const mockProducts = [mockProduct];
      const mockCount = 1;
      const params: PaginationParams = { page: 0, limit: -5 };

      mockProductRepository.findAndCountAll.mockResolvedValue({
        rows: mockProducts,
        count: mockCount,
      });

      const result = await service.findAll(params);

      // Debe usar valores por defecto
      expect(mockProductRepository.findAndCountAll).toHaveBeenCalledWith({
        order: [['createdAt', 'DESC']],
        limit: 10, // default
        offset: 0,  // (1 - 1) * 10
        distinct: true,
      });

      expect(result.meta.page).toBe(1);
      expect(result.meta.limit).toBe(10);
    });

    it('should calculate hasNextPage correctly', async () => {
      const mockProducts = [mockProduct];
      const mockCount = 25;
      const params: PaginationParams = { page: 2, limit: 10 };

      mockProductRepository.findAndCountAll.mockResolvedValue({
        rows: mockProducts,
        count: mockCount,
      });

      const result = await service.findAll(params);

      expect(result.meta.totalPages).toBe(3); // Math.ceil(25 / 10)
      expect(result.meta.hasNextPage).toBe(true); // 2 < 3
      expect(result.meta.hasPreviousPage).toBe(true); // 2 > 1
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      mockProductRepository.findByPk.mockResolvedValue(mockProduct);

      const result = await service.findOne('product-123');

      expect(mockProductRepository.findByPk).toHaveBeenCalledWith('product-123');
      expect(result).toBeInstanceOf(ProductEntity);
      expect(result.id).toBe(mockProduct.id);
      expect(result.nombre).toBe(mockProduct.nombre);
    });

    it('should throw NotFoundException when product does not exist', async () => {
      mockProductRepository.findByPk.mockResolvedValue(null);

      await expect(service.findOne('nonexistent-id')).rejects.toThrow(NotFoundException);
      expect(mockProductRepository.findByPk).toHaveBeenCalledWith('nonexistent-id');
    });
  });

  describe('update', () => {
    it('should update a product successfully', async () => {
      const updateProductDto: UpdateProductDto = {
        nombre: 'Updated Product',
        precio: 199.99,
      };

      const updatedProduct = { ...mockProduct, ...updateProductDto };
      const mockUpdateResult = {
        _changed: true,
        dataValues: updatedProduct,
        reload: jest.fn().mockResolvedValue(updatedProduct),
      };

      mockProductRepository.findByPk.mockResolvedValue(mockProduct);
      mockProductRepository.update.mockResolvedValue(mockUpdateResult);

      const result = await service.update('product-123', updateProductDto);

      expect(mockProductRepository.findByPk).toHaveBeenCalledWith('product-123');
      expect(mockProductRepository.update).toHaveBeenCalledWith(updateProductDto, {
        where: { id: 'product-123' },
      });
      expect(mockUpdateResult.reload).toHaveBeenCalled();
      expect(result).toBeInstanceOf(ProductEntity);
      expect(result.nombre).toBe(updateProductDto.nombre);
      expect(result.precio).toBe(updateProductDto.precio);
    });

    it('should throw NotFoundException when updating non-existent product', async () => {
      const updateProductDto: UpdateProductDto = {
        nombre: 'Updated Product',
      };

      mockProductRepository.findByPk.mockResolvedValue(null);

      await expect(service.update('nonexistent-id', updateProductDto)).rejects.toThrow(NotFoundException);
      expect(mockProductRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a product successfully', async () => {
      const mockDestroyResult = { deleted: true };
      mockProductRepository.findByPk.mockResolvedValue(mockProduct);
      mockProductRepository.destroy.mockResolvedValue(mockDestroyResult);

      await service.remove('product-123');

      expect(mockProductRepository.findByPk).toHaveBeenCalledWith('product-123');
      expect(mockProductRepository.destroy).toHaveBeenCalledWith({ where: { id: 'product-123' } });
    });

    it('should throw NotFoundException when removing non-existent product', async () => {
      mockProductRepository.findByPk.mockResolvedValue(null);

      await expect(service.remove('nonexistent-id')).rejects.toThrow(NotFoundException);
      expect(mockProductRepository.destroy).not.toHaveBeenCalled();
    });
  });

  describe('verificarStock', () => {
    it('should return true when stock is sufficient', async () => {
      mockProductRepository.findByPk.mockResolvedValue({
        ...mockProduct,
        stock: 10,
      });

      const result = await service.verificarStock('product-123', 5);

      expect(result).toBe(true);
      expect(mockProductRepository.findByPk).toHaveBeenCalledWith('product-123');
    });

    it('should return false when stock is insufficient', async () => {
      mockProductRepository.findByPk.mockResolvedValue({
        ...mockProduct,
        stock: 3,
      });

      const result = await service.verificarStock('product-123', 5);

      expect(result).toBe(false);
      expect(mockProductRepository.findByPk).toHaveBeenCalledWith('product-123');
    });

    it('should return false when product does not exist', async () => {
      mockProductRepository.findByPk.mockResolvedValue(null);

      const result = await service.verificarStock('nonexistent-id', 5);

      expect(result).toBe(false);
      expect(mockProductRepository.findByPk).toHaveBeenCalledWith('nonexistent-id');
    });
  });

  describe('actualizarStock', () => {
    it('should update stock successfully', async () => {
      const mockUpdateResult = {
        _changed: true,
        dataValues: { ...mockProduct, stock: 5 },
        reload: jest.fn().mockResolvedValue({ ...mockProduct, stock: 5 }),
      };

      mockProductRepository.findByPk.mockResolvedValue(mockProduct);
      mockProductRepository.update.mockResolvedValue(mockUpdateResult);

      const result = await service.actualizarStock('product-123', 5);

      expect(mockProductRepository.findByPk).toHaveBeenCalledWith('product-123');
      expect(mockProductRepository.update).toHaveBeenCalledWith(
        { stock: 5 },
        { where: { id: 'product-123' } }
      );
      expect(mockUpdateResult.reload).toHaveBeenCalled();
      expect(result.stock).toBe(5);
    });

    it('should throw NotFoundException when updating stock of non-existent product', async () => {
      mockProductRepository.findByPk.mockResolvedValue(null);

      await expect(service.actualizarStock('nonexistent-id', 5)).rejects.toThrow(NotFoundException);
      expect(mockProductRepository.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when insufficient stock', async () => {
      mockProductRepository.findByPk.mockResolvedValue({
        ...mockProduct,
        stock: 3,
      });

      await expect(service.actualizarStock('product-123', 5)).rejects.toThrow(BadRequestException);
      expect(mockProductRepository.update).not.toHaveBeenCalled();
    });
  });
});
