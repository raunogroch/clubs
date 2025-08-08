import { IsArray, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

class Schedule {
  @IsString()
  @IsNotEmpty()
  startTime: string;

  @IsString()
  @IsNotEmpty()
  endTime: string;
}

export class CreateClubDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  schedule: Schedule;

  @IsString()
  @IsNotEmpty()
  place: string;

  @IsString()
  @IsNotEmpty()
  discipline: string;

  @IsArray()
  @IsMongoId({ each: true })
  coaches: Types.ObjectId[];

  @IsArray()
  @IsMongoId({ each: true })
  athletes: Types.ObjectId[];
}
