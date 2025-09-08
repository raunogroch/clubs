// DTO para registro de usuario
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Roles } from 'src/users/enum/roles.enum';

export class RegisterDto {
  /** Nombre de usuario */
  @IsNotEmpty()
  username: string;

  /** Contraseña */
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  /** Rol del usuario */
  @IsString()
  @IsNotEmpty()
  role: Roles;
}
