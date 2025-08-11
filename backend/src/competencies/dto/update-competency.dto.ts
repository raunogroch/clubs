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
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  @IsMongoId()
  discipline?: mongoose.Types.ObjectId;

  @IsDateString()
  @IsOptional()
  dateEvent?: Date;

  @IsString()
  @IsOptional()
  place?: string;

  @IsArray()
  @IsOptional()
  @IsMongoId()
  coaches?: mongoose.Types.ObjectId[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCompetitorDto)
  @IsOptional()
  competitors?: CreateCompetitorDto[];
}
