// DTO para la creación de usuarios
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { Roles } from '../enum/roles.enum';

export class CreateUserDto {
  /** Nombre de usuario */
  @IsString()
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

  /** Nombre real del usuario */
  @IsString()
  name?: string;

  /** Apellido del usuario */
  @IsString()
  lastname?: string;

  /** Correo electrónico */
  @IsEmail()
  email?: string;

  /** Cédula de identidad */
  @IsString()
  ci?: string;

  /** Fecha de nacimiento */
  @IsDate()
  birth_date?: Date;

  /** Altura en centímetros */
  @IsNumber()
  height?: number;

  /** Peso en kilogramos */
  @IsNumber()
  weight?: number;

  /** Imagen de perfil en base64 */
  @IsString()
  image?: string;
}
