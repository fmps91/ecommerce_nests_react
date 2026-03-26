import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from '../productos.controller';
import { ProductService } from '../products.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ProductResponseDto } from '../dto/product-response.dto';
import { PaginatedResponseDto } from '../dto/paginated-response.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('ProductController', () => {
  let controller: ProductController;
  let productService: jest.Mocked<ProductService>;

  const mockProduct = {
    id: 'product-123',
    nombre: 'Test Product',
    precio: 99.99,
    stock: 10,
    descripcion: 'Test description',
    imagen: 'https://example.com/image.jpg',
  };

  const mockPaginatedResponse: PaginatedResponseDto<ProductResponseDto> = {
    data: [new ProductResponseDto(mockProduct)],
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
    productService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: productService,
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(productService).toBeDefined();
  });

  describe('POST /products', () => {
    it('should create a product successfully', async () => {
      const createProductDto: CreateProductDto = {
        nombre: 'New Product',
        precio: 149.99,
        stock: 25,
        descripcion: 'New description',
        imagen: 'https://example.com/new-image.jpg',
      };

      const expectedProduct = new ProductResponseDto({
        ...mockProduct,
        ...createProductDto,
      });

      productService.create.mockResolvedValue(expectedProduct);

      const result = await controller.create(createProductDto);

      expect(productService.create).toHaveBeenCalledWith(createProductDto);
      expect(result).toEqual(expectedProduct);
    });

    it('should handle creation errors', async () => {
      const createProductDto: CreateProductDto = {
        nombre: 'New Product',
        precio: 149.99,
        stock: 25,
      };

      const error = new Error('Database error');
      productService.create.mockRejectedValue(error);

      await expect(controller.create(createProductDto)).rejects.toThrow('Database error');
      expect(productService.create).toHaveBeenCalledWith(createProductDto);
    });
  });

  describe('GET /products', () => {
    it('should return paginated products with default values', async () => {
      productService.findAll.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findAll(1, 10);

      expect(productService.findAll).toHaveBeenCalledWith({ page: 1, limit: 10 });
      expect(result).toEqual(mockPaginatedResponse);
    });

    it('should return paginated products with custom values', async () => {
      const customPaginatedResponse = {
        ...mockPaginatedResponse,
        meta: {
          ...mockPaginatedResponse.meta,
          page: 2,
          limit: 5,
        },
      };

      productService.findAll.mockResolvedValue(customPaginatedResponse);

      const result = await controller.findAll(2, 5);

      expect(productService.findAll).toHaveBeenCalledWith({ page: 2, limit: 5 });
      expect(result).toEqual(customPaginatedResponse);
    });

    it('should handle pagination service errors', async () => {
      const error = new Error('Database error');
      productService.findAll.mockRejectedValue(error);

      await expect(controller.findAll(1, 10)).rejects.toThrow('Database error');
      expect(productService.findAll).toHaveBeenCalledWith({ page: 1, limit: 10 });
    });
  });

  describe('GET /products/:id', () => {
    it('should return a product by id', async () => {
      const productResponse = new ProductResponseDto(mockProduct);
      productService.findOne.mockResolvedValue(productResponse);

      const result = await controller.findOne('product-123');

      expect(productService.findOne).toHaveBeenCalledWith('product-123');
      expect(result).toEqual(productResponse);
    });

    it('should handle non-existent product', async () => {
      const error = new NotFoundException('Product not found');
      productService.findOne.mockRejectedValue(error);

      await expect(controller.findOne('nonexistent-id')).rejects.toThrow(NotFoundException);
      expect(productService.findOne).toHaveBeenCalledWith('nonexistent-id');
    });
  });

  describe('PATCH /products/:id', () => {
    it('should update a product successfully', async () => {
      const updateProductDto: UpdateProductDto = {
        nombre: 'Updated Product',
        precio: 199.99,
      };

      const updatedProduct = new ProductResponseDto({
        ...mockProduct,
        ...updateProductDto,
      });

      productService.update.mockResolvedValue(updatedProduct);

      const result = await controller.update('product-123', updateProductDto);

      expect(productService.update).toHaveBeenCalledWith('product-123', updateProductDto);
      expect(result).toEqual(updatedProduct);
    });

    it('should handle update errors', async () => {
      const updateProductDto: UpdateProductDto = {
        nombre: 'Updated Product',
      };

      const error = new NotFoundException('Product not found');
      productService.update.mockRejectedValue(error);

      await expect(controller.update('nonexistent-id', updateProductDto)).rejects.toThrow(NotFoundException);
      expect(productService.update).toHaveBeenCalledWith('nonexistent-id', updateProductDto);
    });
  });

  describe('DELETE /products/:id', () => {
    it('should remove a product successfully', async () => {
      productService.remove.mockResolvedValue(undefined);

      await controller.remove('product-123');

      expect(productService.remove).toHaveBeenCalledWith('product-123');
    });

    it('should handle removal errors', async () => {
      const error = new NotFoundException('Product not found');
      productService.remove.mockRejectedValue(error);

      await expect(controller.remove('nonexistent-id')).rejects.toThrow(NotFoundException);
      expect(productService.remove).toHaveBeenCalledWith('nonexistent-id');
    });
  });
});
