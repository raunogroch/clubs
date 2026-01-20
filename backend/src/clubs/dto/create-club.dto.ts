/**
 * DTO para crear un club
 */

import { IsString, IsOptional, IsMongoId } from 'class-validator';

export class CreateClubDto {
  /**
   * Nombre del club (requerido)
   */
  @IsString()
  name: string;

  /**
   * Descripción del club (opcional)
   */
  @IsOptional()
  @IsString()
  description?: string;

  /**
   * Ubicación del club (opcional)
   */
  @IsOptional()
  @IsString()
  location?: string;

  /**
   * ID de la asignación a la que pertenece
   * Debe ser una asignación de la que el usuario es administrador
   */
  @IsMongoId()
  assignment_id: string;
}
