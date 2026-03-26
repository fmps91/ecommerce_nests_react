// src/roles/roles.controller.ts
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
  UseInterceptors,
  ClassSerializerInterceptor,
  Query
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { RoleResponseDto } from './dto/role-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { ApiBody } from '@nestjs/swagger';

@Controller('roles')
@UseInterceptors(ClassSerializerInterceptor)
//@UseGuards(JwtAuthGuard, RolesGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  //@Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createRoleDto: CreateRoleDto): Promise<RoleResponseDto> {
    const role = await this.rolesService.create(createRoleDto);
    return new RoleResponseDto(role);
  }

  @Get()
  //@Roles(UserRole.ADMIN)
  async findAll(): Promise<RoleResponseDto[]> {
    const roles = await this.rolesService.findAll();
    return roles.map(role => new RoleResponseDto(role));
  }

  @Get('default')
  //@Roles(UserRole.ADMIN)
  async getDefaultRole(): Promise<RoleResponseDto> {
    const role = await this.rolesService.getDefaultRole();
    return new RoleResponseDto(role);
  }

  @Get(':id')
  //@Roles(UserRole.ADMIN)
  async findOne(@Param('id') id: string): Promise<RoleResponseDto> {
    const role = await this.rolesService.findOne(id);
    return new RoleResponseDto(role);
  }

  @Get('name/:name')
  //@Roles(UserRole.ADMIN)
  async findByName(@Param('name') name: string): Promise<RoleResponseDto> {
    const role = await this.rolesService.findByName(name);
    return new RoleResponseDto(role);
  }

  @Get(':id/permissions')
  //@Roles(UserRole.ADMIN)
  async getPermissions(@Param('id') id: string): Promise<string[]> {
    return this.rolesService.getRolePermissions(id);
  }

  @Patch(':id')
  //@Roles(UserRole.ADMIN)
  @ApiBody({ type: UpdateRoleDto }) 
  async update(
    @Param('id') id: string, 
    @Body() updateRoleDto: UpdateRoleDto
  ): Promise<RoleResponseDto> {
    const role = await this.rolesService.update(id, updateRoleDto);
    return new RoleResponseDto(role);
  }

  @Patch(':id/permissions/add')
  //@Roles(UserRole.ADMIN)
  @ApiBody({ type: [String] }) 
  async addPermissions(
    @Param('id') id: string,
    @Body('permissions') permissions: string[]
  ): Promise<RoleResponseDto> {
    const role = await this.rolesService.addPermissions(id, permissions);
    return new RoleResponseDto(role);
  }

  @Patch(':id/permissions/remove')
  //@Roles(UserRole.ADMIN)
  @ApiBody({ type: [String] }) 
  async removePermissions(
    @Param('id') id: string,
    @Body() permissions: string[]
  ): Promise<RoleResponseDto> {
    const role = await this.rolesService.removePermissions(id, permissions);
    return new RoleResponseDto(role);
  }

  @Post('assign')
  //@Roles(UserRole.ADMIN)
  async assignRoleToUser(@Body() assignRoleDto: AssignRoleDto) {
    const user = await this.rolesService.assignRoleToUser(assignRoleDto);
    return {
      message: 'Role assigned successfully',
      user: {
        id: user.id,
        email: user.email,
        roleId: user.roleId,
      },
    };
  }

  @Delete(':id')
  //@Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.rolesService.remove(id);
  }

  @Delete('delete/:id')
      //@ApiOperation({ summary: 'Eliminar un producto por su id' })
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param('id') id: string): Promise<void> {
      return this.rolesService.delete(id);
    }

    
}
