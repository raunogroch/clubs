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
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  discipline: mongoose.Types.ObjectId;

  @IsDateString()
  @IsNotEmpty()
  dateEvent: Date;

  @IsString()
  @IsNotEmpty()
  place: string;

  @IsArray()
  @IsOptional()
  coaches?: mongoose.Types.ObjectId[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCompetitorDto)
  @IsOptional()
  competitors?: CreateCompetitorDto[];
}
