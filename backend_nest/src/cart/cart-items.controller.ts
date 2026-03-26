import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete,
  HttpStatus,
  Query
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CartItemsService } from './cart-items.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartItemResponseDto } from './dto/cart-item-response.dto';
import { PaginatedResponseDto } from './dto/paginated-response.dto';

@ApiTags('cart-items')
@Controller('cart-items')
export class CartItemsController {
  constructor(private readonly cartItemsService: CartItemsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nuevos items en el carrito' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Items creados exitosamente', type: [CartItemResponseDto] })
  async create(@Body() createCartItemDto: CreateCartItemDto): Promise<CartItemResponseDto[]> {
    return this.cartItemsService.create(createCartItemDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los items del carrito con paginación' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Items encontrados', type: PaginatedResponseDto })
  async findAll(@Query('page') page?: string, @Query('limit') limit?: string): Promise<PaginatedResponseDto<CartItemResponseDto>> {
    const params = {
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    };
    return this.cartItemsService.findAll(params);
  }

  @Get('all')
  @ApiOperation({ summary: 'Obtener todos los items del carrito' })
  async findAllSimple(): Promise<CartItemResponseDto[]> {
    return this.cartItemsService.findAllSimple();
  }

  @Get('cart/:cartId')
  @ApiOperation({ summary: 'Obtener items del carrito por ID de carrito' })
  async findByCart(@Param('cartId') cartId: string): Promise<CartItemResponseDto[]> {
    return this.cartItemsService.findByCart(cartId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener item del carrito por ID' })
  async findOne(@Param('id') id: string): Promise<CartItemResponseDto> {
    return this.cartItemsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar item del carrito' })
  async update(
    @Param('id') id: string, 
    @Body() updateCartItemDto: UpdateCartItemDto
  ): Promise<CartItemResponseDto> {
    return this.cartItemsService.update(id, updateCartItemDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar item del carrito' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.cartItemsService.remove(id);
  }
}
