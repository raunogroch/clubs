// DTO para la actualización de competencias
import {
  IsArray,
  IsDateString,
  IsMongoId,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateCompetitorDto } from './create-competitor.dto';
import mongoose from 'mongoose';

export class UpdateCompetencyDto {
  /** Nombre de la competencia */
  @IsString()
  @IsOptional()
  name?: string;

  /** Descripción de la competencia */
  @IsString()
  @IsOptional()
  description?: string;

  /** Disciplina deportiva asociada */
  @IsString()
  @IsOptional()
  @IsMongoId()
  discipline?: mongoose.Types.ObjectId;

  /** Fecha del evento */
  @IsDateString()
  @IsOptional()
  dateEvent?: Date;

  /** Lugar donde se realiza la competencia */
  @IsString()
  @IsOptional()
  place?: string;

  /** Lista de entrenadores */
  @IsArray()
  @IsOptional()
  @IsMongoId()
  coaches?: mongoose.Types.ObjectId[];

  /** Lista de competidores */
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCompetitorDto)
  @IsOptional()
  competitors?: CreateCompetitorDto[];
}
