/**
 * DTO para crear un grupo
 */

import { IsString, IsOptional, IsMongoId } from 'class-validator';

export class CreateGroupDto {
  /**
   * Nombre del grupo (requerido)
   */
  @IsString()
  name: string;

  /**
   * Descripción del grupo (opcional)
   */
  @IsOptional()
  @IsString()
  description?: string;

  /**
   * ID del club al que pertenece
   * Debe ser un club válido
   */
  @IsMongoId()
  club_id: string;
}
