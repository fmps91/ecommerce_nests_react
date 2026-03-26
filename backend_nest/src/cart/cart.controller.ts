import {
    Controller,
    Post,
    Get,
    Delete,
    Put,
    Body,
    Param,
    HttpStatus,
    HttpCode,
    UsePipes,
    ValidationPipe,
    ParseUUIDPipe
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { CartEntity } from './entities/cart.entity';
import { CartResponseDto } from './dto/cart-response.dto';

@ApiTags('cart')
@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) {}

    @Post()
    @ApiOperation({ summary: 'Crear un nuevo carrito' })
    @ApiResponse({ status: 201, type: CartResponseDto })
    @UsePipes(new ValidationPipe({ transform: true }))
    async create(@Body() createCartDto?: CreateCartDto): Promise<CartEntity> {
        return this.cartService.create(createCartDto);
    }

    @Post(':id/items')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Agregar producto al carrito' })
    @ApiParam({ name: 'id', description: 'ID del carrito' })
    @ApiResponse({ status: 200, type: CartResponseDto })
    @ApiResponse({ status: 400, description: 'Stock insuficiente' })
    @ApiResponse({ status: 404, description: 'Carrito o producto no encontrado' })
    @UsePipes(new ValidationPipe({ transform: true }))
    async addItem(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() addItemDto: AddItemDto
    ): Promise<CartEntity> {
        return this.cartService.addItem(id, addItemDto);
    }

    @Delete(':id/items/:productId')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Eliminar producto del carrito' })
    @ApiParam({ name: 'id', description: 'ID del carrito' })
    @ApiParam({ name: 'productId', description: 'ID del producto' })
    @ApiResponse({ status: 200, type: CartResponseDto })
    @ApiResponse({ status: 404, description: 'Producto no encontrado en el carrito' })
    async removeItem(
        @Param('id', ParseUUIDPipe) id: string,
        @Param('productId', ParseUUIDPipe) productId: string
    ): Promise<CartEntity> {
        return this.cartService.removeItem(id, productId);
    }

    @Put(':id/items/:productId')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Actualizar cantidad de un producto en el carrito' })
    @ApiParam({ name: 'id', description: 'ID del carrito' })
    @ApiParam({ name: 'productId', description: 'ID del producto' })
    @ApiResponse({ status: 200, type: CartResponseDto })
    @ApiResponse({ status: 404, description: 'Producto no encontrado' })
    @UsePipes(new ValidationPipe({ transform: true }))
    async updateItem(
        @Param('id', ParseUUIDPipe) id: string,
        @Param('productId', ParseUUIDPipe) productId: string,
        @Body() updateItemDto: UpdateItemDto
    ): Promise<CartEntity> {
        return this.cartService.updateItem(id, productId, updateItemDto);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Ver contenido del carrito' })
    @ApiParam({ name: 'id', description: 'ID del carrito' })
    @ApiResponse({ status: 200, type: CartResponseDto })
    @ApiResponse({ status: 404, description: 'Carrito no encontrado' })
    async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<CartEntity> {
        return this.cartService.findOne(id);
    }


    @Delete(':id/clear')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Vaciar carrito' })
    @ApiParam({ name: 'id', description: 'ID del carrito' })
    @ApiResponse({ status: 200, type: CartResponseDto })
    @ApiResponse({ status: 404, description: 'Carrito no encontrado' })
    async clearCart(@Param('id', ParseUUIDPipe) id: string): Promise<CartEntity> {
        return this.cartService.clearCart(id);
    }
}