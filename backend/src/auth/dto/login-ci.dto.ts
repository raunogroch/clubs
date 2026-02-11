// DTO para login de usuario por CI (Carnet de Identidad)
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginCiDto {
  /** Carnet de Identidad */
  @IsNotEmpty()
  @IsString()
  ci: string;
}
