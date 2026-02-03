import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateClubLevelDto {
  @IsInt()
  @Min(1)
  position: number;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateClubLevelDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  position?: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
