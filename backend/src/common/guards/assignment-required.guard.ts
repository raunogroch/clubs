import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { UsersService } from '../../users/users.service';

@Injectable()
export class AssignmentRequiredGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const jwtUser = request.user;

    // If no user is present, let JwtAuthGuard handle it earlier.
    if (!jwtUser) return true;

    // Only enforce assignment for users with role 'admin'. Other roles pass.
    if (jwtUser.role === 'admin') {
      // Prefer `code` if provided in the token, otherwise fall back to `sub`.
      const identifier = jwtUser.sub;
      try {
        if (!identifier) {
          throw new ForbiddenException(
            'Identificador de usuario ausente en token.',
          );
        }

        const user = await this.usersService.findOneById(identifier);

        const hasAssignment =
          user.assignment_id !== null && user.assignment_id !== undefined;
        if (!hasAssignment) {
          throw new ForbiddenException(
            'El usuario administrador no tiene una asignación válida. Contacta al superadmin.',
          );
        }
      } catch (err) {
        // Re-throw ForbiddenException so client receives 403; any other error also treated as Forbidden
        if (err instanceof ForbiddenException) throw err;
        throw new ForbiddenException(
          'El usuario administrador no tiene una asignación válida. Contacta al superadmin.',
        );
      }
    }

    return true;
  }
}
