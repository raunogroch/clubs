/**
 * DTO para crear un club
 */

import { IsString, IsOptional, IsMongoId, IsArray } from 'class-validator';

export class CreateClubDto {
  /**
   * ID del deporte (requerido)
   * Debe ser un deporte válido registrado en el sistema
   */
  @IsMongoId()
  sport_id: string;

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

  /**
   * Lista opcional de grupos (IDs) que pertenecen al club
   */
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  groups?: string[];
}
