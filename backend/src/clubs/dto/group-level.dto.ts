import { IsString, IsNumber, IsOptional, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class CreateGroupLevelDto {
  @IsNumber()
  position: number;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateGroupLevelDto {
  @IsOptional()
  @IsNumber()
  position?: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class GroupLevelResponseDto {
  _id?: Types.ObjectId;
  position: number;
  name: string;
  description?: string;
}
