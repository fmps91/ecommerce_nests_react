// src/roles/entities/role.entity.ts
import { Exclude, Expose } from 'class-transformer';

export class RoleEntity {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;

  @Exclude()
  deletedAt?: Date;

  // Relaciones (opcional para no cargarlas siempre)
  users?: any[];

  constructor(partial: Partial<RoleEntity>) {
    Object.assign(this, partial);
  }

  @Expose()
  get permissionsCount(): number {
    return this.permissions?.length || 0;
  }

  @Expose()
  get hasPermissions(): boolean {
    return this.permissions && this.permissions.length > 0;
  }
}