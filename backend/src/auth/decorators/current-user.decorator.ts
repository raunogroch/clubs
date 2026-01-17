/**
 * Decorador Personalizado: @CurrentUser()
 * 
 * Propósito: Inyectar automáticamente el usuario autenticado en los métodos del controlador
 * 
 * El flujo es:
 * 1. El JwtAuthGuard valida el token y extrae la información del usuario
 * 2. Coloca el usuario en request.user
 * 3. Este decorador obtiene request.user y lo pasa como parámetro al método
 * 
 * Uso en un controlador:
 * @Get('profile')
 * getProfile(@CurrentUser() user: User) {
 *   // user contiene { id, username, role, etc }
 *   return user;
 * }
 * 
 * Sin el decorador, tendrías que hacer:
 * @Get('profile')
 * getProfile(@Req() req: Request) {
 *   return req.user;
 * }
 */

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorador que extrae el usuario del request
 * @param data - Datos adicionales (no usado en este caso)
 * @param ctx - Contexto de ejecución actual
 * @returns El objeto user del request
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    // Obtener el request HTTP actual
    const request = ctx.switchToHttp().getRequest();
    
    // Retornar el usuario que fue colocado por JwtAuthGuard
    // Contiene: { id, username, role, jti }
    return request.user;
  },
);
