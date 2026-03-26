import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpStatus,
  HttpCode,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { PaginatedResponseDto } from './dto/paginated-response.dto';
import { ApiOperation } from '@nestjs/swagger';


@Controller('products')
@UseInterceptors(ClassSerializerInterceptor)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
   @ApiOperation({ summary: 'Crear un producto' })
  async create(@Body() createProductDto: CreateProductDto): Promise<ProductResponseDto> {
    const product = await this.productService.create(createProductDto);
    return new ProductResponseDto(product);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los productos con paginación' })
async findAll(
  @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
): Promise<PaginatedResponseDto<ProductResponseDto>> {
  // Validar que los valores sean positivos
  const validPage = page > 0 ? page : 1;
  const validLimit = limit > 0 ? limit : 10;

  // Pasar el objeto de parámetros correctamente
  const result = await this.productService.findAll({ 
    page: validPage, 
    limit: validLimit 
  });
  
  // Transformar los productos a DTOs de respuesta
  const data = result.data.map(product => new ProductResponseDto(product));
  
  // Crear y retornar la respuesta paginada
  return new PaginatedResponseDto({
    data,
    meta: result.meta,
  });
}

  @Get('all')
  @ApiOperation({ summary: 'Obtener todos los productos sin paginación' })
  async findAllSimple(): Promise<ProductResponseDto[]> {
    const products = await this.productService.findAllSimple();
    return products.map(p => new ProductResponseDto(p));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto por ID' })
  async findOne(@Param('id') id: string): Promise<ProductResponseDto> {
    const product = await this.productService.findOne(id);
    return new ProductResponseDto(product);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un producto por su id' })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    const product = await this.productService.update(id, updateProductDto);
    return new ProductResponseDto(product);
  }

  @Delete(':id')
    @ApiOperation({ summary: 'Eliminar un producto por su id' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.productService.remove(id);
  }

  @Delete('delete/:id')
    @ApiOperation({ summary: 'Eliminar un producto por su id' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    return this.productService.delete(id);
  }
}