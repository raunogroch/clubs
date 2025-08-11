import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { MedalType } from '../schemas/competitor.schema';
import mongoose from 'mongoose';

export class CreateCompetitorDto {
  @IsNotEmpty()
  athlete: mongoose.Types.ObjectId;

  @IsNumber()
  @IsNotEmpty()
  position: number;

  @IsEnum(MedalType)
  @IsNotEmpty()
  medal: MedalType;
}
