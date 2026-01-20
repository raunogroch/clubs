/**
 * DTO para actualizar un club
 */

import { IsString, IsOptional, IsMongoId } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateClubDto } from './create-club.dto';

export class UpdateClubDto extends PartialType(CreateClubDto) {
  /**
   * Todos los campos son opcionales al actualizar
   */
}
