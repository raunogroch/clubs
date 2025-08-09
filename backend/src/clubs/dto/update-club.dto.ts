import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';

export class UpdateClubDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  place?: string;

  @IsString()
  @IsOptional()
  discipline?: string;

  @IsNotEmpty()
  @IsMongoId({ each: true })
  schedule: Types.ObjectId;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  coaches?: Types.ObjectId[];

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  athletes?: Types.ObjectId[];
}
