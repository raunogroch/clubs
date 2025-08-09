import { IsArray, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateClubDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  place: string;

  @IsString()
  @IsNotEmpty()
  discipline: string;

  @IsNotEmpty()
  @IsMongoId({ each: true })
  schedule: Types.ObjectId;

  @IsArray()
  @IsMongoId({ each: true })
  coaches: Types.ObjectId[];

  @IsArray()
  @IsMongoId({ each: true })
  athletes: Types.ObjectId[];
}
