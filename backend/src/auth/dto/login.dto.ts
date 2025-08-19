// DTO para login de usuario
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  /** Nombre de usuario */
  @IsNotEmpty()
  username: string;

  /** Contraseña */
  @IsString()
  @IsNotEmpty()
  password: string;
}
