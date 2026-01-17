/**
 * RolesGuard - Guardia de Roles
 * 
 * Propósito: Validar que el usuario tiene el rol requerido para acceder a una ruta
 * 
 * Flujo:
 * 1. Primero valida que el JWT sea válido (heredado de JwtAuthGuard)
 * 2. Extrae el rol del payload del JWT
 * 3. Compara el rol del usuario con los roles requeridos en el decorador @Roles()
 * 4. Si el usuario tiene uno de los roles requeridos, permite el acceso
 * 5. Si no, lanza ForbiddenException (403)
 * 
 * Uso en un controlador:
 * @Roles(Role.ADMIN, Role.SUPERADMIN)
 * @Get('/reportes')
 * getReportes() { ... }
 */

import {
  Injectable,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Roles as Role } from 'src/users/enum/roles.enum';

@Injectable()
export class RolesGuard extends JwtAuthGuard {
  /**
   * Constructor
   * @param reflector - Servicio para leer metadatos de los decoradores
   */
  constructor(private reflector: Reflector) {
    super();
  }

  /**
   * Valida si el usuario tiene el rol requerido
   * @param context - Contexto de ejecución actual
   * @returns true si el usuario tiene acceso, false si no
   * @throws ForbiddenException si el usuario no tiene los roles requeridos
   */
  canActivate(context: ExecutionContext) {
    /**
     * Primero verifica el JWT con el guardia padre (JwtAuthGuard)
     * Esto valida que el token sea válido y no esté expirado
     */
    const isJwtValid = super.canActivate(context);
    if (!isJwtValid) {
      return false;
    }

    /**
     * Obtener los roles requeridos del decorador @Roles()
     * Si el decorador no está presente, requiredRoles será undefined
     */
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si no hay roles requeridos, permite el acceso
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
