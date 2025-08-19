// DTO para registro de usuario
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

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
  role: string;
}
