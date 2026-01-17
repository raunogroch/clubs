import {
  IsOptional,
  IsString,
  IsArray,
  IsMongoId,
  IsBoolean,
} from 'class-validator';

/**
 * DTO para actualizar una asignación de módulo
 * Solo el superadmin puede usar este DTO
 */
export class UpdateAssignmentDto {
  /** Nombre del módulo (opcional) */
  @IsOptional()
  @IsString()
  module_name?: string;

  /** Array actualizado de IDs de administradores asignados (opcional) */
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  assigned_admins?: string[];

  /** Estado activo/inactivo (opcional) */
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
