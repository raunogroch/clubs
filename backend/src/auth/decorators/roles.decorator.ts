// src/auth/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { Roles as Role } from 'src/users/enum/roles.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
