// DTO para login de usuario por CI (Carnet de Identidad)
import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';

export class LoginCiDto {
  /** Carnet de Identidad */
  @IsNotEmpty()
  @IsString()
  ci: string;

  /** Rol del usuario seleccionado (athlete o parent) */
  @IsOptional()
  @IsEnum(['athlete', 'parent'])
  role?: 'athlete' | 'parent';
}
