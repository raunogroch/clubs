import {
  IsNotEmpty,
  IsString,
  IsArray,
  IsMongoId,
  IsOptional,
} from 'class-validator';

/**
 * DTO para crear una nueva asignación de módulo
 * Solo el superadmin puede usar este DTO
 */
export class CreateAssignmentDto {
  /** Nombre del módulo a asignar */
  @IsNotEmpty()
  @IsString()
  module_name: string;

  /** Array de IDs de administradores a asignar al módulo */
  @IsNotEmpty()
  @IsArray()
  @IsMongoId({ each: true })
  assigned_admins: string[];
}
