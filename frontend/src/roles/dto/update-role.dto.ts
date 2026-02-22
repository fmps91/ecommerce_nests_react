// src/roles/dto/update-role.dto.ts
import { PartialType } from '@nestjs/swagger'; // Cambia esta importación
import { CreateRoleDto } from './create-role.dto';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}