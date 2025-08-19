// DTO para la creación de competencias
import {
  IsArray,
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateCompetitorDto } from './create-competitor.dto';
import mongoose from 'mongoose';

export class CreateCompetencyDto {
  /** Nombre de la competencia */
  @IsString()
  @IsNotEmpty()
  name: string;

  /** Descripción de la competencia */
  @IsString()
  @IsOptional()
  description?: string;

  /** Disciplina deportiva asociada */
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  discipline: mongoose.Types.ObjectId;

  /** Fecha del evento */
  @IsDateString()
  @IsNotEmpty()
  dateEvent: Date;

  /** Lugar donde se realiza la competencia */
  @IsString()
  @IsNotEmpty()
  place: string;

  /** Lista de entrenadores */
  @IsArray()
  @IsOptional()
  coaches?: mongoose.Types.ObjectId[];

  /** Lista de competidores */
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCompetitorDto)
  @IsOptional()
  competitors?: CreateCompetitorDto[];
}
