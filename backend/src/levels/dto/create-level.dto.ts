import {
  IsString,
  IsArray,
  IsNumber,
  IsOptional,
  IsMongoId,
} from 'class-validator';

export class CreateLevelAssignmentDto {
  @IsNumber()
  order: number;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateLevelDto {
  @IsString()
  name: string;

  @IsMongoId()
  group_id: string;

  @IsArray()
  @IsOptional()
  level_assignment?: CreateLevelAssignmentDto[];
}
