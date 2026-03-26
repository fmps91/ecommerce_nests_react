import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { Product } from './models/product.model';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './entities/product.entity';
import { PaginationMetaDto } from './dto/pagination-meta.dto';
import { PaginatedResponseDto } from './dto/paginated-response.dto';


// Interface para los parámetros de paginación - ESTO ES LO QUE DEBES USAR EN EL CONTROLADOR
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}


@Injectable()
export class ProductService {
  constructor(
    @Inject('SEQUELIZE')
    private sequelize: Sequelize,
  ) {}

  private get productRepository() {
    return this.sequelize.getRepository(Product);
  }

  async create(createProductDto: CreateProductDto): Promise<ProductEntity> {
    const created = await this.productRepository.create({createProductDto});
    return new ProductEntity(created.toJSON());
  }

  async findAll(params?: PaginationParams): Promise<PaginatedResponseDto<ProductEntity>> {
    // Valores por defecto
    const page = params?.page && params.page > 0 ? params.page : 1;
    const limit = params?.limit && params.limit > 0 ? params.limit : 10;
    
    // Calcular el offset
    const offset = (page - 1) * limit;

    // Ejecutar la consulta con paginación
    const { rows, count } = await this.productRepository.findAndCountAll({
      order: [['createdAt', 'DESC']],
      limit,
      offset,
      distinct: true, // Importante para contar correctamente con joins
    });

    // Calcular metadatos de paginación
    const totalPages = Math.ceil(count / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    // Mapear los productos a entidades
    const data = rows.map(p => new ProductEntity(p.toJSON()));

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

  // Versión alternativa si prefieres mantener el método original sin paginación
  async findAllSimple(): Promise<ProductEntity[]> {
    const products = await this.productRepository.findAll({ 
      order: [['createdAt', 'DESC']] 
    });
    return products.map(p => new ProductEntity(p.toJSON()));
  }

  async findOne(id: string): Promise<ProductEntity> {
    const product = await this.productRepository.findByPk(id);

    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    return new ProductEntity(product.toJSON());
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<ProductEntity> {
    const product = await this.productRepository.findByPk(id);

    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    await product.update(updateProductDto as any);
    return new ProductEntity(product.toJSON());
  }

  async remove(id: string): Promise<void> {
    const product = await this.productRepository.findByPk(id);

    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    await product.destroy();
  }

  async delete(id: string): Promise<void> {
    const product = await this.productRepository.findByPk(id,{
      paranoid: false, // ¡Importante! Permite encontrar registros soft-deleted
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    await product.destroy({ force: true }); // Hard delete
   
  }

  async verificarStock(id: string, cantidad: number): Promise<boolean> {
    const product = await this.findOne(id);
    return product.stock >= cantidad;
  }

  async actualizarStock(id: string, cantidad: number): Promise<ProductEntity> {
    const product = await this.productRepository.findByPk(id);

    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    if (product.stock < cantidad) {
      throw new BadRequestException('Stock insuficiente');
    }

    await product.update({ stock: product.stock - cantidad });
    return new ProductEntity(product.toJSON());
  }
}