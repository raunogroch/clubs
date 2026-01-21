/**
 * DTO para actualizar un grupo
 */

import { IsString, IsOptional, IsNumber, Min } from 'class-validator';

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

  /**
   * Precio/Mensualidad del grupo (opcional)
   * Costo en Bs. (Bolivianos)
   */
  @IsOptional()
  @IsNumber()
  @Min(0)
  monthly_fee?: number;
}
