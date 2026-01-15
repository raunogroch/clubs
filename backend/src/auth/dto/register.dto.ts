// DTO para registro de usuario
import {
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsDate,
  ValidateIf,
  IsEnum,
} from 'class-validator';
import { Roles } from 'src/users/enum/roles.enum';

export class RegisterDto {
  /** Rol del usuario */
  @IsEnum(Roles)
  @IsNotEmpty()
  role: Roles;

  // ========== CAMPOS COMUNES A MÚLTIPLES ROLES ==========

  /** Nombre de usuario (ATHLETE, COACH, ASSISTANT, ADMIN, SUPERADMIN) */
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
    message: 'Username is required for this role',
  })
  @IsString()
  username?: string;

  /** Contraseña (ATHLETE, COACH, ASSISTANT, ADMIN, SUPERADMIN) */
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
    message: 'Password is required for this role',
  })
  @IsString()
  @MinLength(6)
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
  middle_name?: string;

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
  birth_date?: Date;

  // ========== CAMPOS ESPECÍFICOS DE PARENT ==========

  /** Teléfono (PARENT) */
  @ValidateIf((o) => o.role === Roles.PARENT)
  @IsOptional()
  @IsString()
  phone?: string;

  // ========== CAMPOS COMUNES A MÚLTIPLES ROLES (IMÁGENES) ==========

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

  /** Rutas de imágenes procesadas (ATHLETE, COACH, ASSISTANT, ADMIN, SUPERADMIN) */
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
}
