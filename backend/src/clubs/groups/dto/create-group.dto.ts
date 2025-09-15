import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
  ArrayMinSize,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Turn, WeekDays } from '../schema/group.schema';

export class DailyScheduleDto {
  @IsEnum(WeekDays)
  day: WeekDays;

  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'startTime debe tener formato HH:MM',
  })
  startTime: string;

  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'endTime debe tener formato HH:MM',
  })
  endTime: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

export class CreateGroupDto {
  @IsMongoId()
  @IsNotEmpty()
  club: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsEnum(Turn)
  turn: Turn;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DailyScheduleDto)
  dailySchedules: DailyScheduleDto[];

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  place: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'El grupo debe tener al menos un entrenador' })
  @IsMongoId({ each: true })
  coaches: string[];

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  athletes?: string[];

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
