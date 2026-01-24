// DTO para la creación de usuarios
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
  IsOptional,
  ValidateIf,
  IsEnum,
} from 'class-validator';
import { Roles } from '../enum/roles.enum';
import * as mongoose from 'mongoose';

export class CreateUserDto {
  /** Rol del usuario */
  @IsEnum(Roles)
  @IsNotEmpty()
  role: Roles;

  // ========== CAMPOS COMUNES A MÚLTIPLES ROLES ==========

  /** Nombre de usuario (COACH, ASSISTANT, ADMIN, SUPERADMIN - NO ATHLETE ni PARENT) */
  @ValidateIf((o) =>
    [Roles.COACH, Roles.ASSISTANT, Roles.ADMIN, Roles.SUPERADMIN].includes(
      o.role,
    ),
  )
  @IsNotEmpty({
    message: 'Username is required for this role',
  })
  @IsString()
  @IsOptional()
  username?: string;

  /** Contraseña (COACH, ASSISTANT, ADMIN, SUPERADMIN - NO ATHLETE ni PARENT) */
  @ValidateIf((o) =>
    [Roles.COACH, Roles.ASSISTANT, Roles.ADMIN, Roles.SUPERADMIN].includes(
      o.role,
    ),
  )
  @IsNotEmpty({
    message: 'Password is required for this role',
  })
  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  /** Nombre (requerido para todos excepto PARENT) */
  @ValidateIf((o) =>
    [
      Roles.ATHLETE,
      Roles.COACH,
      Roles.ASSISTANT,
      Roles.ADMIN,
      Roles.SUPERADMIN,
    ].includes(o.role),
  )
  @IsNotEmpty({
    message: 'Name is required for this role',
  })
  @IsString()
  name?: string;

  /** Segundo nombre (ATHLETE, PARENT, COACH, ASSISTANT) */
  @ValidateIf((o) =>
    [Roles.ATHLETE, Roles.PARENT, Roles.COACH, Roles.ASSISTANT].includes(
      o.role,
    ),
  )
  @IsOptional()
  @IsString()
  // middle_name removed from system

  /** Apellido (ATHLETE, PARENT, COACH, ASSISTANT, ADMIN, SUPERADMIN) */
  @ValidateIf((o) =>
    [
      Roles.ATHLETE,
      Roles.PARENT,
      Roles.COACH,
      Roles.ASSISTANT,
      Roles.ADMIN,
      Roles.SUPERADMIN,
    ].includes(o.role),
  )
  @IsOptional()
  @IsString()
  lastname?: string;

  /** Cédula de identidad (ATHLETE, PARENT, COACH, ASSISTANT, ADMIN) */
  @ValidateIf((o) =>
    [
      Roles.ATHLETE,
      Roles.PARENT,
      Roles.COACH,
      Roles.ASSISTANT,
      Roles.ADMIN,
    ].includes(o.role),
  )
  @IsOptional()
  @IsString()
  ci?: string;

  // ========== CAMPOS ESPECÍFICOS DE ATHLETE ==========

  /** Género (ATHLETE) */
  @ValidateIf((o) => o.role === Roles.ATHLETE)
  @IsOptional()
  @IsString()
  gender?: string;

  /** Fecha de nacimiento (ATHLETE) */
  @ValidateIf((o) => o.role === Roles.ATHLETE)
  @IsOptional()
  @IsDate()
  birth_date?: Date;

  /** Fecha de inscripción personalizada (ATHLETE) - debe ser anterior a createdAt */
  @ValidateIf((o) => o.role === Roles.ATHLETE)
  @IsOptional()
  @IsDate()
  inscriptionDate?: Date;

  // ========== CAMPOS ESPECÍFICOS DE PARENT ==========

  /** Teléfono (PARENT) */
  @ValidateIf((o) => o.role === Roles.PARENT)
  @IsOptional()
  @IsString()
  phone?: string;

  /** ID del padre/tutor (ATHLETE) */
  @ValidateIf((o) => o.role === Roles.ATHLETE)
  @IsOptional()
  parent_id?: string | mongoose.Types.ObjectId;

  // ========== CAMPOS OPCIONALES (LEGADO) ==========

  /** Altura en centímetros */
  @IsOptional()
  @IsNumber()
  height?: number;

  /** Peso en kilogramos */
  @IsOptional()
  @IsNumber()
  weight?: number;

  /** Imagen de perfil en base64 (ATHLETE, COACH, ASSISTANT, ADMIN, SUPERADMIN) */
  @ValidateIf((o) =>
    [
      Roles.ATHLETE,
      Roles.COACH,
      Roles.ASSISTANT,
      Roles.ADMIN,
      Roles.SUPERADMIN,
    ].includes(o.role),
  )
  @IsOptional()
  @IsString()
  image?: string;

  /** Rutas de imágenes procesadas */
  @IsOptional()
  images?: {
    small: string;
    medium: string;
    large: string;
  };

  // ========== ESTADO DEL USUARIO ==========

  /** Estado del usuario (activo/inactivo) */
  @IsOptional()
  active?: boolean = true;

  // ========== ADMIN-SPECIFIC FIELDS ==========

  /** ID de asignación (SOLO PARA ADMIN) */
  @ValidateIf((o) => [Roles.ADMIN, Roles.SUPERADMIN].includes(o.role))
  @IsOptional()
  @IsString()
  assignment_id?: string;
}
