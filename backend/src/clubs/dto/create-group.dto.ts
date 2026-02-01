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
    * (description removed)

  /**
   * ID del club al que pertenece
   * Debe ser un club válido
   */
  @IsMongoId()
  club_id: string;

  /**
   * Assignment al que pertenece el grupo (opcional - se puede inferir del club)
   */
  @IsOptional()
  @IsMongoId()
  assignment_id?: string;

  /**
   * Precio/Mensualidad del grupo (opcional)
   * Costo en Bs. (Bolivianos)
   */
  @IsOptional()
  @IsNumber()
  @Min(0)
  monthly_fee?: number;
}
