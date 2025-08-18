// src/auth/guards/roles.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Roles as Role } from 'src/users/enum/roles.enum';

@Injectable()
export class RolesGuard extends JwtAuthGuard {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Primero verifica el JWT con el guardia padre
    const isJwtValid = super.canActivate(context);
    if (!isJwtValid) {
      return false;
    }

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    const hasPermission = requiredRoles.some((role) =>
      user.role?.includes(role),
    );

    if (!hasPermission) {
      throw new ForbiddenException(
        'You are not authorized to access this module',
      );
    }

    return true;
  }
}
