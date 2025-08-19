// DTO para la creación de competidores
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { MedalType } from '../schemas/competitor.schema';
import mongoose from 'mongoose';

export class CreateCompetitorDto {
  /** ID del atleta */
  @IsNotEmpty()
  athlete: mongoose.Types.ObjectId;

  /** Posición obtenida en la competencia */
  @IsNumber()
  @IsNotEmpty()
  position: number;

  /** Medalla obtenida */
  @IsEnum(MedalType)
  @IsNotEmpty()
  medal: MedalType;
}
