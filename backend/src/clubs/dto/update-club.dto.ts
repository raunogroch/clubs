import { IsArray, IsMongoId, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

class Schedule {
  @IsString()
  @IsOptional()
  startTime: string;

  @IsString()
  @IsOptional()
  endTime: string;
}

export class UpdateClubDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsOptional()
  schedule?: Schedule;

  @IsString()
  @IsOptional()
  place?: string;

  @IsString()
  @IsOptional()
  discipline?: string;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  coaches?: Types.ObjectId[];

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  athletes?: Types.ObjectId[];
}
