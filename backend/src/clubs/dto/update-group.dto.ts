/**
 * DTO para actualizar un grupo
 */

import { IsString, IsOptional } from 'class-validator';

export class UpdateGroupDto {
  /**
   * Nombre del grupo (opcional)
   */
  @IsOptional()
  @IsString()
  name?: string;

  /**
   * Descripción del grupo (opcional)
   */
  @IsOptional()
  @IsString()
  description?: string;
}
