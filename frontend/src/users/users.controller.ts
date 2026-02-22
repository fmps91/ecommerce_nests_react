// src/users/users.controller.ts
import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards,
  HttpStatus,
  HttpCode,
  SerializeOptions,
  UseInterceptors,
  ClassSerializerInterceptor 
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from './entities/user.entity';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('users')
//@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({
  excludeExtraneousValues: true,
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiResponse({ 
    status: 201, 
    description: 'Usuario creado exitosamente',
    type: UserResponseDto // Importante: especifica el tipo de respuesta
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 409, description: 'El email ya está registrado' })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.usersService.create(createUserDto);
    return new UserResponseDto(user);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Obtener todos los usuarios (solo administradores)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de usuarios obtenida exitosamente',
    type: [UserResponseDto] // Importante: usa [tipo] para arrays
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'No tiene permisos de administrador' })
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.usersService.findAll();
    return users.map(user => new UserResponseDto(user));
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiParam({ 
    name: 'id', 
    description: 'ID del usuario (UUID v4)',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Usuario encontrado',
    type: UserResponseDto
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.usersService.findOne(id);
    return new UserResponseDto(user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Actualizar un usuario' })
  @ApiParam({ 
    name: 'id', 
    description: 'ID del usuario (UUID v4)',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  //@ApiBody({ type: UpdateUserDto }) // Especifica el tipo del body
  @ApiResponse({ 
    status: 200, 
    description: 'Usuario actualizado exitosamente',
    type: UserResponseDto
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async update(
    @Param('id') id: string, 
    @Body() updateUserDto: UpdateUserDto
  ): Promise<UserResponseDto> {
    const user = await this.usersService.update(id, updateUserDto);
    return new UserResponseDto(user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un usuario (solo administradores)' })
  @ApiParam({ 
    name: 'id', 
    description: 'ID del usuario (UUID v4)',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({ status: 204, description: 'Usuario eliminado exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'No tiene permisos de administrador' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.usersService.remove(id);
  }

  @Patch(':id/toggle-active')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Activar/desactivar un usuario (solo administradores)' })
  @ApiParam({ 
    name: 'id', 
    description: 'ID del usuario (UUID v4)',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Estado del usuario actualizado',
    type: UserResponseDto
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'No tiene permisos de administrador' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async toggleActive(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.usersService.toggleActive(id);
    return new UserResponseDto(user);
  }
}