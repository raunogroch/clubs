/**
 * DTO para crear un grupo
 */

import {
  IsString,
  IsOptional,
  IsMongoId,
  IsNumber,
  Min,
} from 'class-validator';

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

  /**
   * Precio/Mensualidad del grupo (opcional)
   * Costo en Bs. (Bolivianos)
   */
  @IsOptional()
  @IsNumber()
  @Min(0)
  monthly_fee?: number;
}
